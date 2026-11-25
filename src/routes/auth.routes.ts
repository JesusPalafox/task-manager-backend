import { Router } from 'express';
import { postLogin, postRegister } from '../controllers/auth.controller.js';
import { authRateLimiter } from '../middlewares/security.middleware.js';
import { requireJson } from '../middlewares/require-json.middleware.js';
import { validateLogin, validateRegister } from '../middlewares/validate-auth.middleware.js';
export const authRouter = Router();
authRouter.post('/register', authRateLimiter, requireJson, validateRegister, postRegister);
authRouter.post('/login', authRateLimiter, requireJson, validateLogin, postLogin);
