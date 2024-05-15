import { FeedEntity } from "../../domain/feeds/entities/feed-entity";
export interface INewsProvider {
  getNews(): Promise<FeedEntity[]>;
  getNameOfProvider(): string;
}
