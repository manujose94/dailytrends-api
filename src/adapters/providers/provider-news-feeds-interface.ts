import { FeedEntity } from "../../domain/feed/entities/feed-entity";
export interface INewsProvider {
  getNewsFeeds(limit?: number): Promise<FeedEntity[]>;
  getNameOfProvider(limit?: number): string;
}
