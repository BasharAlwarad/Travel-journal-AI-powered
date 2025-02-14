import { Router } from 'express';
import { createChat } from '../controllers/chatControllers.js';
import { auth } from '../middlewares/authMiddlewares.js';

const chatRouter = Router();

chatRouter.post('/:id', auth, createChat);

export default chatRouter;
