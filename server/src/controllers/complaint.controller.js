const Complaint = require('../models/Complaint');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const { sendResolvedSMS } = require('../utils/sms');
const { sendStatusUpdateEmail, sendNewCommentEmail, sendFollowUpEmail } = require('../utils/complaintNotifications');
const mongoose = require('mongoose');

// Create a new complaint
const createComplaint = async (req, res) => {
  try {
    const { user, restaurant, title, description, category, priority, images } = req.body;

    // Validate required fields
    if (!user || !restaurant || !title || !description || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Verify user and restaurant IDs
    if (!mongoose.Types.ObjectId.isValid(user) || !mongoose.Types.ObjectId.isValid(restaurant)) {
      return res.status(400).json({ message: 'Invalid user or restaurant ID' });
    }

    // Verify restaurant exists
    const restaurantExists = await Restaurant.findById(restaurant);
    if (!restaurantExists) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Validate category
    const validCategories = ['Food Quality', 'Service', 'Cleanliness', 'Billing', 'Other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const complaint = new Complaint({
      user,
      restaurant,
      title,
      description,
      category,
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
      return res.status(404).json({ message: 'Complaint not found' });
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
    const {
      title,
      description,
      status,
      priority,
      category,
      response,
      images,
      assignedTo,
      statusNote,
      userId // ID of the user making the change
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid complaint ID' });
    }

    const complaint = await Complaint.findById(id)
      .populate('user')
      .populate('restaurant');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Store original status for comparison
    const originalStatus = complaint.status;

    // Update only provided fields
    if (title) complaint.title = title;
    if (description) complaint.description = description;
    if (status) {
      const validStatuses = ['Pending', 'In Progress', 'Resolved', 'Closed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }

      // If status is changing, set who changed it and why
      if (status !== originalStatus && userId) {
        complaint.setStatusChange(userId, statusNote || `Status changed to ${status}`);
      }

      complaint.status = status;
    }
    if (priority) {
      const validPriorities = ['Low', 'Medium', 'High'];
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({ message: 'Invalid priority' });
      }
      complaint.priority = priority;
    }
    if (category) {
      const validCategories = ['Food Quality', 'Service', 'Cleanliness', 'Billing', 'Other'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({ message: 'Invalid category' });
      }
      complaint.category = category;
    }
    if (response !== undefined) {
      const validResponses = ['Refund', 'Replacement', 'Apology', 'Discount', 'No Action', null];
      if (!validResponses.includes(response)) {
        return res.status(400).json({ message: 'Invalid response' });
      }
      complaint.response = response;
    }
    if (images) complaint.images = images;

    // Update assignedTo if provided
    if (assignedTo) {
      if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
        return res.status(400).json({ message: 'Invalid assignee ID' });
      }
      complaint.assignedTo = assignedTo;
    }

    const updatedComplaint = await complaint.save();

    // Send email notification if status has changed
    if (status && status !== originalStatus) {
      try {
        // Get the base URL from the request
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        // Get the user who made the change (if provided)
        let changer = null;
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
          changer = await User.findById(userId);
        }

        // Send email notification
        await sendStatusUpdateEmail(
          updatedComplaint,
          complaint.user,
          complaint.restaurant,
          statusNote || `Status updated by ${changer ? changer.name : 'staff'}`,
          baseUrl
        );
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError);
        // Don't fail the request if email sending fails
      }
    }

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
const sendSMS = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.complaintId)
      .populate('user', 'phoneNumber')
      .populate('restaurant', 'name');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.status !== 'Resolved') {
      return res.status(400).json({ message: 'Complaint is not resolved' });
    }

    if (!complaint.user.phoneNumber) {
      return res.status(400).json({ message: 'User has no phone number registered' });
    }

    const result = await sendResolvedSMS(
      complaint.user.phoneNumber,
      complaint._id
    );

    res.json({
      message: 'SMS notification sent successfully',
      sid: result.sid
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Error sending SMS notification'
    });
  }
};

// Add a comment to a complaint
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, createdBy } = req.body;

    if (!text || !createdBy) {
      return res.status(400).json({ message: 'Comment text and author are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(createdBy)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const complaint = await Complaint.findById(id)
      .populate('user')
      .populate('restaurant');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Create the new comment
    const newComment = {
      text,
      createdBy,
      createdAt: new Date()
    };

    // Add comment to the complaint
    complaint.comments.push(newComment);
    await complaint.save();

    // Get the comment author details
    const commentAuthor = await User.findById(createdBy);

    // Send email notification about the new comment
    try {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      await sendNewCommentEmail(
        complaint,
        complaint.user,
        newComment,
        commentAuthor,
        baseUrl
      );
    } catch (emailError) {
      console.error('Failed to send comment notification email:', emailError);
      // Don't fail the request if email sending fails
    }

    res.status(201).json({
      message: 'Comment added successfully',
      comment: newComment
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};

// Rate a resolved complaint
const rateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid complaint ID' });
    }

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Only allow rating if complaint is resolved
    if (complaint.status !== 'Resolved') {
      return res.status(400).json({ message: 'Only resolved complaints can be rated' });
    }

    // Update the satisfaction rating
    complaint.satisfactionRating = rating;

    // If rating is low (1-2), mark for follow-up
    if (rating <= 2) {
      complaint.followUpRequired = true;

      // Set follow-up date to 3 days from now if not already set
      if (!complaint.followUpDate) {
        const followUpDate = new Date();
        followUpDate.setDate(followUpDate.getDate() + 3);
        complaint.followUpDate = followUpDate;
      }
    } else {
      // For higher ratings, mark follow-up as complete
      complaint.followUpRequired = false;
    }

    await complaint.save();

    res.status(200).json({
      message: 'Complaint rated successfully',
      rating: rating
    });
  } catch (error) {
    res.status(500).json({ message: 'Error rating complaint', error: error.message });
  }
};

// Process follow-ups for complaints
const processFollowUps = async (req, res) => {
  try {
    // Find complaints that need follow-up today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const complaints = await Complaint.find({
      followUpRequired: true,
      followUpDate: {
        $gte: today,
        $lt: tomorrow
      }
    }).populate('user').populate('restaurant');

    // Process each complaint
    const results = [];
    for (const complaint of complaints) {
      try {
        // Send follow-up email
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        await sendFollowUpEmail(complaint, complaint.user, baseUrl);

        // Update the follow-up date to 7 days later
        const newFollowUpDate = new Date();
        newFollowUpDate.setDate(newFollowUpDate.getDate() + 7);
        complaint.followUpDate = newFollowUpDate;

        await complaint.save();

        results.push({
          complaintId: complaint._id,
          status: 'success',
          message: 'Follow-up email sent'
        });
      } catch (error) {
        results.push({
          complaintId: complaint._id,
          status: 'error',
          message: error.message
        });
      }
    }

    res.status(200).json({
      processed: complaints.length,
      results: results
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing follow-ups', error: error.message });
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  getComplaintsByRestaurant,
  getUserComplaints,
  sendSMS,
  addComment,
  rateComplaint,
  processFollowUps
};