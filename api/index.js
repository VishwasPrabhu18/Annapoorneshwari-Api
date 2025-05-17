import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import adminRoutes from '../routes/adminRoutes.js';
import galleryRoutes from '../routes/galleryRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// MongoDB connection (initialize only once)
let conn = null;
const connectDB = async () => {
    if (conn == null) {
        conn = await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.MONGODB_DB_NAME}${process.env.MONGODB_PARAMS}`);
        console.log('Connected to MongoDB');
    }
};

app.get('/', (req, res) => {
    res.json({ message: 'Annapoorneshwari Temple API - v1' });
});

app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/gallery', galleryRoutes);

// Export handler
export default async function handler(req, res) {
    try {
        await connectDB();
        return app(req, res); // Let Express handle the request
    } catch (error) {
        console.error('Serverless function error:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}  