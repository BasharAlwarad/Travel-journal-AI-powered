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

const router = Router();

router.use(auth);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    fieldSize: 25 * 1024 * 1024,
  },
});

router.get(`/`, getPosts);
router.post(`/`, upload.single('image'), createPost);
router.get('/user', getPostsByUser);

router.get('/:id', getPostById);
router.put(`/:id`, postOwner, updatePost);
router.delete(`/:id`, postOwner, deletePost);

export default router;
