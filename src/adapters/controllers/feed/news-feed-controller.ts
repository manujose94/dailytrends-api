import { Request, Response } from "express";
import { FeedRepository } from "../../repositories/feed-repository";
import { normalizeProviderName } from "../../../common/utils/normalize-provider-name";
import { INewsFeedController } from "../../ports/controllers/news-feed-controller-interface";
import { FeedPreconditionException } from "../../../domain/feed/exceptions/feed-precondition-exception";
import { FeedConditionException } from "../../../common/exceptions/feeds-condition-exception";
import { errorResponse, successResponse } from "../../../common/httpResponses";
import { NewsService } from "../../../application/services/news-feed-service";
import { NewsUseCase } from "../../../application/usecases/feed-use-case";
import { FeedData } from "../../../application/usecases/dto/feed-data-dto";
import { validateFeedData } from "../../../application/validation/feed-validator";

import { NewsProviderFactory } from "../../../infrastructure/factories/news-provider-factory";
import { INewsProvider } from "../../../application/ports/providers/provider-news-feeds-interface";
import { RedisCacheService } from "../../../infrastructure/core/redis-cache-service";

const cacheService = new RedisCacheService();
const feedRepository = new FeedRepository();
// Create providers using the factory
const providers = [
  NewsProviderFactory.createNewsProvider("ELMUNDO", cacheService),
  NewsProviderFactory.createNewsProvider("ELPAIS", cacheService),
  NewsProviderFactory.createNewsProvider("BBC", cacheService)
].filter(provider => provider !== null) as INewsProvider[];

const newsService = new NewsService(feedRepository, providers);
const newsUseCase = new NewsUseCase(newsService);

export class NewsFeedsController implements INewsFeedController {
  async scrapeFeeds(req: Request, res: Response) {
    try {
      const rawProviderName = req.query.provider as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const providerName = normalizeProviderName(rawProviderName);
      const feeds = await newsUseCase.executeScrape(providerName, limit);
      return successResponse(res, { feeds });
    } catch (error) {
      if (error instanceof FeedConditionException) {
        return errorResponse(res, error.message, 400);
      } else {
        return errorResponse(res, "Error scraping feeds");
      }
    }
  }

  async scrapeAllFeeds(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string);
      const allFeeds = await newsUseCase.executeScrapeAll(limit);
      return successResponse(res, { allFeeds });
    } catch (error) {
      return errorResponse(res, "Error scraping all feeds");
    }
  }

  async getFeedsLimitByProvider(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string);
      const feeds = await newsUseCase.getFeedsByProvider(limit);
      return successResponse(res, { feeds });
    } catch (error) {
      return errorResponse(res, "Error fetching feeds");
    }
  }

  async getFeedsByProviderName(req: Request, res: Response) {
    try {
      const rawProviderName = req.params.provider;
      const providerName = normalizeProviderName(rawProviderName);
      const feeds = await newsUseCase.getFeedsByProviderName(providerName);
      return successResponse(res, { feeds });
    } catch (error) {
      return errorResponse(res, "Error fetching feeds by provider name");
    }
  }

  async createFeed(req: Request, res: Response) {
    try {
      const feedData: FeedData = req.body;
      validateFeedData(req.body as Partial<FeedData>);
      const _id = await newsUseCase.create(feedData);
      if (!_id) {
        return errorResponse(res, "Error creating feed", 400);
      }
      return successResponse(res, { _id });
    } catch (error) {
      if (error instanceof FeedPreconditionException) {
        return errorResponse(res, error.message, 400);
      } else {
        return errorResponse(res, "Error creating feed");
      }
    }
  }

  async readFeed(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const feed = await newsUseCase.read(id);
      if (feed) {
        return successResponse(res, { feed });
      } else {
        return errorResponse(res, "Feed not found", 404);
      }
    } catch (error) {
      return errorResponse(res, "Error reading feed");
    }
  }

  async updateFeed(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const feedUpdates: Partial<FeedData> = req.body;
      const result = await newsUseCase.update(id, feedUpdates);
      return successResponse(res, { success: result });
    } catch (error) {
      return errorResponse(res, "Error updating feed");
    }
  }

  async deleteFeed(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await newsUseCase.delete(id);
      return successResponse(res, { message: "Feed deleted successfully" });
    } catch (error) {
      return errorResponse(res, "Error deleting feed");
    }
  }

  async listFeeds(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string);
      const feeds = await newsUseCase.list(limit);
      return successResponse(res, { feeds });
    } catch (error) {
      return errorResponse(res, "Error listing feeds");
    }
  }
}
