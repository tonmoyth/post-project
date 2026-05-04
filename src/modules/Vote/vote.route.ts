import { Router } from 'express';
import { VoteController } from './vote.controller';
import validateRequest from '../../middlewares/validationRequest';
import { voteValidationSchema } from './vote.validation';
import { checkAuth } from '../../middlewares/checkAuth';

const router = Router();

router.post(
  '/:postId',
  checkAuth(),
  validateRequest(voteValidationSchema.votePost),
  VoteController.votePost
);

export const VoteRoutes = router;
