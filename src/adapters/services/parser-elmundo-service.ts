import { load } from "cheerio";
import { IParser } from "../ports/parsers/parser-interface";
import { FeedEntity } from "../../domain/feeds/entities/feed-entity";

export class ElMundoParser implements IParser {
  parse(rawData: string, source: string): FeedEntity[] {
    const $ = load(rawData);
    const feeds: FeedEntity[] = [];

    $("h2.ue-c-cover-content__headline a").each((index, element) => {
      const title = $(element).text().trim();
      const url = $(element).attr("href");
      const feed = new FeedEntity(
        title,
        `https://www.elmundo.es${url}`,
        new Date(),
        source,
        "news"
      );

      feeds.push(feed);
    });

    return feeds;
  }
}
