import { Router } from 'express';
import { createImage } from '../controllers/imagesControllers.js';

const imageRouter = Router();

imageRouter.post('/', createImage);

export default imageRouter;
