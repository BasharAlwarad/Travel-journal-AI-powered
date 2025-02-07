import { Router } from 'express';
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

import { auth } from '../middlewares/authMiddlewares.js';
const userRouter = Router();

userRouter.post(`/`, createUser);
userRouter.post(`/login`, loginUser);
userRouter.post(`/logout`, logoutUser);
userRouter.get(`/session`, auth, checkSession);
userRouter.get(`/`, auth, getUsers);
userRouter.get(`/:id`, auth, getUserById);
userRouter.put(`/:id`, auth, updateUser);
userRouter.delete(`/:id`, auth, deleteUser);

export default userRouter;
