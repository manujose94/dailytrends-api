import axios from "axios";
import { BBCParser } from "../../adapters/services/parser-bbc-service";
import { INewsProvider } from "../../adapters/providers/provider-feeds-interface";
import { normalizeProviderName } from "../../common/utils/normalize-provider-name";
import { FeedEntity } from "../../domain/feeds/entities/feed-entity";

export class BBCNewsProvider implements INewsProvider {
  name = "BBC";
  private parser: BBCParser;

  constructor() {
    this.parser = new BBCParser();
  }
  getNameOfProvider(): string {
    return normalizeProviderName(this.name);
  }

  async getNews(): Promise<FeedEntity[]> {
    const response = await axios.get("https://www.bbc.com/");
    return this.parser.parse(response.data, this.name);
  }
}
