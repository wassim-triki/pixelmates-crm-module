import axiosInstance from './AxiosInstance'; // Adjust path as per your project structure

// Create a new complaint
export function createComplaint(complaint) {
  // Format data to match Mongoose schema expectations
  const formattedData = {
    user: complaint.userId?.trim(),
    restaurant: complaint.restaurantId?.trim(),
    title: complaint.title?.trim(),
    description: complaint.description?.trim(),
    category: complaint.category?.trim(),
    priority: complaint.priority?.trim() || 'Medium',
    images: complaint.images || []
  };

  // Remove undefined fields to avoid sending null values
  Object.keys(formattedData).forEach(
    (key) => formattedData[key] === undefined && delete formattedData[key]
  );

  return axiosInstance.post('/complaints', formattedData).catch((error) => {
    throw new Error(`Failed to create complaint: ${error.response?.data?.message || error.message}`);
  });
}

// Fetch all complaints
export function getComplaints() {
  return axiosInstance.get('/complaints').catch((error) => {
    throw new Error(`Failed to fetch complaints: ${error.response?.data?.message || error.message}`);
  });
}
export const sendResolvedSMS = (complaintId) => {
  return axiosInstance.post(`/complaints/${complaintId}/send-sms`);
};

// Fetch a single complaint by ID
export function getComplaintById(complaintId) {
  if (!complaintId) {
    return Promise.reject(new Error('Complaint ID is required'));
  }
  return axiosInstance.get(`/complaints/${complaintId}`).catch((error) => {
    throw new Error(`Failed to fetch complaint: ${error.response?.data?.message || error.message}`);
  });
}

// Fetch complaints by restaurant ID
export function getComplaintsByRestaurant(restaurantId) {
  if (!restaurantId) {
    return Promise.reject(new Error('Restaurant ID is required'));
  }
  return axiosInstance.get(`/complaints/restaurant/${restaurantId}`).catch((error) => {
    throw new Error(
      `Failed to fetch complaints for restaurant: ${error.response?.data?.message || error.message}`
    );
  });
}


// Fetch complaints by user ID
export function getComplaintsByUser(userId) {
  if (!userId) {
    return Promise.reject(new Error('User ID is required'));
  }
  return axiosInstance.get(`/complaints/user/${userId}`).catch((error) => {
    throw new Error(
      `Failed to fetch user complaints: ${error.response?.data?.message || error.message}`
    );
  });
}

// Update an existing complaint by ID
export function updateComplaint(complaint, complaintId, userId, statusNote) {
  if (!complaintId) {
    return Promise.reject(new Error('Complaint ID is required'));
  }

  // Format data to match Mongoose schema expectations, only update provided fields
  const formattedData = {
    title: complaint.title?.trim() || undefined,
    description: complaint.description?.trim() || undefined,
    category: complaint.category?.trim() || undefined,
    priority: complaint.priority?.trim() || undefined,
    status: complaint.status?.trim() || undefined,
    response: complaint.response !== undefined ? complaint.response : undefined, // Allow null
    images: complaint.images || undefined,
    assignedTo: complaint.assignedTo || undefined,
    userId: userId, // User making the change
    statusNote: statusNote // Note about the status change
  };

  // Remove undefined fields to avoid overwriting with null
  Object.keys(formattedData).forEach(
    (key) => formattedData[key] === undefined && delete formattedData[key]
  );

  return axiosInstance.put(`/complaints/${complaintId}`, formattedData).catch((error) => {
    throw new Error(`Failed to update complaint: ${error.response?.data?.message || error.message}`);
  });
}

// Upload images for a complaint (assuming images are updated via the update endpoint)
export function uploadImages(complaintId, images) {
  if (!complaintId) {
    return Promise.reject(new Error('Complaint ID is required'));
  }
  if (!Array.isArray(images) || images.length === 0) {
    return Promise.reject(new Error('Images array is required'));
  }

  // Update complaint with new images array (assuming images are URLs or processed server-side)
  const formattedData = { images };

  return axiosInstance.put(`/complaints/${complaintId}`, formattedData).catch((error) => {
    throw new Error(
      `Failed to upload images for complaint: ${error.response?.data?.message || error.message}`
    );
  });
}

