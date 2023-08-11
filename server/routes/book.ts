import { Router } from 'express';
import { tokenMiddleware } from '../middlewares/token.js';
import { bookController, } from '../controllers/book.ctrl.js';
import errorHandleController from '../middlewares/errorHandler.js'

const router = Router();

router.get('/:bookName', errorHandleController(bookController.get));


export default router;