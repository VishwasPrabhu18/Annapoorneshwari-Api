import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import adminRoutes from './routes/adminRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Connect to MongoDB
mongoose.connect(`${process.env.MONGODB_URL}/${process.env.MONGODB_DB_NAME}${process.env.MONGODB_PARAMS}`)
  .then(() => console.log('\x1b[32m[✓]\x1b[0m Database connected successfully'))
  .catch((err) => console.log('\x1b[31m[✗]\x1b[0m Database connection error:', err.message));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Annapoorneshwari Temple API - v1' });
});

// Routes
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/gallery', galleryRoutes);
app.use("/api/v1/events", eventRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\x1b[32m[✓]\x1b[0m Server is running on http://localhost:${PORT}`);
});