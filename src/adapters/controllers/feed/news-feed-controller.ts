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
      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : undefined;
      const providerName = normalizeProviderName(rawProviderName);
      const feeds = await newsUseCase.executeScrape(providerName, limit);
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

  async getFeedsLimitByProvider(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string);
      const feeds = await newsUseCase.getFeedsByProvider(limit);
      res.json({ feeds });
    } catch (error) {
      res.status(500).send("Error fetching feeds");
    }
  }

  async getFeedsByProviderName(req: Request, res: Response) {
    try {
      const providerName = req.params.provider;
      const feeds = await newsUseCase.getFeedsByProviderName(providerName);
      res.json({ feeds });
    } catch (error) {
      res.status(500).send("Error fetching feeds by provider name");
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
      const message = await newsUseCase.create(feed);
      res.json({ message });
    } catch (error) {
      res.status(500).send("Error creating feed");
    }
  }

  async readFeed(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const feed = await newsUseCase.read(id);
      if (feed) {
        res.json({ feed });
      } else {
        res.status(404).send("Feed not found");
      }
    } catch (error) {
      res.status(500).send("Error reading feed");
    }
  }

  async updateFeed(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const feedUpdates: Partial<FeedEntity> = req.body;
      const result = await newsUseCase.update(id, feedUpdates);
      res.json({ success: result });
    } catch (error) {
      res.status(500).send("Error updating feed");
    }
  }

  async deleteFeed(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await newsUseCase.delete(id);
      res.json({ message: "Feed deleted successfully" });
    } catch (error) {
      res.status(500).send("Error deleting feed");
    }
  }

  async listFeeds(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string);
      const feeds = await newsUseCase.list(limit);
      res.json(feeds);
    } catch (error) {
      res.status(500).send("Error listing feeds");
    }
  }
}
