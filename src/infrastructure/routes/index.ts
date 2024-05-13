import { Router } from 'express';
import authRouter from './auth-router';
import newsRouter from './news-router';

const router: Router = Router();

router.use('/auth', authRouter);
router.use('/news', newsRouter);

export default router;