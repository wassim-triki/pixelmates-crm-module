import axiosInstance from './AxiosInstance'; // Adjust path as per your project structure

// Fetch all complaints
export function getComplaints() {
  return axiosInstance.get('/complaints');
}

// Fetch a single complaint by ID
export function getComplaintById(complaintId) {
  return axiosInstance.get(`/complaints/${complaintId}`);
}

// Fetch complaints by restaurant ID
export function getComplaintsByRestaurant(restaurantId) {
  return axiosInstance.get(`/complaints/restaurant/${restaurantId}`);
}

// Fetch complaints by user ID
export function getComplaintsByUser(userId) {
  return axiosInstance.get(`/complaints/user/${userId}`);
}

// Update an existing complaint by ID (e.g., status, response, priority, images)
export function updateComplaint(complaint, complaintId) {
  // Format data to match Mongoose schema expectations, only update provided fields
  const formattedData = {
    title: complaint.title?.trim() || undefined,
    description: complaint.description?.trim() || undefined,
    priority: complaint.priority || undefined,
    status: complaint.status || undefined,
    images: complaint.images || undefined,
    response: complaint.response?.trim() || undefined
  };
  // Remove undefined fields to avoid overwriting with null
  Object.keys(formattedData).forEach(key => formattedData[key] === undefined && delete formattedData[key]);
  return axiosInstance.put(`/complaints/${complaintId}`, formattedData);
}

// Upload an image for a complaint
export function uploadImage(complaintId, imageData) {
  // Assuming imageData is a FormData object for file upload
  return axiosInstance.post(`/complaints/${complaintId}/images`, imageData, {
    headers: {
      'Content-Type': 'multipart/form-data' // Required for file uploads
    }
  });
}