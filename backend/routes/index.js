import express from 'express';
import { verifyToken } from '../JWTmiddleware.js';
import {
  viewUsers,
  createUser,
  editUser,
  deleteUser,
  getUserById
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/users',verifyToken, viewUsers);
router.post('/create',verifyToken, createUser);
router.put('/edit/:id',verifyToken, editUser);
router.delete('/delete/:id',verifyToken, deleteUser);
router.get("/user/:id",verifyToken, getUserById); 

export default router;