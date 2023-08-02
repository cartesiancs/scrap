import { Router } from 'express';
import { tokenMiddleware } from '../middlewares/token.js';
import { authController, oauthController } from '../controllers/auth.ctrl.js';
import errorHandleController from '../middlewares/errorHandler.js'

const router = Router();

router.post('/login', errorHandleController(authController.login));
router.get('/me', tokenMiddleware.check, errorHandleController(authController.me));

router.get('/google', oauthController.authGoogle);
router.get('/google/callback', oauthController.authGoogleCallback, oauthController.callback);



router.get('/oauth/isEnable', oauthController.isEnable);


export default router;