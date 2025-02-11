import { Router } from 'express';
import multer from 'multer';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostsByUser,
} from '../controllers/postsControllers.js';
import { auth } from '../middlewares/authMiddlewares.js';
const upload = multer({ storage: multer.memoryStorage() });

const postsRouter = Router();

postsRouter.use(auth);

postsRouter.get(`/`, getPosts);
postsRouter.post(`/`, upload.single('image'), createPost);
postsRouter.get('/user', getPostsByUser);
postsRouter.get('/:id', getPostById);
postsRouter.put(`/:id`, updatePost);
postsRouter.delete(`/:id`, deletePost);

export default postsRouter;
