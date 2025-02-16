import jwt from 'jsonwebtoken';
import { CustomError } from '../utils/errorHandler.js';
import { JWT_SECRET } from '../config/config.js';

import Post from '../models/postsModel.js';
import Review from '../models/reviewModel.js';

export const auth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next(new CustomError('Unauthorized access', 401));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    next(new CustomError('Invalid or expired token', 401));
  }
};

export const postOwner = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId).populate('user');
    if (!post) {
      return next(new CustomError('Post not found', 404));
    }

    if (post.user._id.toString() !== userId) {
      console.log('Unauthorized access attempt by:', userId);
      return next(
        new CustomError('Unauthorized: You do not own this post', 403)
      );
    }

    next();
  } catch (error) {
    console.log('Error in ownership check:', error);
    next(new CustomError('Authorization failed', 500));
  }
};

export const reviewOwner = async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return next(new CustomError('Review not found', 404));
    }

    if (review.user.toString() !== userId) {
      return next(
        new CustomError('Unauthorized: You do not own this review', 403)
      );
    }

    next();
  } catch (error) {
    next(new CustomError('Authorization failed', 500));
  }
};

export const preventPostOwnerReview = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);

    if (!post) {
      return next(new CustomError('Post not found', 404));
    }

    if (post.user.toString() === userId) {
      return next(new CustomError('You cannot review your own post', 403));
    }

    next();
  } catch (error) {
    console.error('Error in preventPostOwnerReview middleware:', error);
    next(new CustomError('Authorization failed', 500));
  }
};

export const preventMultipleReviews = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const existingReview = await Review.findOne({ post: postId, user: userId });

    if (existingReview) {
      return next(new CustomError('You have already reviewed this post', 403));
    }

    next();
  } catch (error) {
    console.error('Error in preventMultipleReviews middleware:', error);
    next(new CustomError('Authorization failed', 500));
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  next(new CustomError('Access denied. Admins only.', 403));
};

const requestCounts = new Map();
const RESET_INTERVAL = 24 * 60 * 60 * 1000;

setInterval(() => {
  requestCounts.clear();
}, RESET_INTERVAL);

export const requestLimiter = (req, res, next) => {
  const userId = req.user?.id;

  if (!userId) {
    return next(new CustomError('Unauthorized access', 401));
  }

  const userRequests = requestCounts.get(userId) || {
    count: 0,
    timestamp: Date.now(),
  };

  if (userRequests.count >= 10) {
    return next(
      new CustomError('Request limit exceeded. Try again tomorrow.', 429)
    );
  }

  userRequests.count += 1;
  requestCounts.set(userId, userRequests);

  next();
};
