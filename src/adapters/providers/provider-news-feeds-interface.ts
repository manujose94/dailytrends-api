import { FeedEntity } from "../../domain/feed/entities/feed-entity";
export interface INewsProvider {
  getNews(): Promise<FeedEntity[]>;
  getNameOfProvider(): string;
}
