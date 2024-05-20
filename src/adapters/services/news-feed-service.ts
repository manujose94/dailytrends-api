import { FeedEntity } from "../../domain/feed/entities/feed-entity";
import IFeedRepository from "../../domain/port/feeds-repository-interface";
import { INewsProvider } from "../providers/provider-news-feeds-interface";

export class NewsService {
  private feedRepository: IFeedRepository;
  private providers: INewsProvider[];

  constructor(feedRepository: IFeedRepository, providers: INewsProvider[]) {
    this.feedRepository = feedRepository;
    this.providers = providers;
  }

  async scrapeAndGetFeeds(
    providerName: string,
    limit?: number
  ): Promise<FeedEntity[]> {
    const provider = this.providers.find(
      (p) => p.getNameOfProvider() === providerName
    );
    if (!provider) {
      throw new Error(`Provider ${providerName} not found`);
    }
    return await provider.getNewsFeeds(limit);
  }

  //TODO:Performance this method is not optimized
  async scrapeAndGetAllFeeds(): Promise<FeedEntity[]> {
    let allFeeds: FeedEntity[] = [];
    for (const provider of this.providers) {
      const feeds = await provider.getNewsFeeds();
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

  async getFeedsByProvider(limit?: number): Promise<FeedEntity[]> {
    return await this.feedRepository.getFeedsByProvider(limit);
  }

  async create(feed: FeedEntity): Promise<string | null> {
    feed.publicationDate = new Date();
    return await this.feedRepository.create(feed);
  }

  async read(id: string): Promise<FeedEntity | null> {
    return await this.feedRepository.read(id);
  }

  async update(id: string, feed: Partial<FeedEntity>): Promise<boolean | null> {
    return await this.feedRepository.update(id, feed);
  }

  async delete(id: string): Promise<void> {
    await this.feedRepository.delete(id);
  }

  async list(limit?: number): Promise<FeedEntity[]> {
    return await this.feedRepository.list(limit);
  }
}
