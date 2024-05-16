import { load } from "cheerio";
import { IParser } from "../ports/parsers/parser-interface";
import { FeedEntity } from "../../domain/feed/entities/feed-entity";

export class ElMundoParser implements IParser {
  parse(rawData: string, source: string, limit?: number): FeedEntity[] {
    const cleanedData = rawData.replace(
      /<script[^>]*>([\s\S]*?)<\/script>/gi,
      ""
    );

    const $ = load(cleanedData);
    const feeds: FeedEntity[] = [];
    let count = 0;
    $("h2.ue-c-cover-content__headline").each((index, element) => {
      if (limit !== undefined && count >= limit) {
        return false;
      }
      const title = $(element).text().trim();
      const url = $(element).parent().attr("href") || "https://www.elmundo.es/";
      const feed = new FeedEntity(title, url, new Date(), source, "news");
      feeds.push(feed);
      count++;
    });

    return feeds;
  }
}
