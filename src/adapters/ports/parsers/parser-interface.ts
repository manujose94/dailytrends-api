import { FeedEntity } from "../../../domain/feeds/entities/feed-entity";

export interface IParser {
  parse(rawData: string, source: string): FeedEntity[];
}
