import { Request, Response } from "express";

export interface INewsFeedController {
  scrapeFeeds(req: Request, res: Response): Promise<void>;
  scrapeAllFeeds(req: Request, res: Response): Promise<void>;
  getFeedsLimitByProvider(req: Request, res: Response): Promise<void>;
  createFeed(req: Request, res: Response): Promise<void>;
  getFeedsByProviderName(req: Request, res: Response): Promise<void>;
  readFeed(req: Request, res: Response): Promise<void>;
  updateFeed(req: Request, res: Response): Promise<void>;
  deleteFeed(req: Request, res: Response): Promise<void>;
  listFeeds(req: Request, res: Response): Promise<void>;
}
