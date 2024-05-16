import { Request, Response } from "express";

export interface INewsFeedController {
  scrapeFeeds(req: Request, res: Response): Promise<void>;
  scrapeAllFeeds(req: Request, res: Response): Promise<void>;
  getFeeds(req: Request, res: Response): Promise<void>;
  createFeed(req: Request, res: Response): Promise<void>;
}
