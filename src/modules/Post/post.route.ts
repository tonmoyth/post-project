import { Router } from 'express';
import { PostController } from './post.controller';
import validateRequest from '../../middlewares/validationRequest';
import { postValidationSchema } from './post.validation';
import { checkAuth } from '../../middlewares/checkAuth';
import { upload, uploadToCloudinary } from '../../middlewares/uploadToCloudinary';

const router = Router();

router.get('/', PostController.getAllPosts);

router.get(
  '/:id',
  validateRequest(postValidationSchema.getSinglePost),
  PostController.getSinglePost
);

router.post(
  '/',
  checkAuth(),
  upload.single('image'),
  (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  uploadToCloudinary,
  validateRequest(postValidationSchema.createPost),
  PostController.createPost
);

router.patch(
  '/:id',
  checkAuth(),
  upload.single('image'),
  (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  uploadToCloudinary,
  validateRequest(postValidationSchema.updatePost),
  PostController.updatePost
);

router.delete(
  '/:id',
  checkAuth(),
  PostController.deletePost
);

export const PostRoutes = router;
