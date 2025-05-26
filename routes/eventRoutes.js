import express from 'express';
import multer from 'multer';
import { createEvent, getEvents, getCurrentEvents, getPastEvents } from '../controllers/eventController.js';
import { requireAuth } from '../utils/jwt.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', requireAuth, upload.single('image'), createEvent);
router.get('/', requireAuth, getEvents);
router.get('/current-events', getCurrentEvents);
router.get('/past-events', getPastEvents);

export default router;