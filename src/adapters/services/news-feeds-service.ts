import { FeedEntity } from "../../domain/feeds/entities/feed-entity";
import IFeedRepository from "../../domain/auth/port/feeds-repository-interface";
import { INewsProvider } from "../providers/provider-feeds-interface";

export class NewsService {
  private feedRepository: IFeedRepository;
  private providers: INewsProvider[];

  constructor(feedRepository: IFeedRepository, providers: INewsProvider[]) {
    this.feedRepository = feedRepository;
    this.providers = providers;
  }

  async scrapeAndGetFeeds(providerName: string): Promise<FeedEntity[]> {
    const provider = this.providers.find(
      (p) => p.getNameOfProvider() === providerName
    );
    if (!provider) {
      throw new Error(`Provider ${providerName} not found`);
    }
    return await provider.getNews();
  }

  //TODO:Performance this method is not optimized
  async scrapeAndGetAllFeeds(): Promise<FeedEntity[]> {
    let allFeeds: FeedEntity[] = [];
    for (const provider of this.providers) {
      const feeds = await provider.getNews();
      await this.saveFeeds(feeds);
      allFeeds = allFeeds.concat(feeds);
    }
    return allFeeds;
  }

  async saveFeeds(feeds: FeedEntity[]) {
    for (const feed of feeds) {
      await this.feedRepository.create(feed);
    }
  }

  async getFeeds(): Promise<FeedEntity[]> {
    return await this.feedRepository.getFeedsByProvider(5);
  }

  async getFeedsByProviderName(name: string): Promise<FeedEntity[]> {
    return await this.feedRepository.getFeedsByProviderName(name);
  }

  async getFeedsByProvider(limit: number): Promise<FeedEntity[]> {
    return await this.feedRepository.getFeedsByProvider(limit);
  }

  async create(feed: FeedEntity): Promise<string> {
    feed.publicationDate = new Date();
    await this.feedRepository.create(feed);
    return `Feed with title "${feed.title}" created successfully.`;
  }
}
