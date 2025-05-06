const Complaint = require('../models/Complaint');
const mongoose = require('mongoose');

/**
 * Get complaint statistics by status
 */
const getComplaintsByStatus = async (req, res) => {
  try {
    const { startDate, endDate, restaurantId } = req.query;

    // Build match criteria
    const matchCriteria = {};

    // Add date range if provided
    if (startDate && endDate) {
      matchCriteria.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Add restaurant filter if provided
    if (restaurantId) {
      if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
        return res.status(400).json({ message: 'Invalid restaurant ID' });
      }
      matchCriteria.restaurant = new mongoose.Types.ObjectId(restaurantId);
    }

    // Aggregate complaints by status
    const statusStats = await Complaint.aggregate([
      { $match: matchCriteria },
      { $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Format the result
    const formattedStats = statusStats.map(stat => ({
      status: stat._id,
      count: stat.count
    }));

    res.status(200).json(formattedStats);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving complaint statistics', error: error.message });
  }
};

/**
 * Get complaint statistics by category
 */
const getComplaintsByCategory = async (req, res) => {
  try {
    const { startDate, endDate, restaurantId } = req.query;

    // Build match criteria
    const matchCriteria = {};

    // Add date range if provided
    if (startDate && endDate) {
      matchCriteria.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Add restaurant filter if provided
    if (restaurantId) {
      if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
        return res.status(400).json({ message: 'Invalid restaurant ID' });
      }
      matchCriteria.restaurant = new mongoose.Types.ObjectId(restaurantId);
    }

    // Aggregate complaints by category
    const categoryStats = await Complaint.aggregate([
      { $match: matchCriteria },
      { $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Format the result
    const formattedStats = categoryStats.map(stat => ({
      category: stat._id,
      count: stat.count
    }));

    res.status(200).json(formattedStats);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving complaint statistics', error: error.message });
  }
};

/**
 * Get complaint statistics by time period (daily, weekly, monthly)
 */
const getComplaintsByTimePeriod = async (req, res) => {
  try {
    const { period, restaurantId } = req.query;

    // Validate period
    if (!['daily', 'weekly', 'monthly'].includes(period)) {
      return res.status(400).json({ message: 'Invalid period. Use daily, weekly, or monthly.' });
    }

    // Build match criteria
    const matchCriteria = {};

    // Add restaurant filter if provided
    if (restaurantId) {
      if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
        return res.status(400).json({ message: 'Invalid restaurant ID' });
      }
      matchCriteria.restaurant = new mongoose.Types.ObjectId(restaurantId);
    }

    // Define group by date format based on period
    let dateFormat;
    if (period === 'daily') {
      dateFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
    } else if (period === 'weekly') {
      dateFormat = {
        $dateToString: {
          format: '%Y-%U', // Year and week number
          date: '$createdAt'
        }
      };
    } else { // monthly
      dateFormat = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
    }

    // Aggregate complaints by time period
    const timeStats = await Complaint.aggregate([
      { $match: matchCriteria },
      { $group: {
          _id: dateFormat,
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format the result
    const formattedStats = timeStats.map(stat => ({
      period: stat._id,
      count: stat.count
    }));

    res.status(200).json(formattedStats);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving complaint statistics', error: error.message });
  }
};

/**
 * Get average resolution time for complaints
 */
const getAverageResolutionTime = async (req, res) => {
  try {
    const { startDate, endDate, restaurantId } = req.query;

    // Build match criteria
    const matchCriteria = {
      status: 'Resolved', // Only consider resolved complaints
      statusHistory: { $exists: true, $ne: [] } // Ensure status history exists
    };

    // Add date range if provided
    if (startDate && endDate) {
      matchCriteria.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Add restaurant filter if provided
    if (restaurantId) {
      if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
        return res.status(400).json({ message: 'Invalid restaurant ID' });
      }
      matchCriteria.restaurant = new mongoose.Types.ObjectId(restaurantId);
    }

    // Get all resolved complaints
    const complaints = await Complaint.find(matchCriteria);

    // Calculate resolution time for each complaint
    let totalResolutionTime = 0;
    let complaintCount = 0;

    complaints.forEach(complaint => {
      // Find the 'Resolved' status entry in history
      const resolvedEntry = complaint.statusHistory.find(entry => entry.status === 'Resolved');
      if (resolvedEntry) {
        const creationTime = new Date(complaint.createdAt).getTime();
        const resolutionTime = new Date(resolvedEntry.timestamp).getTime();
        const timeDiff = resolutionTime - creationTime;

        // Add to total (convert to hours)
        totalResolutionTime += timeDiff / (1000 * 60 * 60);
        complaintCount++;
      }
    });

    // Calculate average
    const averageResolutionTime = complaintCount > 0 ? totalResolutionTime / complaintCount : 0;

    res.status(200).json({
      averageResolutionTimeHours: averageResolutionTime,
      complaintCount: complaintCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating average resolution time', error: error.message });
  }
};

/**
 * Get satisfaction rating statistics
 */
const getSatisfactionRatings = async (req, res) => {
  try {
    const { startDate, endDate, restaurantId } = req.query;

    // Build match criteria
    const matchCriteria = {
      satisfactionRating: { $exists: true, $ne: null } // Only include complaints with ratings
    };

    // Add date range if provided
    if (startDate && endDate) {
      matchCriteria.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Add restaurant filter if provided
    if (restaurantId) {
      if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
        return res.status(400).json({ message: 'Invalid restaurant ID' });
      }
      matchCriteria.restaurant = new mongoose.Types.ObjectId(restaurantId);
    }

    // Aggregate ratings
    const ratingStats = await Complaint.aggregate([
      { $match: matchCriteria },
      { $group: {
          _id: '$satisfactionRating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Calculate average rating
    const totalRatings = ratingStats.reduce((sum, stat) => sum + stat.count, 0);
    const weightedSum = ratingStats.reduce((sum, stat) => sum + (stat._id * stat.count), 0);
    const averageRating = totalRatings > 0 ? weightedSum / totalRatings : 0;

    // Format the result
    const formattedStats = {
      averageRating: averageRating,
      totalRatings: totalRatings,
      distribution: ratingStats.map(stat => ({
        rating: stat._id,
        count: stat.count,
        percentage: totalRatings > 0 ? (stat.count / totalRatings) * 100 : 0
      }))
    };

    res.status(200).json(formattedStats);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving satisfaction ratings', error: error.message });
  }
};

/**
 * Get all analytics data in a single request to avoid rate limiting
 */
const getAllAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, period = 'monthly', restaurantId } = req.query;

    // Build match criteria
    const matchCriteria = {};

    // Add date range if provided
    if (startDate && endDate) {
      matchCriteria.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Add restaurant filter if provided
    if (restaurantId) {
      if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
        return res.status(400).json({ message: 'Invalid restaurant ID' });
      }
      matchCriteria.restaurant = new mongoose.Types.ObjectId(restaurantId);
    }

    // Run all analytics queries in parallel
    const [statusData, categoryData, timeData, resolutionTime] = await Promise.all([
      // Status data
      Complaint.aggregate([
        { $match: matchCriteria },
        { $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]).then(data => data.map(stat => ({
        status: stat._id,
        count: stat.count
      }))),

      // Category data
      Complaint.aggregate([
        { $match: matchCriteria },
        { $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]).then(data => data.map(stat => ({
        category: stat._id,
        count: stat.count
      }))),

      // Time data
      (async () => {
        // Define group by date format based on period
        let dateFormat;
        if (period === 'daily') {
          dateFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
        } else if (period === 'weekly') {
          dateFormat = {
            $dateToString: {
              format: '%Y-%U', // Year and week number
              date: '$createdAt'
            }
          };
        } else { // monthly
          dateFormat = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
        }

        const timeStats = await Complaint.aggregate([
          { $match: matchCriteria },
          { $group: {
              _id: dateFormat,
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } }
        ]);

        return timeStats.map(stat => ({
          period: stat._id,
          count: stat.count
        }));
      })(),

      // Resolution time
      (async () => {
        const resolutionCriteria = {
          ...matchCriteria,
          status: 'Resolved',
          statusHistory: { $exists: true, $ne: [] }
        };

        const complaints = await Complaint.find(resolutionCriteria);

        let totalResolutionTime = 0;
        let complaintCount = 0;

        complaints.forEach(complaint => {
          const resolvedEntry = complaint.statusHistory.find(entry => entry.status === 'Resolved');
          if (resolvedEntry) {
            const creationTime = new Date(complaint.createdAt).getTime();
            const resolutionTime = new Date(resolvedEntry.timestamp).getTime();
            const timeDiff = resolutionTime - creationTime;

            totalResolutionTime += timeDiff / (1000 * 60 * 60);
            complaintCount++;
          }
        });

        return {
          averageResolutionTimeHours: complaintCount > 0 ? totalResolutionTime / complaintCount : 0,
          complaintCount: complaintCount
        };
      })()
    ]);

    // Return all data in a single response
    res.status(200).json({
      statusData,
      categoryData,
      timeData,
      resolutionTime
    });
  } catch (error) {
    console.error('Error retrieving analytics data:', error);
    res.status(500).json({ message: 'Error retrieving analytics data', error: error.message });
  }
};

module.exports = {
  getComplaintsByStatus,
  getComplaintsByCategory,
  getComplaintsByTimePeriod,
  getAverageResolutionTime,
  getSatisfactionRatings,
  getAllAnalytics
};
