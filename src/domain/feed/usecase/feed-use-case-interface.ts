import { FeedEntity } from "../entities/feed-entity";

export interface IFeedUserCase {
  executeScrape(providerName: string): Promise<FeedEntity[]>;
  executeScrapeAll(): Promise<FeedEntity[]>;
  getFeedsByProvider(limit: number): Promise<FeedEntity[]>;
  getFeedsByProviderName(provider: string): Promise<FeedEntity[]>;
  create(feed: FeedEntity): Promise<string | null>;
  read(id: string): Promise<FeedEntity | null>;
  update(id: string, feed: Partial<FeedEntity>): Promise<boolean | null>;
  delete(id: string): Promise<void>;
  list(limit?: number): Promise<FeedEntity[]>;
}
