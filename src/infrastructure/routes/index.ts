import { Router } from 'express';
import swaggerUi from "swagger-ui-express";
import authRouter from './auth-router';
import newsRouter from './news-router';
import { swaggerSpec } from "../config/swagger-openapi-config";
import statusRouter from './status-router';

const router: Router = Router();

router.use('/auth', authRouter);
router.use('/news', newsRouter);
router.use("/status", statusRouter);
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;