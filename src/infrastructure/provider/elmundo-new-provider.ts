import { ElMundoParser } from "../../adapters/services/parser-elmundo-service";
import { INewsProvider } from "../../adapters/providers/provider-news-feeds-interface";
import { FeedEntity } from "../../domain/feed/entities/feed-entity";
import axios from "axios";

export class ElMundoNewsProvider implements INewsProvider {
  name = "ELMUNDO";
  private parser: ElMundoParser;

  constructor() {
    this.parser = new ElMundoParser();
  }
  getNameOfProvider(): string {
    return this.name;
  }

  async getNewsFeeds(limit?: number): Promise<FeedEntity[]> {
    const response = await axios.get("https://www.elmundo.es/");
    return this.parser.parse(response.data, this.name, limit);
  }
}
