import express from "express";
import { authenticateToken } from "../middleware/auth-middleware";
import { NewsController } from "../../adapters/controllers/feed/news-feed-controller";
import { validateLimit } from "../middleware/validation-middleware";

const router = express.Router();
const newsController = new NewsController();
router.get(
  "/scrape",
  authenticateToken,
  validateLimit,
  newsController.scrapeFeeds
);
router.get("/scrape/all", authenticateToken, newsController.scrapeAllFeeds);
router.get(
  "/feeds/provider/",
  authenticateToken,
  validateLimit,
  newsController.getFeedsLimitByProvider
);
router.get(
  "/feeds/provider/:provider",
  authenticateToken,
  newsController.getFeedsByProviderName
);
router.post("/feeds", authenticateToken, newsController.createFeed);
router.get("/feeds/:id", authenticateToken, newsController.readFeed);
router.put("/feeds/:id", authenticateToken, newsController.updateFeed);
router.delete("/feeds/:id", authenticateToken, newsController.deleteFeed);
router.get(
  "/feeds",
  validateLimit,
  authenticateToken,
  newsController.listFeeds
);
export default router;
