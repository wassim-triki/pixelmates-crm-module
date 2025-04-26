import { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '../config/axios';
import { jwtDecode } from 'jwt-decode';

const ComplaintContext = createContext();

export const ComplaintProvider = ({ children }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Extract current user ID from token
  const getCurrentUserId = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('No access token found');
    try {
      const decoded = jwtDecode(token);
      return decoded.userId || decoded.id || decoded._id; // depending on your backend
    } catch (e) {
      throw new Error('Invalid token');
    }
  };

  const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

  const checkToken = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('No access token found');
    return token;
  };

  const fetchAllComplaints = async () => {
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    try {
      checkToken();
      const response = await axiosInstance.get('/complaints', {
        signal: controller.signal
      });
      setComplaints(response.data);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch complaints';
      setError(message);
      console.error('Error fetching complaints:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchComplaintById = async (id) => {
    if (!isValidObjectId(id)) {
      setError('Invalid complaint ID');
      throw new Error('Invalid complaint ID');
    }
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    try {
      checkToken();
      const response = await axiosInstance.get(`/complaints/${id}`, {
        signal: controller.signal
      });
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch complaint';
      setError(message);
      console.error('Error fetching complaint:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchComplaintsByRestaurant = async (restaurantId) => {
    if (!isValidObjectId(restaurantId)) {
      setError('Invalid restaurant ID');
      throw new Error('Invalid restaurant ID');
    }
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    try {
      checkToken();
      const response = await axiosInstance.get(`/complaints/restaurant/${restaurantId}`, {
        signal: controller.signal
      });
      setComplaints(response.data);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch restaurant complaints';
      setError(message);
      console.error('Error fetching restaurant complaints:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchUserComplaints = async () => {
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    try {
      checkToken();
      const userId = getCurrentUserId(); // ✅ always use current user
      const response = await axiosInstance.get(`/complaints/user/${userId}`, {
        signal: controller.signal
      });
      setComplaints(response.data);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch user complaints';
      setError(message);
      console.error('Error fetching user complaints:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const validateComplaintData = (data) => {
    const { user, restaurant, title, description } = data;
    if (!user || !isValidObjectId(user)) return 'Invalid or missing user ID';
    if (!restaurant || !isValidObjectId(restaurant)) return 'Invalid or missing restaurant ID';
    if (!title || typeof title !== 'string' || title.trim() === '') return 'Title is required';
    if (!description || typeof description !== 'string' || description.trim() === '') return 'Description is required';
    if (data.priority && !['Low', 'Medium', 'High'].includes(data.priority)) return 'Invalid priority value';
    if (data.images && !Array.isArray(data.images)) return 'Images must be an array';
    return null;
  };

  const createComplaint = async (complaintData) => {
    const userId = getCurrentUserId(); // ✅ always inject current user ID
    const complaintWithUser = { ...complaintData, user: userId };

    const validationError = validateComplaintData(complaintWithUser);
    if (validationError) {
      setError(validationError);
      throw new Error(validationError);
    }

    setLoading(true);
    setError(null);
    const controller = new AbortController();
    try {
      checkToken();
      const response = await axiosInstance.post('/complaints', complaintWithUser, {
        signal: controller.signal
      });
      setComplaints((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create complaint';
      setError(message);
      console.error('Error creating complaint:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateComplaint = async (id, data) => {
    if (!isValidObjectId(id)) {
      setError('Invalid complaint ID');
      throw new Error('Invalid complaint ID');
    }
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    try {
      checkToken();
      const response = await axiosInstance.put(`/complaints/${id}`, data, {
        signal: controller.signal
      });
      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint._id === id ? response.data : complaint
        )
      );
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update complaint';
      setError(message);
      console.error('Error updating complaint:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteComplaint = async (id) => {
    if (!isValidObjectId(id)) {
      setError('Invalid complaint ID');
      throw new Error('Invalid complaint ID');
    }
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    try {
      checkToken();
      await axiosInstance.delete(`/complaints/${id}`, {
        signal: controller.signal
      });
      setComplaints((prev) => prev.filter((complaint) => complaint._id !== id));
      return { message: 'Complaint deleted successfully' };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete complaint';
      setError(message);
      console.error('Error deleting complaint:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    console.log('Complaints state changed:', complaints);
  }, [complaints]);

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        loading,
        error,
        fetchAllComplaints,
        fetchComplaintById,
        fetchComplaintsByRestaurant,
        fetchUserComplaints,
        createComplaint,
        updateComplaint,
        deleteComplaint
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaint = () => useContext(ComplaintContext);
