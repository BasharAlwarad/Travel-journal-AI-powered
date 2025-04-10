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
  preventMultipleReviews,
  preventPostOwnerReview,
  reviewOwner,
} from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/post/:postId', getReviewsByPost);
router.post(
  '/post/:postId',
  auth,
  preventPostOwnerReview,
  preventMultipleReviews,
  createReview
);

router.get('/:id', auth, getReviewById);
router.put('/:id', auth, reviewOwner, updateReview);
router.delete('/:id', auth, reviewOwner, deleteReview);

export default router;
