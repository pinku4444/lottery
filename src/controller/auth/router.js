import express from 'express';
import authController from './AuthController';
import { validation } from '../../middleware';
import { signupSchema, loginSchema, forgetPasswordSchema } from './schema';

const router = express.Router();

router.post('/signup', validation(signupSchema), authController.signup);
router.post('/login', validation(loginSchema), authController.login);
router.post('/forgetPassword', validation(loginSchema), authController.forgetPassword);




export default router;