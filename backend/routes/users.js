import express from 'express';
import { register, login, home, uploadProfile, upload } from '../controllers/userController.js';
import { verifyToken } from '../JWTmiddleware.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/home', verifyToken,home);
router.post('/profile/upload/:id',verifyToken, upload.single('image'), uploadProfile);

export default router;