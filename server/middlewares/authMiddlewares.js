import jwt from 'jsonwebtoken';
import { CustomError } from '../utils/errorHandler.js';
import { JWT_SECRET } from '../config/config.js';
import Post from '../models/postsModels.js';

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

export const owner = (req, res, next) => {
  const userIdFromToken = req.user?.id; // from auth middleware
  const userIdFromParams = req.params.id;

  if (userIdFromToken === userIdFromParams || req.user?.role === 'admin') {
    return next(); // proceed if owner or admin
  }

  next(new CustomError('Access denied. You are not the owner.', 403));
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

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  next(new CustomError('Access denied. Admins only.', 403));
};
