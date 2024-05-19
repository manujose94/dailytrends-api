import express from "express";
import { authenticateToken } from "../middleware/auth-middleware";
import { NewsFeedsController } from "../../adapters/controllers/feed/news-feed-controller";
import { validateLimit } from "../middleware/validation-middleware";
/**
 * @swagger
 * tags:
 *   name: Feeds
 *   description: Feeds management
 */
const router = express.Router();
const newsFeedsController = new NewsFeedsController();

/**
 * @swagger
 * /scrape:
 *   get:
 *     summary: Scrape news feeds based on provider and limit
 *     description: >
 *       Scrapping a limited list of news feeds filtered by provider. This endpoint
 *       queries data from a dynamic provider, and all returned data is stored on
 *       database for persistent purposes.
 *     tags: [Feeds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: provider
 *         in: query
 *         description: Name of the news provider
 *         required: false
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         description: Maximum number of feeds to retrieve
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: An array of feeds successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Feed'
 *       500:
 *         description: Server error occurred while scraping feeds
 */
router.get(
  "/scrape",
  authenticateToken,
  validateLimit,
  newsFeedsController.scrapeFeeds
);
/**
 * @swagger
 * /scrape/all:
 *   get:
 *     summary: Scrape all available news feeds
 *     description: >
 *       Scrapping a all feeds based on news filtered by provider. This endpoint
 *       queries data from a dynamic provider, and all returned data is stored on
 *       database for persistent purposes.
 *     tags: [Feeds]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: An array of all feeds successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Feed'
 *       500:
 *         description: Server error occurred while scraping all feeds
 */
router.get(
  "/scrape/all",
  authenticateToken,
  newsFeedsController.scrapeAllFeeds
);
/**
 * @swagger
 * /feeds/provider/:
 *   get:
 *     summary: Get a limited number of news feeds by any provider
 *     tags: [Feeds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Maximum number of feeds to retrieve
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: An array of feeds successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Feed'
 *       500:
 *         description: Server error occurred while fetching feeds
 */
router.get(
  "/feeds/provider/",
  authenticateToken,
  validateLimit,
  newsFeedsController.getFeedsLimitByProvider
);
/**
 * @swagger
 * /feeds/provider/{provider}:
 *   get:
 *     summary: Get news feeds specifically by provider name
 *     tags: [Feeds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: provider
 *         in: path
 *         description: Name of the news provider
 *         required: true
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         description: Maximum number of feeds to retrieve
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: An array of feeds by specified provider successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Feed'
 *       500:
 *         description: Server error occurred while fetching feeds by provider name
 */
router.get(
  "/feeds/provider/:provider",
  authenticateToken,
  newsFeedsController.getFeedsByProviderName
);
/**
 * @swagger
 * /feeds:
 *   post:
 *     summary: Create a news feed
 *     tags: [Feeds]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Feed'
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *       400:
 *         description: Error creating feed
 *       500:
 *         description: Error creating feed
 */
router.post("/feeds", authenticateToken, newsFeedsController.createFeed);
/**
 * @swagger
 * /feeds/{id}:
 *   put:
 *     summary: Update a feed by ID
 *     tags: [Feeds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               url:
 *                 type: string
 *               provider:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Feed updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       500:
 *         description: Error updating feed
 */
router.get("/feeds/:id", authenticateToken, newsFeedsController.readFeed);

/**
 * @swagger
 * /feeds/{id}:
 *   delete:
 *     summary: Delete a feed by ID
 *     tags: [Feeds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Feed deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error deleting feed
 */
router.put("/feeds/:id", authenticateToken, newsFeedsController.updateFeed);

/**
 * @swagger
 * /feeds/{id}:
 *   delete:
 *     summary: Delete a feed by ID
 *     tags: [Feeds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Feed deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error deleting feed
 */
router.delete("/feeds/:id", authenticateToken, newsFeedsController.deleteFeed);
/**
 * @swagger
 * /feeds:
 *   post:
 *     summary: Create a new news feed entry
 *     tags: [Feeds]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Data required to create a new feed
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Feed'
 *     responses:
 *       200:
 *         description: New feed created successfully, returns the ID of the created feed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *       400:
 *         description: Invalid data provided or error in feed creation
 *       500:
 *         description: Server error occurred while creating the feed
 */
router.get(
  "/feeds",
  validateLimit,
  authenticateToken,
  newsFeedsController.listFeeds
);
export default router;
