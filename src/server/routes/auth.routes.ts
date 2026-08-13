import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validateRequest } from '../middlewares/validate';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  changePasswordSchema,
  changeEmailSchema,
  oauthLoginSchema,
  guestLoginSchema,
} from '../schemas/auth.schema';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

// Public Authentication Endpoints
router.post('/register', validateRequest(registerSchema), AuthController.register);
router.post('/signup', validateRequest(registerSchema), AuthController.register); // Legacy Alias
router.post('/login', validateRequest(loginSchema), AuthController.login);
router.post('/guest', validateRequest(guestLoginSchema), AuthController.guest);
router.post('/oauth', validateRequest(oauthLoginSchema), AuthController.oauth);
router.post('/oauth/google', validateRequest(oauthLoginSchema), AuthController.oauth);
router.post('/oauth/github', validateRequest(oauthLoginSchema), AuthController.oauth);
router.post('/oauth/microsoft', validateRequest(oauthLoginSchema), AuthController.oauth);
router.post('/refresh', validateRequest(refreshTokenSchema), AuthController.refresh);
router.post('/refresh-token', validateRequest(refreshTokenSchema), AuthController.refresh); // Legacy Alias

// Account Security Recovery
router.post('/forgot-password', validateRequest(forgotPasswordSchema), AuthController.forgotPassword);
router.post('/reset-password', validateRequest(resetPasswordSchema), AuthController.resetPassword);
router.post('/verify-email', validateRequest(verifyEmailSchema), AuthController.verifyEmail);

// Protected User Security & Session Endpoints
router.get('/me', authenticateToken, AuthController.me);
router.post('/logout', authenticateToken, AuthController.logout);
router.patch('/change-password', authenticateToken, validateRequest(changePasswordSchema), AuthController.changePassword);
router.patch('/change-email', authenticateToken, validateRequest(changeEmailSchema), AuthController.changeEmail);

export default router;
