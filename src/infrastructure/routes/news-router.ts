import express from "express";
import { authenticateToken } from "../middleware/auth-middleware";
import { NewsFeedsController } from "../../adapters/controllers/feed/news-feed-controller";
import { validateLimit } from "../middleware/validation-middleware";

/**
 * @swagger
 * tags:
 *   name: Feeds
 *   description: News Feeds for scraping or management of feeds
 */
const router = express.Router();
const newsFeedsController = new NewsFeedsController();

/**
 * @swagger
 * /news/scrape:
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
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 result:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Feed'
 *             examples:
 *               application/json:
 *                 value: 
 *                   success: true
 *                   result:
 *                     - title: "News Title"
 *                       content: "News content here."
 *                       provider: "ELMUNDO"
 *                       url: "http://example.com/news1"
 *       400:
 *         description: Feed condition error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             examples:
 *               application/json:
 *                 value: 
 *                   success: false
 *                   message: "Provider LARAZON not found"
 *       401:
 *         description: Unauthorized  
 *       500:
 *         description: Server error occurred while scraping feeds
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             examples:
 *               application/json:
 *                 value: 
 *                   success: false
 *                   message: "Error scraping feeds"
 */
router.get(
  "/scrape",
  authenticateToken,
  validateLimit,
  newsFeedsController.scrapeFeeds
);

/**
 * @swagger
 * /news/scrape/all:
 *   get:
 *     summary: Scrape all available news feeds of each provider
 *     description: >
 *       Scrapping all feeds based on news filtered by provider. This endpoint
 *       queries data from a dynamic provider, and all returned data is stored on
 *       database for persistent purposes.
 *     tags: [Feeds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Maximum number of feeds to retrieve for each provider
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: An array of all feeds successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 result:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Feed'
 *             examples:
 *               application/json:
 *                 value: 
 *                   success: true
 *                   result:
 *                     - title: "News Title"
 *                       content: "News content here."
 *                       provider: "ELMUNDO"
 *                       url: "http://example.com/news1"
 *       401:
 *         description: Unauthorized  
 *       500:
 *         description: Server error occurred while scraping all feeds
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             examples:
 *               application/json:
 *                 value: 
 *                   success: false
 *                   message: "Error scraping all feeds"
 */
router.get(
  "/scrape/all",
  authenticateToken,
  validateLimit,
  newsFeedsController.scrapeAllFeeds
);

/**
 * @swagger
 * /news/feeds/provider/:
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
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 result:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Feed'
 *             examples:
 *               application/json:
 *                 value: 
 *                   success: true
 *                   result:
 *                     - title: "News Title"
 *                       content: "News content here."
 *                       provider: "ELMUNDO"
 *                       url: "http://example.com/news1"
 *       401:
 *         description: Unauthorized  
 *       500:
 *         description: Server error occurred while fetching feeds
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             examples:
 *               application/json:
 *                 value: 
 *                   success: false
 *                   message: "Error fetching feeds"
 */
router.get(
  "/feeds/provider/",
  authenticateToken,
  validateLimit,
  newsFeedsController.getFeedsLimitByProvider
);

/**
 * @swagger
 * /news/feeds/provider/{provider}:
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
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 result:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Feed'
 *             examples:
 *               application/json:
 *                 value: 
 *                   success: true
 *                   result:
 *                     - title: "News Title"
 *                       content: "News content here."
 *                       provider: "ELMUNDO"
 *                       url: "http://example.com/news1"
 *       401:
 *         description: Unauthorized 
 *       500:
 *         description: Server error occurred while fetching feeds by provider name
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             examples:
 *               application/json:
 *                 value: 
 *                   success: false
 *                   message: "Error fetching feeds by provider name"
 */
router.get(
  "/feeds/provider/:provider",
  authenticateToken,
  newsFeedsController.getFeedsByProviderName
);

/**
 * @swagger
 * /news/feeds:
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
 *                 success:
 *                   type: boolean
 *                 result:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *             examples:
 *               application/json:
 *                 value: 
 *                   success: true
 *                   result:
 *                     _id: "60c72b2f9b1d8e001c8a7b88"
 *       400:
 *         description: Invalid data provided or error in feed creation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             examples:
 *               application/json:
 *                 value: 
 *                   success: false
 *                   message: "Error creating feed"
 *       401:
 *         description: Unauthorized 
 *       500:
 *         description: Server error occurred while creating the feed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             examples:
 *               application/json:
 *                 value: 
 *                   success: false
 *                   message: "Server error occurred while creating the feed"
 */
router.post("/feeds", authenticateToken, newsFeedsController.createFeed);

/**
 * @swagger
 * /news/feeds/{id}:
 *   get:
 *     summary: Get a feed by ID
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
 *         description: Feed retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 result:
 *                   type: object
 *                   properties:
 *                     feed:
 *                       $ref: '#/components/schemas/Feed'
 *             examples:
 *               application/json:
 *                 value: 
 *                   success: true
 *                   result:
 *                     feed:
 *                       title: "News Title"
 *                       content: "News content here."
 *                       provider: "ELMUNDO"
 *                       url: "http://example.com/news1"
 *       401:
 *         description: Unauthorized 
 *       404:
 *         description: Feed not found
 *       500:
 *         description: Error retrieving feed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             examples:
 *               application/json:
 *                 value: 
 *                   success: false
 *                   message: "Error retrieving feed"
 */
router.get("/feeds/:id", authenticateToken, newsFeedsController.readFeed);

/**
 * @swagger
 * /news/feeds/{id}:
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
 *       description: Data to update the feed
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Feed'
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
 *             examples:
 *               application/json:
 *                 value: 
 *                   success: true
 *       400:
 *         description: Invalid data provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             examples:
 *               application/json:
 *                 value: 
 *                   success: false
 *                   message: "Invalid data provided"
 *       401:
 *         description: Unauthorized 
 *       500:
 *         description: Error updating feed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             examples:
 *               application/json:
 *                 value: 
 *                   success: false
 *                   message: "Error updating feed"
 */
router.put("/feeds/:id", authenticateToken, newsFeedsController.updateFeed);

/**
 * @swagger
 * /news/feeds/{id}:
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
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             examples:
 *               application/json:
 *                 value: 
 *                   success: true
 *                   message: "Feed deleted successfully"
 *       401:
 *         description: Unauthorized 
 *       500:
 *         description: Error deleting feed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             examples:
 *               application/json:
 *                 value: 
 *                   success: false
 *                   message: "Error deleting feed"
 */
router.delete("/feeds/:id", authenticateToken, newsFeedsController.deleteFeed);

/**
 * @swagger
 * /news/feeds:
 *   get:
 *     summary: List news feeds with an optional limit
 *     tags: [Feeds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *         description: Maximum number of feeds to retrieve
 *     responses:
 *       200:
 *         description: List of news feeds retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 result:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Feed'
 *             examples:
 *               application/json:
 *                 value: 
 *                   success: true
 *                   result:
 *                     - title: "News Title"
 *                       content: "News content here."
 *                       provider: "ELMUNDO"
 *                       url: "http://example.com/news1"
 *       401:
 *         description: Unauthorized 
 *       500:
 *         description: Error listing feeds
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             examples:
 *               application/json:
 *                 value: 
 *                   success: false
 *                   message: "Error listing feeds"
 */
router.get(
  "/feeds",
  validateLimit,
  authenticateToken,
  newsFeedsController.listFeeds
);

export default router;
