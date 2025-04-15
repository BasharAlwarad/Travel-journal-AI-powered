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
const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(`/register`, upload.single('image'), createUser);
router.post(`/login`, loginUser);
router.post(`/logout`, auth, logoutUser);
router.get(`/check-session`, auth, checkSession);

router.get(`/`, auth, getUsers);
router.get(`/:id`, auth, owner, getUserById);
router.put(`/:id`, auth, owner, updateUser);
router.delete(`/:id`, auth, admin, deleteUser);

export default router;
