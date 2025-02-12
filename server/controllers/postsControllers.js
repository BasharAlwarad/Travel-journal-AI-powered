import Post from '../models/postsModel.js';
import { bucket } from '../config/firebase.js';
import { CustomError } from '../utils/errorHandler.js';
import asyncHandler from '../utils/asyncHandler.js';

// Get all posts
export const getPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find().populate('user', 'name email');
  res.status(200).json({ posts, user: req.user });
});

// Get post by ID
export const getPostById = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate(
    'user',
    'name email'
  );
  if (!post) {
    next(new CustomError('Post not found', 404));
  }
  res.status(200).json(post);
});

// Create a new post
export const createPost = asyncHandler(async (req, res, next) => {
  const { text } = req.body;
  const image = req.file;
  const userId = req.user.id;
  const name = req.user?.name;
  const newPost = new Post({
    text,
    user: userId,
  });

  if (image) {
    try {
      const blob = bucket.file(
        `images/${name}/posts/${Date.now()}_${image.originalname}`
      );
      const blobStream = blob.createWriteStream({
        metadata: { contentType: image.mimetype },
      });

      await new Promise((resolve, reject) => {
        blobStream.on('error', (err) =>
          reject(new CustomError('Image upload failed', 500))
        );
        blobStream.on('finish', resolve);
        blobStream.end(image.buffer);
      });

      // Get signed URL after upload
      const signedUrl = await blob.getSignedUrl({
        action: 'read',
        expires: '03-01-2500',
      });
      newPost.image = signedUrl[0];
    } catch (error) {
      next(new CustomError('Image upload failed', 500));
    }
  }

  await newPost.save();

  res.status(201).json({
    text: newPost.text,
    image: newPost.image,
    _id: newPost._id,
    user: req.user,
  });
});

// Update post by ID
export const updatePost = asyncHandler(async (req, res, next) => {
  const postId = req.params.id;
  const updates = req.body;

  const updatedPost = await Post.findByIdAndUpdate(postId, updates, {
    new: true,
    runValidators: true,
  }).populate('user', 'name email');

  if (!updatedPost) {
    next(new CustomError('Post not found', 404));
  }

  res.status(200).json(updatedPost);
});

// Delete post by ID
export const deletePost = asyncHandler(async (req, res, next) => {
  const postId = req.params.id;
  const deletedPost = await Post.findByIdAndDelete(postId);
  if (!deletedPost) {
    next(new CustomError('Post not found', 404));
  }

  res.status(204).json({ message: 'Post deleted successfully' });
});

// Get posts by authenticated user
export const getPostsByUser = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const posts = await Post.find({ user: userId });
  res.status(200).json(posts);
});
