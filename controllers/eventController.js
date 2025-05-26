import Event from '../models/eventModel.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export const createEvent = async (req, res) => {
  try {
    const { title, location, description, startDateTime, endDateTime } = req.body;
    const adminId = req.user.userId;

    // Parse JSON strings if they are sent as strings
    const startDateTimeObj = typeof startDateTime === 'string' ? JSON.parse(startDateTime) : startDateTime;
    const endDateTimeObj = typeof endDateTime === 'string' ? JSON.parse(endDateTime) : endDateTime;

    let bannerImage = {};

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      bannerImage = {
        filename: req.file.originalname,
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format
      };
    }

    const event = await Event.create({
      title,
      location,
      description,
      bannerImage,
      startDateTime: startDateTimeObj,
      endDateTime: endDateTimeObj,
      created_by: adminId
    });

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create event',
      error: error.message
    });
  }
};

export const getCurrentEvents = async (req, res) => {
  try {
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    const events = await Event.find({
      $or: [
        { 'startDateTime.date': { $gte: currentDate } },
        { 'endDateTime.date': { $gte: currentDate } }
      ]
    }).sort({ 'startDateTime.date': 1, 'startDateTime.time': 1 });

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch current events'
    });
  }
};

export const getEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalEvents = await Event.countDocuments();
    const events = await Event.find()
      .sort({ 'startDateTime.date': 1, 'startDateTime.time': 1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: {
        items: events,
        page,
        total_pages: Math.ceil(totalEvents / limit),
        total_items: totalEvents,
        items_per_page: limit
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events'
    });
  }
};

export const getPastEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20; // Fixed limit of 20 items per page
    const skip = (page - 1) * limit;
    const currentDate = new Date().toISOString().split('T')[0];

    const totalEvents = await Event.countDocuments({
      'endDateTime.date': { $lt: currentDate }
    });

    const pastEvents = await Event.find({
      'endDateTime.date': { $lt: currentDate }
    })
      .sort({ 'endDateTime.date': -1, 'endDateTime.time': -1 }) // Most recent ended events first
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: {
        items: pastEvents,
        page,
        total_pages: Math.ceil(totalEvents / limit),
        total_items: totalEvents,
        items_per_page: limit,
        has_previous: page > 1,
        has_next: page * limit < totalEvents
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch past events'
    });
  }
};