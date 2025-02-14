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

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    fieldSize: 25 * 1024 * 1024,
  },
});

const postsRouter = Router();

postsRouter.use(auth);

postsRouter.get(`/`, auth, getPosts);
postsRouter.post(`/`, auth, upload.single('image'), createPost);
postsRouter.get('/user', auth, getPostsByUser);
postsRouter.get('/:id', getPostById);
postsRouter.put(`/:id`, auth, postOwner, updatePost);
postsRouter.delete(`/:id`, auth, postOwner, deletePost);

export default postsRouter;
