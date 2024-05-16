import { FeedEntity } from "../entities/feed-entity";

export interface IFeedUserCase {
  executeScrape(providerName: string): Promise<FeedEntity[]>;
  executeScrapeAll(): Promise<FeedEntity[]>;
  getFeedsByProvider(limit: number): Promise<FeedEntity[]>;
  getFeedsByProviderName(provider: string): Promise<FeedEntity[]>;
  create(feed: FeedEntity): Promise<string>;
}
