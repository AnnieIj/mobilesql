import { Router } from 'express';
import { challengeController } from '../controllers/challengeController';
import { validateRequest } from '../middlewares/validate';
import { submitChallengeSchema } from '../schemas/challenge.schema';
import { optionalAuth } from '../middlewares/auth';

const router = Router();

// GET /api/v1/challenges - List challenges (optional filter by difficulty)
router.get('/', challengeController.getChallenges.bind(challengeController));

// GET /api/v1/challenges/daily - Get current daily challenge
router.get('/daily', challengeController.getDailyChallenge.bind(challengeController));

// GET /api/v1/challenges/leaderboard - Global XP leaderboard
router.get('/leaderboard', challengeController.getLeaderboard.bind(challengeController));

// GET /api/v1/challenges/:slug - Get challenge detail with test cases
router.get('/:slug', challengeController.getChallengeBySlug.bind(challengeController));

// POST /api/v1/challenges/:slug/submit - Submit SQL solution attempt
router.post(
  '/:slug/submit',
  optionalAuth,
  validateRequest(submitChallengeSchema),
  challengeController.submitAttempt.bind(challengeController)
);

export default router;
