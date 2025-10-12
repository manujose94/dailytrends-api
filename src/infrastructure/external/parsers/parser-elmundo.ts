import { BaseParser } from "./base-parser";
export class ElMundoParser extends BaseParser {
  getSelector(): string {
    return "h2.ue-c-cover-content__headline";
  }

  getBaseUrl(): string {
    return "https://www.elmundo.es/";
  }
}