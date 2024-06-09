import { FeedEntity } from "../../../domain/feed/entities/feed-entity";

export interface IParser {
  parse(rawData: string, source: string, limit?: number): FeedEntity[];
  getSelector(): string;
  getBaseUrl(): string;
}
