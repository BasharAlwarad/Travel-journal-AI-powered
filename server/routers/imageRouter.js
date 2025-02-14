import { Router } from 'express';
import { createImage } from '../controllers/imagesControllers.js';
import { auth, postOwner } from '../middlewares/authMiddlewares.js';

const imageRouter = Router();

imageRouter.post('/', createImage);

export default imageRouter;
