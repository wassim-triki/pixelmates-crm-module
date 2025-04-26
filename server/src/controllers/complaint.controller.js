const Complaint = require('../models/Complaint');
const Restaurant = require('../models/Restaurant');
const mongoose = require('mongoose');

// Create a new complaint
const createComplaint = async (req, res) => {
  try {
    const { user, restaurant, title, description, priority, images } = req.body;

    // Validate required fields
    if (!user || !restaurant || !title || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Verify user and restaurant exist
    if (!mongoose.Types.ObjectId.isValid(user) || !mongoose.Types.ObjectId.isValid(restaurant)) {
      return res.status(400).json({ message: 'Invalid user or restaurant ID' });
    }

    const restaurantExists = await Restaurant.findById(restaurant);
    if (!restaurantExists) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const complaint = new Complaint({
      user,
      restaurant,
      title,
      description,
      priority: priority || 'Medium',
      images: images || []
    });

    const savedComplaint = await complaint.save();
    res.status(201).json(savedComplaint);
  } catch (error) {
    res.status(500).json({ message: 'Error creating complaint', error: error.message });
  }
};

// Get all complaints
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('user', 'name email')
      .populate('restaurant', 'name address');
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving complaints', error: error.message });
  }
};

// Get a complaint by ID
const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid complaint ID' });
    }

    const complaint = await Complaint.findById(id)
      .populate('user', 'name email')
      .populate('restaurant', 'name address');

    if (!complaint) {
      return res.status(404). fortunatelyjson({ message: 'Complaint not found' });
    }

    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving complaint', error: error.message });
  }
};

// Update a complaint
const updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, response, images } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid complaint ID' });
    }

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Update only provided fields
    if (title) complaint.title = title;
    if (description) complaint.description = description;
    if (status) complaint.status = status;
    if (priority) complaint.priority = priority;
    if (response) complaint.response = response;
    if (images) complaint.images = images;

    const updatedComplaint = await complaint.save();
    res.status(200).json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: 'Error updating complaint', error: error.message });
  }
};

// Delete a complaint
const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid complaint ID' });
    }

    const complaint = await Complaint.findByIdAndDelete(id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.status(200).json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting complaint', error: error.message });
  }
};

// Get complaints by restaurant
const getComplaintsByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: 'Invalid restaurant ID' });
    }

    const restaurantExists = await Restaurant.findById(restaurantId);
    if (!restaurantExists) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const complaints = await Complaint.find({ restaurant: restaurantId })
      .populate('user', 'name email')
      .populate('restaurant', 'name address');

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving complaints for restaurant', error: error.message });
  }
};

// Get complaints by user
const getUserComplaints = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const complaints = await Complaint.find({ user: userId })
      .populate('user', 'name email')
      .populate('restaurant', 'name address');

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user complaints', error: error.message });
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  getComplaintsByRestaurant,
  getUserComplaints
};