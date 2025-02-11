import Review from '../models/reviewModel.js';
import Post from '../models/postsModel.js';
import { CustomError } from '../utils/errorHandler.js';
import asyncHandler from '../utils/asyncHandler.js';

// Get all reviews for a specific post
export const getReviewsByPost = asyncHandler(async (req, res, next) => {
  const postId = req.params.postId;
  const reviews = await Review.find({ post: postId }).populate(
    'user',
    'name email'
  );

  if (!reviews) {
    next(new CustomError('Reviews not found', 404));
  }

  const filteredReviews = reviews.filter((review) => review.user);

  res.status(200).json(filteredReviews);
});

// Get a single review by ID
export const getReviewById = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate(
    'user',
    'name email'
  );
  if (!review) {
    next(new CustomError('Review not found', 404));
  }
  res.status(200).json(review);
});

// Create a new review for a post
export const createReview = asyncHandler(async (req, res, next) => {
  const { text } = req.body;
  const postId = req.params.postId;
  const userId = req.user.id;

  // Check if the post exists
  const post = await Post.findById(postId);
  if (!post) {
    next(new CustomError('Post not found', 404));
  }

  // Check if the user has already posted a review for this post
  const existingReview = await Review.findOne({ post: postId, user: userId });
  if (existingReview) {
    next(new CustomError('You have already reviewed this post', 400));
  }

  // Create and save the new review
  let newReview = new Review({
    text,
    user: userId,
    post: postId,
  });

  await newReview.save();

  // Populate the user data on the saved review
  newReview = await newReview.populate('user', 'name email');

  // Send the response with populated user info
  res.status(201).json({
    text: newReview.text,
    _id: newReview._id,
    user: newReview.user, // User details like name and email
    post: postId,
  });
});

// Update a review by ID
export const updateReview = asyncHandler(async (req, res, next) => {
  const reviewId = req.params.id;
  const updates = req.body;

  const review = await Review.findById(reviewId);
  if (!review) {
    next(new CustomError('Review not found', 404));
  }
  const updatedReview = await Review.findByIdAndUpdate(reviewId, updates, {
    new: true,
    runValidators: true,
  }).populate('user', 'name email');

  res.status(200).json(updatedReview);
});

// Delete a review by ID
export const deleteReview = asyncHandler(async (req, res, next) => {
  const reviewId = req.params.id;
  const userId = req.user.id;

  const review = await Review.findById(reviewId);
  if (!review) {
    next(new CustomError('Review not found', 404));
  }

  await Review.findByIdAndDelete(reviewId);
  res.status(204).json({ message: 'Review deleted successfully' });
});
