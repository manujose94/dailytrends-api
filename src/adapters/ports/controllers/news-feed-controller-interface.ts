import { Request, Response } from "express";
import { THttpResponse } from "../../../common/types/http-types";

export interface INewsFeedController {
  scrapeFeeds(req: Request, res: Response): Promise<THttpResponse>;
  scrapeAllFeeds(req: Request, res: Response): Promise<THttpResponse>;
  getFeedsLimitByProvider(req: Request, res: Response): Promise<THttpResponse>;
  createFeed(req: Request, res: Response): Promise<THttpResponse>;
  getFeedsByProviderName(req: Request, res: Response): Promise<THttpResponse>;
  readFeed(req: Request, res: Response): Promise<THttpResponse>;
  updateFeed(req: Request, res: Response): Promise<THttpResponse>;
  deleteFeed(req: Request, res: Response): Promise<THttpResponse>;
  listFeeds(req: Request, res: Response): Promise<THttpResponse>;
}
