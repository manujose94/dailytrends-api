import express from 'express';
import { loginHandler } from './auth-route-handlers';


const router = express.Router();

router.post('/login', loginHandler);

export default router;