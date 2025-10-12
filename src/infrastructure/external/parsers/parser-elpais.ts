import { BaseParser } from "./base-parser";


export class ElPaisParser extends BaseParser {
  getSelector(): string {
    return "h2.c_t a";
  }

  getBaseUrl(): string {
    return "https://elpais.com";
  }
}
