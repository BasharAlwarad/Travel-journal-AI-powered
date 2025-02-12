import express from 'express';
import {
  getReviewsByPost,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} from '../controllers/reviewsControllers.js';
import {
  auth,
  reviewOwner,
  preventPostOwnerReview,
  preventMultipleReviews,
} from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/post/:postId', auth, getReviewsByPost);
router.get('/:id', auth, getReviewById);
router.post(
  '/post/:postId',
  auth,
  preventPostOwnerReview,
  preventMultipleReviews,
  createReview
);
router.put('/:id', auth, reviewOwner, updateReview);
router.delete('/:id', auth, reviewOwner, deleteReview);

export default router;
