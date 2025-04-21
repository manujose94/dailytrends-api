import { Request, Response } from "express";

import { NewsUseCase } from "../../../src/application/usecases/feed-use-case";
import { FeedData } from "../../../src/application/usecases/dto/feed-data-dto";
import { FeedEntity } from "../../../src/domain/feed/entities/feed-entity";
import { InputValidationException } from "../../../src/common/exceptions/input-validation-exception";
import { FeedConditionException } from "../../../src/common/exceptions/feeds-condition-exception";
import { FeedPreconditionException } from "../../../src/domain/feed/exceptions/feed-precondition-exception";
import { DuplicateKeyError } from "../../../src/common/exceptions/duplicate-keys";
import { NewsFeedsController } from "../../../src/adapters/controllers/feed/news-feed-controller";


// --- Mock RedisCacheService ---
jest.mock("../../../src/infrastructure/core/redis-cache-service", () => {
    return {
      RedisCacheService: jest.fn().mockImplementation(() => ({
        get: jest.fn().mockResolvedValue("mocked value"),
        set: jest.fn().mockResolvedValue(undefined),
      })),
    };
  });
  
  // --- Mock FeedRepository ---
  jest.mock("../../../src/adapters/repositories/feed-repository", () => {
    return {
      FeedRepository: jest.fn().mockImplementation(() => ({
        create: jest.fn(),
        read: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        list: jest.fn(),
        getFeedsByProvider: jest.fn(),
        getFeedsByProviderName: jest.fn(),
        deleteFeeds: jest.fn(),
      })),
    };
  });
  
  // --- Mock NewsProviderFactory ---
  jest.mock("../../../src/infrastructure/factories/news-provider-factory", () => {
    return {
      NewsProviderFactory: {
        createNewsProvider: jest.fn((provider: string, _cache: any) => ({
          getNameOfProvider: jest.fn().mockReturnValue(provider),
          getNewsFeeds: jest.fn().mockResolvedValue([]),
        })),
      },
    };
  });

