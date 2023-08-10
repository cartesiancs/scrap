import { Router } from 'express';
const router = Router();

import { tokenMiddleware } from './middlewares/token.js';


import users from './routes/users.js';
import auth from './routes/auth.js';
import feeds from './routes/feeds.js';
import server from './routes/server.js';


router.use('/users', users);
router.use('/auth', auth);
router.use('/feeds', feeds);
router.use('/server', server);

export default router;