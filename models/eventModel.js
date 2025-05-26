import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  bannerImage: {
    filename: {
      type: String,
    },
    url: {
      type: String,
    },
    public_id: {
      type: String,
    },
    format: {
      type: String,
    }
  },
  startDateTime: {
    date: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    }
  },
  endDateTime: {
    date: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    }
  },
  created_by: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  collection: 'events'
});

const Event = mongoose.model('event', eventSchema);
export default Event;