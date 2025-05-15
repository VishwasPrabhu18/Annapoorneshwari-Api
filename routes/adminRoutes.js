import express from 'express';
import { registerAdmin, loginAdmin, refreshToken, getAdminProfile } from '../controllers/adminController.js';
import { requireAuth } from '../utils/jwt.js';

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.post('/refresh-token', refreshToken);
router.get('/profile', requireAuth, getAdminProfile); // Protected 

export default router;