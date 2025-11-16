import express from 'express';
import { authMe, getTest } from '../controllers/userController.js';

const router = express.Router();

router.get('/me', authMe);

router.get('/test', getTest);

export default router;
