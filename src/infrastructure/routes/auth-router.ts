import express from "express";
import { registerHandler, loginHandler } from "./auth-route-handlers";
/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Operations related to user authentication
 */
const router = express.Router();
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Logs in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserEntity'
 *     responses:
 *       200:
 *         description: Login successful, returns the authentication token
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
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Invalid input data, such as invalid email format or password criteria not met
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
 *                   example: "Invalid email or password"
 *       401:
 *         description: Authentication failed, user not found or incorrect password
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
 *                   example: "Authentication failed"
 *       500:
 *         description: Internal server error
 */
router.post("/login", loginHandler);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registers a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserEntity'
 *     responses:
 *       201:
 *         description: Registration successful, user created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: "Registration successful"
 *       400:
 *         description: Bad request due to validation errors like invalid email or weak password
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
 *                   example: "Invalid email format or password too weak"
 *       401:
 *         description: Registration precondition failed, such as email already in use
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
 *                   example: "Email already in use"
 *       500:
 *         description: Internal server error
 */
router.post("/register", registerHandler);
export default router;
