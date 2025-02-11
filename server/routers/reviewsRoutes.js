import express from 'express';
import {
  getReviewsByPost,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} from '../controllers/reviewsControllers.js';
import { auth } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/post/:postId', getReviewsByPost);
router.get('/:id', auth, getReviewById);
router.post('/post/:postId', auth, createReview);
router.put('/:id', auth, updateReview);
router.delete('/:id', auth, deleteReview);

export default router;
