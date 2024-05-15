import { ElMundoParser } from "../../adapters/services/parser-elmundo-service";
import { INewsProvider } from "../../adapters/providers/provider-feeds-interface";
import { FeedEntity } from "../../domain/feeds/entities/feed-entity";
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

  async getNews(): Promise<FeedEntity[]> {
    const response = await axios.get("https://www.elmundo.es/");
    return this.parser.parse(response.data, this.name);
  }
}
