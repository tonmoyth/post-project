// modules/user/user.route.ts
import { Router } from 'express';
import { registerUser, loginUser } from './user.controller';
import validateRequest from '../../middlewares/validationRequest';
import { userValidationSchema } from './user.validation';

const router = Router();

router.post('/register', validateRequest(userValidationSchema.register), registerUser);
router.post('/login', validateRequest(userValidationSchema.login), loginUser);

export const UserRoutes = router;
