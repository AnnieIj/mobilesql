import { Request, Response, NextFunction } from 'express';
import { challengeService } from '../services/challengeService';
import { ApiResponseBuilder } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middlewares/auth';

export class ChallengeController {
  async getChallenges(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const difficulty = req.query.difficulty as string | undefined;
      const challenges = await challengeService.getChallenges(difficulty);
      ApiResponseBuilder.success(res, challenges, 'Challenges retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getDailyChallenge(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const daily = await challengeService.getDailyChallenge();
      ApiResponseBuilder.success(res, daily, 'Daily challenge retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getChallengeBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      const challenge = await challengeService.getChallengeBySlug(slug);
      ApiResponseBuilder.success(res, challenge, 'Challenge details retrieved');
    } catch (error) {
      next(error);
    }
  }

  async submitAttempt(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.userId || 'guest_user';
      const { slug } = req.params;

      const result = await challengeService.submitAttempt(slug, req.body, userId);
      ApiResponseBuilder.success(res, result, 'Challenge attempt evaluated');
    } catch (error) {
      next(error);
    }
  }

  async getLeaderboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const leaderboard = await challengeService.getLeaderboard(limit);
      ApiResponseBuilder.success(res, leaderboard, 'Global leaderboard retrieved');
    } catch (error) {
      next(error);
    }
  }
}

export const challengeController = new ChallengeController();