describe("NewsFeedsController", () => {
    
  let newsFeedsController: NewsFeedsController;
  let newsUseCase: jest.Mocked<NewsUseCase>;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    newsUseCase = {
      executeScrape: jest.fn(),
      executeScrapeAll: jest.fn(),
      getFeedsByProvider: jest.fn(),
      getFeedsByProviderName: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
      read: jest.fn(),
      update: jest.fn(),
      list: jest.fn(),
    } as unknown as jest.Mocked<NewsUseCase>;

    

    newsFeedsController = new NewsFeedsController(newsUseCase);

    req = {
      query: {},
      params: {},
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("scrapeFeeds", () => {
    it("should scrape feeds and return success response", async () => {
        const feeds = [new FeedEntity("Title", "http://example.com", new Date(), "provider", "type")];
        req.query = { provider: "ELMUNDO" };
        newsUseCase.executeScrape.mockResolvedValue(feeds);
    
        await newsFeedsController.scrapeFeeds(req as Request, res as Response);
    
        expect(newsUseCase.executeScrape).toHaveBeenCalledWith("ELMUNDO", undefined);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ result: { feeds }, success: true });
      });
  
  
      it("should handle FeedConditionException and return 400", async () => {
        req.query = { provider: "ELMUNDO" };
        const error = new FeedConditionException("Invalid provider");
        newsUseCase.executeScrape.mockRejectedValue(error);
    
        await newsFeedsController.scrapeFeeds(req as Request, res as Response);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: "Invalid provider" });
      });
  
      it("should handle unexpected errors and return 500", async () => {
        req.query = { provider: "ELMUNDO" };
        newsUseCase.executeScrape.mockRejectedValue(new Error("Unexpected error"));
    
        await newsFeedsController.scrapeFeeds(req as Request, res as Response);
    
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: "Error scraping feeds" });
      });
  });
  
  describe("scrapeAllFeeds", () => {
    it("should scrape all feeds and return success response", async () => {
      const feeds = [new FeedEntity("Title", "http://example.com", new Date(), "provider", "type")];
      req.query = { limit: "10" };
      newsUseCase.executeScrapeAll.mockResolvedValue(feeds);
  
      await newsFeedsController.scrapeAllFeeds(req as Request, res as Response);
  
      expect(newsUseCase.executeScrapeAll).toHaveBeenCalledWith(10);
      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({ result: { feeds }, success: true });
    });
  
    it("should handle unexpected errors and return 500", async () => {
      req.query = { limit: "10" };
      newsUseCase.executeScrapeAll.mockRejectedValue(new Error("Unexpected error"));
  
      await newsFeedsController.scrapeAllFeeds(req as Request, res as Response);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Error scraping all feeds" });
    });
  });
  
  describe("getFeedsLimitByProvider", () => {
    it("should get feeds by provider and return success response", async () => {
      const feeds = [new FeedEntity("Title", "http://example.com", new Date(), "provider", "type")];
      req.query = { limit: "10" };
      newsUseCase.getFeedsByProvider.mockResolvedValue(feeds);
  
      await newsFeedsController.getFeedsLimitByProvider(req as Request, res as Response);
  
      expect(newsUseCase.getFeedsByProvider).toHaveBeenCalledWith(10);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ result: { feeds }, success: true });
    });
  
    it("should handle unexpected errors and return 500", async () => {
      req.query = { limit: "10" };
      newsUseCase.getFeedsByProvider.mockRejectedValue(new Error("Unexpected error"));
  
      await newsFeedsController.getFeedsLimitByProvider(req as Request, res as Response);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Error fetching feeds" });
    });
  });
  
  describe("getFeedsByProviderName", () => {
    it("should get feeds by provider name and return success response", async () => {
      const feeds = [new FeedEntity("Title", "http://example.com", new Date(), "provider", "type")];
      req.params = { provider: "ELMUNDO" };
      newsUseCase.getFeedsByProviderName.mockResolvedValue(feeds);
  
      await newsFeedsController.getFeedsByProviderName(req as Request, res as Response);
  
      expect(newsUseCase.getFeedsByProviderName).toHaveBeenCalledWith("ELMUNDO");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ result: { feeds }, success: true });
    });
  
    it("should handle unexpected errors and return 500", async () => {
      req.params = { provider: "ELMUNDO" };
      newsUseCase.getFeedsByProviderName.mockRejectedValue(new Error("Unexpected error"));
  
      await newsFeedsController.getFeedsByProviderName(req as Request, res as Response);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({success: false, message: "Error fetching feeds by provider name" });
    });
  });
   describe("getFeedsByProviderName", () => {
      it("should get feeds by provider name and return success response", async () => {
        const feeds = [new FeedEntity("Title", "http://example.com", new Date(), "provider", "type")];
        req.params = { provider: "ELMUNDO" };
        newsUseCase.getFeedsByProviderName.mockResolvedValue(feeds);
    
        await newsFeedsController.getFeedsByProviderName(req as Request, res as Response);
    
        expect(newsUseCase.getFeedsByProviderName).toHaveBeenCalledWith("ELMUNDO");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ result: { feeds }, success: true });
      });
    
      it("should handle unexpected errors and return 500", async () => {
        req.params = { provider: "ELMUNDO" };
        newsUseCase.getFeedsByProviderName.mockRejectedValue(new Error("Unexpected error"));
    
        await newsFeedsController.getFeedsByProviderName(req as Request, res as Response);
    
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({  success: false, message: "Error fetching feeds by provider name" });
      });
    });
    
  
    describe("deleteFeeds", () => {
      it("should delete feeds and return 204", async () => {
        req.body = { filter: { _id: "feed-id" } };
        newsUseCase.delete.mockResolvedValue(undefined);
  
        await newsFeedsController.deleteFeeds(req as Request, res as Response);
  
        expect(newsUseCase.delete).toHaveBeenCalledWith({ _id: "feed-id" });
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.json).toHaveBeenCalledWith({"result": null, "success": true});
      });
  
      it("should handle InputValidationException and return 400", async () => {
        req.body = { filter: {} };
        const error = new InputValidationException("Invalid filter");
        newsUseCase.delete.mockRejectedValue(error);
  
        await newsFeedsController.deleteFeeds(req as Request, res as Response);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid filter", "success": false });
      });
  
      it("should handle FeedConditionException and return 400", async () => {
        req.body = { filter: { _id: "feed-id" } };
        const error = new FeedConditionException("Invalid feed");
        newsUseCase.delete.mockRejectedValue(error);
  
        await newsFeedsController.deleteFeeds(req as Request, res as Response);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid feed", "success": false });
      });
  
      it("should handle unexpected errors and return 500", async () => {
        req.body = { filter: { _id: "feed-id" } };
        newsUseCase.delete.mockRejectedValue(new Error("Unexpected error"));
  
        await newsFeedsController.deleteFeeds(req as Request, res as Response);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Failed to delete feeds", "success": false});
      });
    });
  
    describe("createFeed", () => {
      it("should create a feed and return success response", async () => {
        const feedData: FeedData = {
          title: "Title",
          url: "http://example.com",
          provider: "ELMUNDO",
          type: "type",
        };
        req.body = feedData;
        newsUseCase.create.mockResolvedValue("feed-id");
  
        await newsFeedsController.createFeed(req as Request, res as Response);
  
        expect(newsUseCase.create).toHaveBeenCalledWith(feedData);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ result: { _id: "feed-id"} , "success": true });
      });
  
      it("should handle DuplicateKeyError and return 409", async () => {
        const feedData: FeedData = {
          title: "Title",
          url: "http://example.com",
          provider: "ELMUNDO",
          type: "type",
        };
        req.body = feedData;
        const error = new DuplicateKeyError("Duplicate key");
        newsUseCase.create.mockRejectedValue(error);
  
        await newsFeedsController.createFeed(req as Request, res as Response);
  
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ message: "Duplicate key", "success": false});
      });
  
      it("should handle FeedPreconditionException and return 400", async () => {
        const feedData: FeedData = {
          title: "Title",
          url: "http://example.com",
          provider: "ELMUNDO",
          type: "type",
        };
        req.body = feedData;
        const error = new FeedPreconditionException("Invalid feed data");
        newsUseCase.create.mockRejectedValue(error);
  
        await newsFeedsController.createFeed(req as Request, res as Response);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid feed data", "success": false });
      });
  
      it("should handle unexpected errors and return 500", async () => {
        const feedData: FeedData = {
          title: "Title",
          url: "http://example.com",
          provider: "ELMUNDO",
          type: "type",
        };
        req.body = feedData;
        newsUseCase.create.mockRejectedValue(new Error("Unexpected error"));
  
        await newsFeedsController.createFeed(req as Request, res as Response);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Error creating feed", "success": false });
      });
    });
  
    describe("readFeed", () => {
      it("should read a feed and return success response", async () => {
        const feed = new FeedEntity("Title", "http://example.com", new Date(), "provider", "type");
        req.params = { id: "feed-id" };
        newsUseCase.read.mockResolvedValue(feed);
  
        await newsFeedsController.readFeed(req as Request, res as Response);
  
        expect(newsUseCase.read).toHaveBeenCalledWith("feed-id");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({"result": { feed }, "success": true});
      });
  
      it("should handle feed not found and return 404", async () => {
        req.params = { id: "feed-id" };
        newsUseCase.read.mockResolvedValue(null);
  
        await newsFeedsController.readFeed(req as Request, res as Response);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Feed not found", "success": false });
      });
  
      it("should handle unexpected errors and return 500", async () => {
        req.params = { id: "feed-id" };
        newsUseCase.read.mockRejectedValue(new Error("Unexpected error"));
  
        await newsFeedsController.readFeed(req as Request, res as Response);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Error reading feed", "success": false });
      });
    });
  
    describe("updateFeed", () => {
      it("should update a feed and return success response", async () => {
        req.params = { id: "feed-id" };
        req.body = { title: "Updated Title" };
        newsUseCase.update.mockResolvedValue(true);
  
        await newsFeedsController.updateFeed(req as Request, res as Response);
  
        expect(newsUseCase.update).toHaveBeenCalledWith("feed-id", { title: "Updated Title" });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({"result": null, "success": true});
      });
  
      it("should handle unexpected errors and return 500", async () => {
        req.params = { id: "feed-id" };
        req.body = { title: "Updated Title" };
        newsUseCase.update.mockRejectedValue(new Error("Unexpected error"));
  
        await newsFeedsController.updateFeed(req as Request, res as Response);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Error updating feed", "success": false });
      });
    });
  
    describe("deleteFeed", () => {
      it("should delete a feed and return success response", async () => {
        req.params = { id: "feed-id" };
        newsUseCase.delete.mockResolvedValue(undefined);
  
        await newsFeedsController.deleteFeed(req as Request, res as Response);
  
        expect(newsUseCase.delete).toHaveBeenCalledWith("feed-id");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({"result": null, "success": true});
      });
  
      it("should handle unexpected errors and return 500", async () => {
        req.params = { id: "feed-id" };
        newsUseCase.delete.mockRejectedValue(new Error("Unexpected error"));
  
        await newsFeedsController.deleteFeed(req as Request, res as Response);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Error deleting feed", "success": false });
      });
    });
  
    describe("listFeeds", () => {
      it("should list feeds and return success response", async () => {
        const feeds = [new FeedEntity("Title", "http://example.com", new Date(), "provider", "type")];
        req.query = { limit: "10" };
        newsUseCase.list.mockResolvedValue(feeds);
  
        await newsFeedsController.listFeeds(req as Request, res as Response);
  
        expect(newsUseCase.list).toHaveBeenCalledWith(10);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ result: { feeds }, success: true });
      });
  
      it("should handle unexpected errors and return 500", async () => {
        req.query = { limit: "10" };
        newsUseCase.list.mockRejectedValue(new Error("Unexpected error"));
  
        await newsFeedsController.listFeeds(req as Request, res as Response);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Error listing feeds", "success": false});
      });
    });
});