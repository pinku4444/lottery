import express from 'express';
import paymentController from './PaymentController';
import auth from '../../middleware/authenticate';

const router = express.Router();

router.post("/buyPlan", auth, paymentController.buyPlan);
router.get("/success/:id/:planName", paymentController.success);
router.get("/cancel/:id/:planName", paymentController.cancel);

export default router;