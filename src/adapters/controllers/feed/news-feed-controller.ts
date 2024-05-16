import { Request, Response } from "express";
import { FeedRepository } from "../../repositories/feed-repository";
import { NewsService } from "../../services/news-feed-service";
import { BBCNewsProvider } from "../../../infrastructure/provider/bbc-news-provider";
import { ElPaisNewsProvider } from "../../../infrastructure/provider/elpais-news-provider";
import { ElMundoNewsProvider } from "../../../infrastructure/provider/elmundo-new-provider";
import { FeedEntity } from "../../../domain/feed/entities/feed-entity";
import { NewsUseCase } from "../../usecase/feed-use-case";
import { normalizeProviderName } from "../../../common/utils/normalize-provider-name";
import { INewsFeedController } from "../../ports/controllers/news-feed-controller-interface";

const feedRepository = new FeedRepository();
const providers = [
  new BBCNewsProvider(),
  new ElMundoNewsProvider(),
  new ElPaisNewsProvider()
];
const newsService = new NewsService(feedRepository, providers);
const newsUseCase = new NewsUseCase(newsService);

export class NewsController implements INewsFeedController {
  async scrapeFeeds(req: Request, res: Response) {
    try {
      const rawProviderName = req.query.provider as string;
      const providerName = normalizeProviderName(rawProviderName);
      const feeds = await newsUseCase.executeScrape(providerName);
      res.json({ feeds });
    } catch (error) {
      res.status(500).send("Error scraping feeds");
    }
  }

  async scrapeAllFeeds(req: Request, res: Response) {
    try {
      const allFeeds = await newsUseCase.executeScrapeAll();
      res.json({ allFeeds });
    } catch (error) {
      res.status(500).send("Error scraping all feeds");
    }
  }

  async getFeeds(req: Request, res: Response) {
    try {
      const feeds = await newsUseCase.getFeedsByProvider(5);
      res.json(feeds);
    } catch (error) {
      res.status(500).send("Error fetching feeds");
    }
  }

  async createFeed(req: Request, res: Response) {
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
