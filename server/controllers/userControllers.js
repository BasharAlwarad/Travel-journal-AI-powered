import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { bucket } from '../config/firebase.js';
import { CustomError } from '../utils/errorHandler.js';
import asyncHandler from '../utils/asyncHandler.js';

// Get all users
export const getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json(users);
});

// Get user by ID
export const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new CustomError('User not found', 404);
  }
  res.status(200).json(user);
});

// Create a new user

export const createUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const image = req.file;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role,
  });

  if (image) {
    try {
      const blob = bucket.file(
        `images/${name}/${Date.now()}_${image.originalname}`
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
      newUser.image = signedUrl[0];
    } catch (error) {
      return next(new CustomError('Image upload failed', 500));
    }
  }

  await newUser.save();
  res.status(201).json(newUser);
});

// Update user by ID
export const updateUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const updates = req.body;

  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    throw new CustomError('User not found', 404);
  }

  res.status(200).json(updatedUser);
});

// Delete user by ID
export const deleteUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    throw new CustomError('User not found', 404);
  }

  res.status(204).json({ message: 'User deleted successfully' });
});

// User Login
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError('Invalid email or password', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new CustomError('Invalid email or password', 401);
  }

  const token = jwt.sign(
    {
      id: user._id,
      name: user.name,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: 'Login successful',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// User Logout
export const logoutUser = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    path: '/',
  });

  res.status(200).json({ message: 'Logout successful' });
};

// Check Session
export const checkSession = (req, res) => {
  if (req.user) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false });
  }
};
