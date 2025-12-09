import Place from '../models/Place.js';
import { authenticateToken } from '../middleware/auth.js';

let io;

export const setIO = (socketIO) => {
  io = socketIO;
};

// Get all places
export const getPlaces = async (req, res) => {
  try {
    const places = await Place.find()
      .populate('userId', 'name picture email')
      .sort({ createdAt: -1 });
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single place
export const getPlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create place
export const createPlace = async (req, res) => {
  try {
    const { name, type, location, description, eventEndTime } = req.body;
    
    if (!name || !location || !location.lat || !location.lng) {
      return res.status(400).json({ message: 'Name and location are required' });
    }

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const place = new Place({
      name,
      type,
      location,
      description,
      userId: req.user.userId,
      userName: req.user.name || 'Anonymous',
      eventEndTime: eventEndTime ? new Date(eventEndTime) : undefined
    });

    const savedPlace = await place.save();
    const populatedPlace = await Place.findById(savedPlace._id).populate('userId', 'name picture');
    
    // Emit to all connected clients
    if (io) io.emit('placeCreated', populatedPlace);
    
    res.status(201).json(populatedPlace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update place
export const updatePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    // Check ownership
    if (place.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only update your own places' });
    }

    const updatedPlace = await Place.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'name picture');
    
    if (io) io.emit('placeUpdated', updatedPlace);
    res.json(updatedPlace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete place
export const deletePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    // Check ownership
    if (place.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only delete your own places' });
    }

    await Place.findByIdAndDelete(req.params.id);
    
    if (io) io.emit('placeDeleted', req.params.id);
    res.json({ message: 'Place deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

