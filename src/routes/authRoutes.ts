import express from 'express';
import authController from '../controllers/authController';
import authMiddleware from '../middleware/auth';
import { validateSignup, validateSignin, validateRefreshToken, validationMiddleware } from '../middleware/validation';

const router = express.Router();

router.post('/signup', validateSignup, validationMiddleware, authController.signup);
router.post('/signin', validateSignin, validationMiddleware, authController.signin);
router.post('/signin/new_token', validateRefreshToken, validationMiddleware, authController.refreshToken);
router.get('/logout', authMiddleware, authController.logout);
router.get('/info', authMiddleware, authController.getInfo);

export default router;
