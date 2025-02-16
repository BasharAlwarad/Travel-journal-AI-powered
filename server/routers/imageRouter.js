import { Router } from 'express';
import { createImage } from '../controllers/imagesControllers.js';
import { auth, requestLimiter } from '../middlewares/authMiddlewares.js';

const imageRouter = Router();

imageRouter.post('/', auth, requestLimiter, createImage);

export default imageRouter;
