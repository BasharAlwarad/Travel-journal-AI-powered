import { Router } from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostsByUser,
} from '../controllers/postsControllers.js';
import { auth, postOwner } from '../middlewares/authMiddlewares.js';

const postsRouter = Router();

postsRouter.use(auth);

postsRouter.get(`/`, getPosts);
// postsRouter.get(`/`, auth, getPosts);
postsRouter.post(`/`, auth, createPost);
postsRouter.get('/user', auth, getPostsByUser);

postsRouter.get('/:id', getPostById);
postsRouter.put(`/:id`, auth, postOwner, updatePost);
postsRouter.delete(`/:id`, auth, postOwner, deletePost);

export default postsRouter;
