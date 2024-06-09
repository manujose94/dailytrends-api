import { NewsUseCase } from "../../../src/application/usecases/feed-use-case";
import { INewsProvider } from "../../../src/application/ports/providers/provider-news-feeds-interface";
import { FeedEntity } from "../../../src/domain/feed/entities/feed-entity";
import IFeedRepository from "../../../src/domain/port/feeds-repository-interface";
import { NewsService } from "../../../src/application/services/news-feed-service";
import { FeedData } from "../../../src/application/usecases/dto/feed-data-dto";




describe('NewsUseCase', () => {
  let newsUseCase: NewsUseCase;
  let newsService: jest.Mocked<NewsService>;
  let feedRepository: jest.Mocked<IFeedRepository>;
  let newsProvider: jest.Mocked<INewsProvider>;

  beforeEach(() => {
    feedRepository = {
      create: jest.fn(),
      read: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      list: jest.fn(),
      getFeedsByProvider: jest.fn(),
      getFeedsByProviderName: jest.fn(),
    } as unknown as jest.Mocked<IFeedRepository>;

    newsProvider = {
      getNameOfProvider: jest.fn(),
      getNewsFeeds: jest.fn(),
    } as unknown as jest.Mocked<INewsProvider>;

    newsService = new NewsService(feedRepository, [newsProvider]) as jest.Mocked<NewsService>;
    newsUseCase = new NewsUseCase(newsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
 
  describe('executeScrape', () => {
    it('should scrape and save feeds from a provider', async () => {
      const providerName = 'testProvider';
      const feeds: FeedEntity[] = [
        new FeedEntity('Title of News1', 'http://url1.com', new Date(), providerName, 'type1'),
      ];

      newsProvider.getNameOfProvider.mockReturnValue(providerName);
      newsProvider.getNewsFeeds.mockResolvedValue(feeds);
      feedRepository.create.mockResolvedValue('feed-id');

      const result = await newsUseCase.executeScrape(providerName);

      expect(newsProvider.getNewsFeeds).toHaveBeenCalledWith(undefined);
      expect(feedRepository.create).toHaveBeenCalledWith(expect.any(FeedEntity));
      expect(result).toEqual(feeds);
    });
  });

  describe('executeScrapeAll', () => {
    it('should scrape and save all feeds from all providers', async () => {
      const feeds: FeedEntity[] = [
        new FeedEntity('Title of News1', 'http://url1.com', new Date(), 'EMUNDO', 'type1'),
      ];

      newsProvider.getNewsFeeds.mockResolvedValue(feeds);
      feedRepository.create.mockResolvedValue('feed-id');

      const result = await newsUseCase.executeScrapeAll();

      expect(newsProvider.getNewsFeeds).toHaveBeenCalledWith(undefined);
      expect(feedRepository.create).toHaveBeenCalledWith(expect.any(FeedEntity));
      expect(result).toEqual(feeds);
    });
  });

  describe('getFeedsByProvider', () => {
    it('should get feeds by provider', async () => {
      const feeds: FeedEntity[] = [
        new FeedEntity('Title of News1', 'http://url1.com', new Date(), 'EMUNDO', 'type1'),
      ];

      feedRepository.getFeedsByProvider.mockResolvedValue(feeds);

      const result = await newsUseCase.getFeedsByProvider();

      expect(feedRepository.getFeedsByProvider).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(feeds);
    });
  });

  describe('getFeedsByProviderName', () => {
    it('should get feeds by provider name', async () => {
      const providerName = 'EMUNDO';
      const feeds: FeedEntity[] = [
        new FeedEntity('Title of News1', 'http://url1.com', new Date(), providerName, 'type1'),
      ];

      feedRepository.getFeedsByProviderName.mockResolvedValue(feeds);

      const result = await newsUseCase.getFeedsByProviderName(providerName);

      expect(feedRepository.getFeedsByProviderName).toHaveBeenCalledWith(providerName);
      expect(result).toEqual(feeds);
    });
  });

  describe('CRUD operations', () => {
    it('should create a feed', async () => {
      const feedData: FeedData = {
        title: 'Title of News1',
        url: 'http://url1.com',
        provider: 'EMUNDO',
        type: 'type1',
      };

      feedRepository.create.mockResolvedValue('feed-id');

      const result = await newsUseCase.create(feedData);

      expect(feedRepository.create).toHaveBeenCalledWith(expect.any(FeedEntity));
      expect(result).toEqual('feed-id');
    });

    it('should read a feed', async () => {
      const feed = new FeedEntity('Title of News1', 'http://url1.com', new Date(), 'EMUNDO', 'type1');
      const feedId = 'feed-id';

      feedRepository.read.mockResolvedValue(feed);

      const result = await newsUseCase.read(feedId);

      expect(feedRepository.read).toHaveBeenCalledWith(feedId);
      expect(result).toEqual(feed);
    });

    it('should update a feed', async () => {
      const feedId = 'feed-id';
      const feedData: Partial<FeedData> = { title: 'Updated Title' };
      const existingFeed = new FeedEntity('Title of News1', 'http://url1.com', new Date(), 'EMUNDO', 'type1');

      feedRepository.read.mockResolvedValue(existingFeed);
      feedRepository.update.mockResolvedValue(true);

      const result = await newsUseCase.update(feedId, feedData);

      expect(feedRepository.read).toHaveBeenCalledWith(feedId);
      expect(feedRepository.update).toHaveBeenCalledWith(feedId, expect.any(FeedEntity));
      expect(result).toBe(true);
    });

    it('should delete a feed', async () => {
      const feedId = 'feed-id';

      feedRepository.delete.mockResolvedValue(undefined);

      await newsUseCase.delete(feedId);

      expect(feedRepository.delete).toHaveBeenCalledWith(feedId);
    });

    it('should list feeds', async () => {
      const feeds: FeedEntity[] = [
        new FeedEntity('Title of News1', 'http://url1.com', new Date(), 'EMUNDO', 'type1'),
      ];

      feedRepository.list.mockResolvedValue(feeds);

      const result = await newsUseCase.list();

      expect(feedRepository.list).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(feeds);
    });
  });
});
