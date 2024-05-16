import { FeedEntity } from "../../domain/feed/entities/feed-entity";
import { IParser } from "../ports/parsers/parser-interface";
import { load } from "cheerio";

export class BBCParser implements IParser {
  parse(rawData: string, source: string, limit?: number): FeedEntity[] {
    const $ = load(rawData);
    const feeds: FeedEntity[] = [];
    let count = 0;
    $(".media__title a").each((index, element) => {
      if (limit !== undefined && count >= limit) {
        return false;
      }
      const title = $(element).text().trim();
      const url = $(element).attr("href");
      const feed = new FeedEntity(
        title,
        `https://www.bbc.com${url}`,
        new Date(),
        source,
        "news"
      );
      count++;
      feeds.push(feed);
    });

    return feeds;
  }
}
