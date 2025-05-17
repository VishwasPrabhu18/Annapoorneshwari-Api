import Gallery from '../models/galleryModel.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export const uploadGalleryImage = async (req, res) => {
  try {
    const { title, description } = req.body;
    const adminId = req.user.userId;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const result = await uploadToCloudinary(req.file.buffer);

    const imageDoc = {
      filename: req.file.originalname,
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format
    };

    const gallery = await Gallery.create({
      title,
      description,
      image: imageDoc,
      uploaded_by: adminId
    });

    res.status(201).json({
      success: true,
      data: gallery
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Image upload failed: ${error.message}`
    });
  }
};

export const getGalleryImages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    // Get total count of documents
    const totalImages = await Gallery.countDocuments();

    // Get paginated gallery items
    const galleryItems = await Gallery.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Calculate total pages
    const totalPages = Math.ceil(totalImages / limit);

    res.json({
      success: true,
      data: {
        items: galleryItems,
        page: page,
        total_pages: totalPages,
        total_items: totalImages,
        items_per_page: limit
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery images'
    });
  }
};