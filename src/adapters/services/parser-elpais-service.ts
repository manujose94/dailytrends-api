import { load } from "cheerio";
import { IParser } from "../ports/parsers/parser-interface";
import { FeedEntity } from "../../domain/feeds/entities/feed-entity";

export class ElPaisParser implements IParser {
  parse(rawData: string, source: string): FeedEntity[] {
    const $ = load(rawData);
    const feeds: FeedEntity[] = [];

    $("h2.c_t a").each((index, element) => {
      const title = $(element).text().trim();
      const url = $(element).attr("href") ?? ""; // Use optional chaining operator and provide a default value
      const feed = new FeedEntity(
        title,
        url.startsWith("http") ? url : `https://elpais.com${url}`,
        new Date(),
        source,
        "news"
      );

      feeds.push(feed);
    });

    return feeds;
  }
}
