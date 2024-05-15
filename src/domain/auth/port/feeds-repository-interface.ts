import { get } from "mongoose";
import { FeedEntity } from "../../feeds/entities/feed-entity";

export default interface IFeedRepository {
  getFeedsByDate(date: Date): Promise<FeedEntity[]>;
  getFeeds(): Promise<FeedEntity[]>;
  getFeedsByProvider(limit: number): Promise<FeedEntity[]>;
  getFeedsByProviderName(provider: string): Promise<FeedEntity[]>;
  create(feed: FeedEntity): Promise<void>;
  delete(feed: FeedEntity): Promise<void>;
}
