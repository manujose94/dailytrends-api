import { ElPaisParser } from "../../adapters/services/parser-elpais-service";
import { INewsProvider } from "../../adapters/providers/provider-news-feeds-interface";
import { FeedEntity } from "../../domain/feed/entities/feed-entity";
import axios from "axios";

export class ElPaisNewsProvider implements INewsProvider {
  name = "ELPAIS";
  private parser: ElPaisParser;

  constructor() {
    this.parser = new ElPaisParser();
  }
  getNameOfProvider(): string {
    return this.name;
  }

  async getNewsFeeds(limit?: number): Promise<FeedEntity[]> {
    const response = await axios.get("https://www.elpais.com/");
    return this.parser.parse(response.data, this.name, limit);
  }
}

/** 
  async getNews() {
    const response = await axios.get(this.url);
    const $ = cheerio.load(response.data);
    const news = [];
    $("article").each((index, element) => {
      const title = $(element).find("h2").text();
      const url = $(element).find("a").attr("href");
      const publicationDate = new Date();
      const type = "news";
      news.push({
        title,
        url,
        publicationDate,
        source: this.source,
        type
      });
    });
    return news;
  }
*/
