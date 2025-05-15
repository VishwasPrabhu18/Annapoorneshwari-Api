import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    filename: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    public_id: {
      type: String,
      required: true
    },
    format: {
      type: String,
      required: true
    }
  },
  uploaded_by: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  collection: 'gallery'  // Explicitly set collection name
});

const Gallery = mongoose.model('gallery', gallerySchema);
export default Gallery;