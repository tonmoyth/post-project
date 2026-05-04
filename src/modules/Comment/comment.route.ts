import { Router } from 'express';
import { CommentController } from './comment.controller';
import validateRequest from '../../middlewares/validationRequest';
import { commentValidationSchema } from './comment.validation';
import { checkAuth } from '../../middlewares/checkAuth';

const router = Router();

router.post(
  '/',
  checkAuth(),
  validateRequest(commentValidationSchema.createComment),
  CommentController.createComment
);
router.patch(
  '/:id',
  checkAuth(),
  validateRequest(commentValidationSchema.updateComment),
  CommentController.updateComment
);

router.delete(
  '/:id',
  checkAuth(),
  CommentController.deleteComment
);

export const CommentRoutes = router;
