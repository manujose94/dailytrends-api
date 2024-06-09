
import { BaseParser } from "./base-parser";

export class BBCParser extends BaseParser {
  getSelector(): string {
    return ".gs-c-promo-heading__title";
  }

  getBaseUrl(): string {
    return "https://www.elmundo.es/";
  }
  
}
