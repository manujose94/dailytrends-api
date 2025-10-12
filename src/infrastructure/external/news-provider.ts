import axios from "axios";
import { INewsProvider } from "../../application/ports/providers/provider-news-feeds-interface";
import { FeedEntity } from "../../domain/feed/entities/feed-entity";
import { IParser } from "../../application/ports/parsers/parser-interface";
import { ICacheService } from "../../application/ports/services/cache-service-interface";

export class NewsProvider implements INewsProvider {
  name: string;
  private parser: IParser;
  private cacheService: ICacheService;

  constructor(name: string, parser: IParser, cacheService: ICacheService) {
    this.name = name;
    this.parser = parser;
    this.cacheService = cacheService;
  }

  getNameOfProvider(): string {
    return this.name;
  }

  async getNewsFeeds(limit?: number): Promise<FeedEntity[]> {
    const cacheKey = `${this.name}-news-feeds-${limit || 'all'}`;
    const cachedData = await this.cacheService.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const response = await axios.get(this.parser.getBaseUrl());
    const feeds = this.parser.parse(response.data, this.name, limit);

    await this.cacheService.set(cacheKey, JSON.stringify(feeds), { EX: 7200 });

    return feeds;
  }
}
