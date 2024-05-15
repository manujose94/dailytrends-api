import { FeedEntity } from "../../domain/feeds/entities/feed-entity";
import { IParser } from "../ports/parsers/parser-interface";
import { load } from "cheerio";

export class BBCParser implements IParser {
  parse(rawData: string, source: string): FeedEntity[] {
    const $ = load(rawData);
    const feeds: FeedEntity[] = [];

    $(".media__title a").each((index, element) => {
      const title = $(element).text().trim();
      const url = $(element).attr("href");
      const feed = new FeedEntity(
        title,
        `https://www.bbc.com${url}`,
        new Date(),
        source,
        "news"
      );

      feeds.push(feed);
    });

    return feeds;
  }
}
