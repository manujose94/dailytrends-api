import { Request, Response } from "express";
import { FeedRepository } from "../../../adapters/repositories/feed-repository";
import { NewsService } from "../../../adapters/services/news-feeds-service";
import { BBCNewsProvider } from "../../../infrastructure/provider/bbc-news-provider";
import { ElPaisNewsProvider } from "../../../infrastructure/provider/elpais-news-provider";
import { ElMundoNewsProvider } from "../../../infrastructure/provider/elmundo-new-provider";
import { FeedEntity } from "../../../domain/feeds/entities/feed-entity";
import { NewsUseCase } from "../../../adapters/usecase/feed-use-case";
import { normalizeProviderName } from "../../../common/utils/normalize-provider-name";
const feedRepository = new FeedRepository();
const providers = [
  new BBCNewsProvider(),
  new ElMundoNewsProvider(),
  new ElPaisNewsProvider()
];
const newsService = new NewsService(feedRepository, providers);
const newsUseCase = new NewsUseCase(newsService);

export class NewsController {
  static async scrapeFeeds(req: Request, res: Response) {
    try {
      const rawProviderName = req.query.provider as string;
      const providerName = normalizeProviderName(rawProviderName);
      const feeds = await newsUseCase.executeScrape(providerName);
      res.json({ feeds });
    } catch (error) {
      res.status(500).send("Error scraping feeds");
    }
  }

  static async scrapeAllFeeds(req: Request, res: Response) {
    try {
      const allFeeds = await newsUseCase.executeScrapeAll();
      res.json({ allFeeds });
    } catch (error) {
      res.status(500).send("Error scraping all feeds");
    }
  }

  static async getFeeds(req: Request, res: Response) {
    try {
      const feeds = await newsUseCase.getFeedsByProvider(5);
      res.json(feeds);
    } catch (error) {
      res.status(500).send("Error fetching feeds");
    }
  }

  static async createFeed(req: Request, res: Response) {
    try {
      const { title, url, provider, type } = req.body;
      const normalizedProvider = normalizeProviderName(provider);
      const feed = new FeedEntity(
        title,
        url,
        new Date(),
        normalizedProvider,
        type
      );
      const message = await newsService.create(feed);
      res.json({ message });
    } catch (error) {
      res.status(500).send("Error creating feed");
    }
  }
}
