import { Router } from 'express';
import multer from 'multer';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  checkSession,
  loginUser,
  logoutUser,
} from '../controllers/userControllers.js';

import { auth, owner, admin } from '../middlewares/authMiddlewares.js';
const userRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

userRouter.post(`/register`, upload.single('image'), createUser);
userRouter.post(`/login`, loginUser);
userRouter.post(`/logout`, auth, logoutUser);
userRouter.get(`/check-session`, auth, checkSession);

userRouter.get(`/`, auth, getUsers);
userRouter.get(`/:id`, auth, owner, getUserById);
userRouter.put(`/:id`, auth, owner, updateUser);
userRouter.delete(`/:id`, auth, admin, deleteUser);

export default userRouter;
