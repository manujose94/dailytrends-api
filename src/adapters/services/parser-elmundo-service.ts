import { load } from "cheerio";
import { IParser } from "../ports/parsers/parser-interface";
import { FeedEntity } from "../../domain/feed/entities/feed-entity";

export class ElMundoParser implements IParser {
  parse(rawData: string, source: string): FeedEntity[] {
    const cleanedData = rawData.replace(
      /<script[^>]*>([\s\S]*?)<\/script>/gi,
      ""
    );

    const $ = load(cleanedData);
    const feeds: FeedEntity[] = [];

    $("h2.ue-c-cover-content__headline").each((index, element) => {
      const title = $(element).text().trim();
      const url = $(element).parent().attr("href") || "https://www.elmundo.es/";
      const feed = new FeedEntity(title, url, new Date(), source, "news");
      feeds.push(feed);
    });

    return feeds;
  }
}
