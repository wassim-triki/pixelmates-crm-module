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
export function updateComplaint(complaint, complaintId) {
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
    images: complaint.images || undefined
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