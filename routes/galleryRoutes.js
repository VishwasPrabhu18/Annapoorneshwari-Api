import express from 'express';
import multer from 'multer';
import { uploadGalleryImage, getGalleryImages } from '../controllers/galleryController.js';
import { requireAuth } from '../utils/jwt.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Update the GET route to support pagination
router.get('/', requireAuth, getGalleryImages);
router.post('/upload-image', requireAuth, upload.single('image'), uploadGalleryImage);

export default router;