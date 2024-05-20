import axios from "axios";
import { BBCParser } from "../../adapters/services/parser-bbc-service";
import { INewsProvider } from "../../adapters/providers/provider-news-feeds-interface";
import { normalizeProviderName } from "../../common/utils/normalize-provider-name";
import { FeedEntity } from "../../domain/feed/entities/feed-entity";

export class BBCNewsProvider implements INewsProvider {
  name = "BBC";
  private parser: BBCParser;

  constructor() {
    this.parser = new BBCParser();
  }
  getNameOfProvider(): string {
    return normalizeProviderName(this.name);
  }

  async getNewsFeeds(limit?: number): Promise<FeedEntity[]> {
    const response = await axios.get("https://www.bbc.com/");
    return this.parser.parse(response.data, this.name, limit);
  }
}
