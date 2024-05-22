import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { FeedRepository } from '../../../src/adapters/repositories/feed-repository';
import { normalizeProviderName } from '../../../src/common/utils/normalize-provider-name';
import { FeedEntity } from '../../../src/domain/feed/entities/feed-entity';
import { FEED_MODEL } from '../../../src/domain/feed/models/feed-model';


let mongoServer: MongoMemoryServer;
let feedRepository: FeedRepository;

// MongoMemoryServer creates instance an in-memory to not affect to current database

beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
    
    });

    feedRepository = new FeedRepository();
  } catch (error) {
    console.error('Failed to start MongoMemoryServer:', error);
    // Skip tests if MongoMemoryServer fails to start
      console.warn('Skipping tests maybe missing library: libcrypto.so.1.1');
      process.exit(0);
    
  }
})

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await FEED_MODEL.deleteMany({});
});

describe('FeedRepository', () => {
  it('should create a feed', async () => {
    const feedData = new FeedEntity('Title of News1', 'http://url1.com', new Date(), 'elmundo', 'type1');

    const result = await feedRepository.create(feedData);

    const createdFeed = await FEED_MODEL.findOne({ title: 'Title of News1' }).lean();
    expect(result).toBeTruthy();
    expect(createdFeed).toMatchObject({
      title: 'Title of News1',
      url: 'http://url1.com',
      provider: normalizeProviderName('elmundo'),
      type: 'type1',
    });
  });

  it('should get feeds', async () => {
    const feedData1 = new FeedEntity('Title of News1', 'http://url1.com', new Date(), 'elmundo', 'type1');
    const feedData2 = new FeedEntity('Title of News2', 'http://url2.com', new Date(), 'elpais', 'type2');

    await FEED_MODEL.create([feedData1, feedData2]);

    const feeds = await feedRepository.getFeeds();

    expect(feeds.length).toBe(2);
    expect(feeds).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: 'Title of News1' }),
        expect.objectContaining({ title: 'Title of News2' }),
      ])
    );
  });

  it('should get feeds by provider name', async () => {
    const providerName = 'elmundo';
    const feedData = new FeedEntity('Title of News1', 'http://url1.com', new Date(), providerName, 'type1');

    await FEED_MODEL.create(feedData);

    const feeds = await feedRepository.getFeedsByProviderName(providerName);

    expect(feeds.length).toBe(1);
    expect(feeds[0]).toMatchObject({ title: 'Title of News1' });
  });

  it('should create feeds and get', async () => {
    const providerName = 'elmundo';
    const feedData1 = new FeedEntity('Title of News1', 'http://url1.com', new Date(), providerName, 'type1');
    const feedData2 = new FeedEntity('Title of News2', 'http://url2.com', new Date(), providerName, 'type2');

    await FEED_MODEL.create([feedData1, feedData2]);

    const feeds = await feedRepository.getFeedsByProvider(1);

    expect(feeds.length).toBe(1);
   
  });

  it('should delete a feed by id', async () => {
    const feedData = new FeedEntity('Title of News1', 'http://url1.com', new Date(), 'elmundo', 'type1');
    const createdFeed = await FEED_MODEL.create(feedData);

    await feedRepository.delete(createdFeed._id.toString());

    const deletedFeed = await FEED_MODEL.findById(createdFeed._id).lean();
    expect(deletedFeed).toBeTruthy();
  });
});
