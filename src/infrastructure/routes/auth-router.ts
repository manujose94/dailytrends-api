import express from 'express';
import { RegisterHandler, loginHandler } from './auth-route-handlers';


const router = express.Router();

router.post('/login', loginHandler);
router.post('/register', RegisterHandler);
export default router;