import { Router } from 'express';
import { tokenMiddleware } from '../middlewares/token.js';
import { serverController, } from '../controllers/server.ctrl.js';
import errorHandleController from '../middlewares/errorHandler.js'

const router = Router();

router.get('/', errorHandleController(serverController.get));


export default router;