import express from "express";
import { authenticateToken } from "../middleware/auth-middleware";
import { NewsController } from "../../adapters/controllers/feed/news-feed-controller";

const router = express.Router();
const newsController = new NewsController();
router.get("/scrape", authenticateToken, newsController.scrapeFeeds);
router.get("/scrape/all", authenticateToken, newsController.scrapeAllFeeds);
router.get("/feeds", authenticateToken, newsController.getFeeds);
router.post("/feeds", authenticateToken, newsController.createFeed);
export default router;
