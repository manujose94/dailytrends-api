import { load } from "cheerio";
import { IParser } from "../ports/parsers/parser-interface";
import { FeedEntity } from "../../domain/feed/entities/feed-entity";

export class ElPaisParser implements IParser {
  parse(rawData: string, source: string, limit?: number): FeedEntity[] {
    const feeds: FeedEntity[] = [];

    const cleanedData = rawData.replace(
      /<script[^>]*>([\s\S]*?)<\/script>/gi,
      ""
    );
    const $ = load(cleanedData);
    let count = 0;
    $("h2.c_t a").each((index, element) => {
      if (limit !== undefined && count >= limit) {
        return false;
      }
      const title = $(element).text().trim();
      const url = $(element).attr("href") ?? "https://elpais.com";
      const feed = new FeedEntity(title, url, new Date(), source, "news");
      feeds.push(feed);
      count++;
    });

    return feeds;
  }
}
