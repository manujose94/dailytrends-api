import { get } from "mongoose";
import { FeedEntity } from "../feed/entities/feed-entity";
import { IRepository } from "./repository-interface";

export default interface IFeedRepository extends IRepository<FeedEntity> {
  getFeedsByDate(date: Date): Promise<FeedEntity[]>;
  getFeeds(): Promise<FeedEntity[]>;
  getFeedsByProvider(limit?: number): Promise<FeedEntity[]>;
  getFeedsByProviderName(provider: string): Promise<FeedEntity[]>;
  create(feed: FeedEntity): Promise<void>;
}
