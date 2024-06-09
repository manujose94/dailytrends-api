// src/infrastructure/factories/news-provider-factory.ts
import { IParser } from "../../application/ports/parsers/parser-interface";
import { INewsProvider } from "../../application/ports/providers/provider-news-feeds-interface";
import { ElMundoParser } from "../external/parsers/parser-elmundo";
import { ElPaisParser } from "../external/parsers/parser-elpais";
import { NewsProvider } from "../external/news-provider";
import { ICacheService } from "../../application/ports/services/cache-service-interface";
import { BBCParser } from "../external/parsers/parser-bbc-service";

export class NewsProviderFactory {
  static createNewsProvider(providerName: string, cacheService: ICacheService):  INewsProvider | null {
    let parser: IParser;

    switch (providerName.toLocaleUpperCase()) {
      case 'ELMUNDO':
        parser = new ElMundoParser();
        break;
      case 'ELPAIS':
        parser = new ElPaisParser();
        break;
    case 'BBC':
        parser = new BBCParser();
        break;
    default:
        return null;
    }

    return new NewsProvider(providerName, parser, cacheService);
  }
}
