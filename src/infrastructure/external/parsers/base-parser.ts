import { load } from "cheerio";
import { IParser } from "../../../application/ports/parsers/parser-interface";
import { FeedEntity } from "../../../domain/feed/entities/feed-entity";

export abstract class BaseParser implements IParser {
  abstract getSelector(): string;
  abstract getBaseUrl(): string;

  parse(rawData: string, source: string, limit?: number): FeedEntity[] {
    const cleanedData = rawData.replace(
      /<script[^>]*>([\s\S]*?)<\/script>/gi,
      ""
    );

    const $ = load(cleanedData);
    const feeds: FeedEntity[] = [];
    let count = 0;
    $(this.getSelector()).each((index, element) => {
      if (limit !== undefined && count >= limit) {
        return false;
      }
      const title = $(element).text().trim();
      const url = $(element).attr("href") || this.getBaseUrl();
      const feed = new FeedEntity(title, url, new Date(), source, "news");
      feeds.push(feed);
      count++;
    });

    return feeds;
  }
}