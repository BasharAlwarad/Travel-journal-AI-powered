import { Router } from 'express';
import { createChat } from '../controllers/chatControllers.js';
import { auth, requestLimiter } from '../middlewares/authMiddlewares.js';

const chatRouter = Router();

chatRouter.post('/:id', auth, requestLimiter, createChat);

export default chatRouter;
