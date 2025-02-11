import { Router } from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostsByUser,
} from '../controllers/postsControllers.js';
import { auth } from '../middlewares/authMiddlewares.js';

const postsRouter = Router();

postsRouter.use(auth);

postsRouter.get(`/`, getPosts);
postsRouter.post(`/`, createPost);
postsRouter.get('/user', getPostsByUser);
postsRouter.get('/:id', getPostById);
postsRouter.put(`/:id`, updatePost);
postsRouter.delete(`/:id`, deletePost);

export default postsRouter;
