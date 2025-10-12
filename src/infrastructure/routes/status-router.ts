import express from "express";
import { livenessHandler, readinessHandler, statusHandler } from "../handlers/k8s-status-handlers";
/**
 * @swagger
 * tags:
 *   - name: Kubernetes Status
 *     description: Operations related to Kubernetes health and status checks
 */
const router = express.Router();

/**
 * @swagger
 * /status/liveness:
 *   get:
 *     summary: Checks if the application is live
 *     tags: [Kubernetes Status]
 *     responses:
 *       200:
 *         description: Application is live
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 result:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "live"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Internal server error"
 */
router.get("/liveness", livenessHandler);

/**
 * @swagger
 * /status/readiness:
 *   get:
 *     summary: Checks if the application is ready to serve traffic
 *     tags: [Kubernetes Status]
 *     responses:
 *       200:
 *         description: Application is ready
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 result:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "ready"
 *                     database:
 *                       type: boolean
 *                       example: true
 *       503:
 *         description: Application is not ready
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Application not ready"
 *       500:
 *         description: Internal server error
 */
router.get("/readiness", readinessHandler);

/**
 * @swagger
 * /status:
 *   get:
 *     summary: Gets detailed Kubernetes status
 *     tags: [Kubernetes Status]
 *     responses:
 *       200:
 *         description: Detailed status information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 result:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "healthy"
 *                     database:
 *                       type: boolean
 *                       example: true
 *                     podName:
 *                       type: string
 *                       example: "app-pod-123"
 *                     nodeName:
 *                       type: string
 *                       example: "node-1"
 *                     namespace:
 *                       type: string
 *                       example: "default"
 *       500:
 *         description: Internal server error
 */
router.get("/", statusHandler);

export default router;