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

router.use(auth);

router.get('/post/:postId', getReviewsByPost);
router.post(
  '/post/:postId',
  preventPostOwnerReview,
  preventMultipleReviews,
  createReview
);

router.get('/:id', getReviewById);
router.put('/:id', reviewOwner, updateReview);
router.delete('/:id', reviewOwner, deleteReview);

export default router;
