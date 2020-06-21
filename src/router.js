import express from 'express';
import authRouter from './controller/auth/router';
import gameRouter from './controller/game/router';
import planRouter from './controller/payment/router';

const router = express.Router();
router.use('/auth', authRouter);
router.use('/game', gameRouter);
router.use('/plan', planRouter);

export default router;