// Add a comment to a complaint
export function addComment(complaintId, text, userId) {
  if (!complaintId) {
    return Promise.reject(new Error('Complaint ID is required'));
  }
  if (!text) {
    return Promise.reject(new Error('Comment text is required'));
  }
  if (!userId) {
    return Promise.reject(new Error('User ID is required'));
  }

  const commentData = {
    text: text.trim(),
    createdBy: userId
  };

  return axiosInstance.post(`/complaints/${complaintId}/comments`, commentData).catch((error) => {
    throw new Error(`Failed to add comment: ${error.response?.data?.message || error.message}`);
  });
}

// Rate a resolved complaint
export function rateComplaint(complaintId, rating) {
  if (!complaintId) {
    return Promise.reject(new Error('Complaint ID is required'));
  }
  if (!rating || rating < 1 || rating > 5) {
    return Promise.reject(new Error('Rating must be between 1 and 5'));
  }

  return axiosInstance.post(`/complaints/${complaintId}/rate`, { rating }).catch((error) => {
    throw new Error(`Failed to rate complaint: ${error.response?.data?.message || error.message}`);
  });
}

// Process follow-ups for complaints
export function processFollowUps() {
  return axiosInstance.post('/complaints/process-followups').catch((error) => {
    throw new Error(`Failed to process follow-ups: ${error.response?.data?.message || error.message}`);
  });
}

// Get complaint analytics by status
export function getComplaintsByStatus(startDate, endDate, restaurantId) {
  const params = {};
  if (startDate) params.startDate = startDate.toISOString();
  if (endDate) params.endDate = endDate.toISOString();
  if (restaurantId) params.restaurantId = restaurantId;

  return axiosInstance.get('/complaint-analytics/by-status', { params }).catch((error) => {
    throw new Error(`Failed to fetch status analytics: ${error.response?.data?.message || error.message}`);
  });
}

// Get complaint analytics by category
export function getComplaintsByCategory(startDate, endDate, restaurantId) {
  const params = {};
  if (startDate) params.startDate = startDate.toISOString();
  if (endDate) params.endDate = endDate.toISOString();
  if (restaurantId) params.restaurantId = restaurantId;

  return axiosInstance.get('/complaint-analytics/by-category', { params }).catch((error) => {
    throw new Error(`Failed to fetch category analytics: ${error.response?.data?.message || error.message}`);
  });
}

// Get complaint analytics by time period
export function getComplaintsByTimePeriod(period, startDate, endDate, restaurantId) {
  const params = { period: period || 'monthly' };
  if (startDate) params.startDate = startDate.toISOString();
  if (endDate) params.endDate = endDate.toISOString();
  if (restaurantId) params.restaurantId = restaurantId;

  return axiosInstance.get('/complaint-analytics/by-time', { params }).catch((error) => {
    throw new Error(`Failed to fetch time analytics: ${error.response?.data?.message || error.message}`);
  });
}

// Get average resolution time
export function getResolutionTime(startDate, endDate, restaurantId) {
  const params = {};
  if (startDate) params.startDate = startDate.toISOString();
  if (endDate) params.endDate = endDate.toISOString();
  if (restaurantId) params.restaurantId = restaurantId;

  return axiosInstance.get('/complaint-analytics/resolution-time', { params }).catch((error) => {
    throw new Error(`Failed to fetch resolution time: ${error.response?.data?.message || error.message}`);
  });
}

// Get satisfaction ratings
export function getSatisfactionRatings(startDate, endDate, restaurantId) {
  const params = {};
  if (startDate) params.startDate = startDate.toISOString();
  if (endDate) params.endDate = endDate.toISOString();
  if (restaurantId) params.restaurantId = restaurantId;

  return axiosInstance.get('/complaint-analytics/satisfaction', { params }).catch((error) => {
    throw new Error(`Failed to fetch satisfaction ratings: ${error.response?.data?.message || error.message}`);
  });
}