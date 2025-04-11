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
import { auth, postOwner } from '../middlewares/authMiddlewares.js';

const postsRouter = Router();

postsRouter.use(auth);
const upload = multer({ storage: multer.memoryStorage() });

postsRouter.get(`/`, getPosts);
postsRouter.post(`/`, auth, upload.single('image'), createPost);
postsRouter.get('/user', auth, getPostsByUser);

postsRouter.get('/:id', getPostById);
postsRouter.put(`/:id`, auth, postOwner, updatePost);
postsRouter.delete(`/:id`, auth, postOwner, deletePost);

export default postsRouter;
