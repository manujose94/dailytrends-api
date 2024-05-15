import express from "express";
import { authenticateToken } from "../middleware/auth-middleware";
import { NewsController } from "../../adapters/controllers/feeds/news-feeds-controller";

const router = express.Router();

router.get("/scrape", authenticateToken, NewsController.scrapeFeeds);
router.get("/scrape/all", authenticateToken, NewsController.scrapeAllFeeds);
router.get("/feeds", authenticateToken, NewsController.getFeeds);
router.post("/feeds", authenticateToken, NewsController.createFeed);
export default router;
