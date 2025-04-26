import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useComplaint } from '../context/complaintContext';
import { useAuth } from '../context/authContext';
import BlurContainer from '../components/blurContainer';
import Button from '../components/button';
import { FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axiosInstance from '../config/axios';

const ComplaintForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { createComplaint, updateComplaint, fetchComplaintById, loading, error } = useComplaint();
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [formData, setFormData] = useState({
    restaurant: '',
    title: '',
    description: '',
    priority: 'Medium',
    images: [],
  });
  const [fetchError, setFetchError] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [complaintId, setComplaintId] = useState(null);

  // Check for editId query parameter to determine edit mode
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const editId = searchParams.get('editId');
    if (editId) {
      setIsEditMode(true);
      setComplaintId(editId);
      fetchComplaintData(editId);
    }
  }, [location.search]);

  // Fetch complaint data for editing
  const fetchComplaintData = async (id) => {
    try {
      const complaint = await fetchComplaintById(id);
      setFormData({
        restaurant: complaint.restaurant?._id || complaint.restaurant || '',
        title: complaint.title || '',
        description: complaint.description || '',
        priority: complaint.priority || 'Medium',
        images: complaint.images || [],
      });
    } catch (err) {
      toast.error('Failed to load complaint data');
      navigate('/my-complaints');
    }
  };

  // Fetch restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      setFetchLoading(true);
      try {
        const response = await axiosInstance.get('/restaurants');
        const restaurantData = response.data.data || response.data.restaurants || response.data;
        if (Array.isArray(restaurantData)) {
          setRestaurants(restaurantData);
        } else {
          setFetchError('Invalid restaurant data format');
          setRestaurants([]);
        }
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to fetch restaurants';
        setFetchError(message);
        setRestaurants([]);
        toast.error(message);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? Array.from(files) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please log in to submit a complaint');
      navigate('/login');
      return;
    }

    if (!formData.restaurant) {
      toast.error('Please select a restaurant');
      return;
    }

    const complaintData = {
      user: user._id,
      restaurant: formData.restaurant,
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      images: Array.isArray(formData.images)
        ? formData.images.map((file) =>
            file instanceof File ? URL.createObjectURL(file) : file
          )
        : [],
    };

    try {
      if (isEditMode) {
        await updateComplaint(complaintId, complaintData);
        toast.success('Complaint updated successfully!');
      } else {
        await createComplaint(complaintData);
        toast.success('Complaint submitted successfully!');
      }
      navigate('/my-complaints');
    } catch (err) {
      toast.error(error || `Failed to ${isEditMode ? 'update' : 'submit'} complaint`);
    }
  };

  const handleBackClick = () => navigate('/my-complaints');

  return (
    <div className="flex flex-col min-h-screen bg-transparent relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/Backg_Login.png')",
          filter: 'blur(5px)',
        }}
      />

      <main className="relative flex-grow flex items-center justify-center py-24 px-6">
        <BlurContainer className="w-full max-w-2xl p-8 sm:p-10 rounded-2xl bg-white/20 backdrop-blur-xl text-white shadow-lg">
          <div className="flex justify-start mb-6">
            <button
              onClick={handleBackClick}
              className="text-white bg-transparent p-2 rounded-full hover:bg-gray-500 transition-all duration-300"
            >
              <FaArrowLeft className="text-2xl" />
            </button>
          </div>

          <h1 className="text-3xl font-bold text-center mb-6">
            {isEditMode ? 'Edit Complaint' : 'Submit a Complaint'}
          </h1>

          {fetchLoading && <p className="text-center text-white">Loading restaurants...</p>}
          {fetchError && <p className="text-red-500 text-center mb-4">{fetchError}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1 text-white">Restaurant</label>
              <select
                name="restaurant"
                value={formData.restaurant}
                onChange={handleChange}
                className="p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-[#FA8072] text-white focus:outline-none focus:ring-2 focus:ring-[#e0685a] disabled:opacity-50"
                required
                disabled={fetchLoading || restaurants.length === 0}
              >
                <option value="" disabled className="bg-[#FA8072] text-white">
                  Select a restaurant
                </option>
                {restaurants.map((restaurant) => (
                  <option
                    key={restaurant._id}
                    value={restaurant._id}
                    className="bg-[#FA8072] text-white hover:bg-[#e0685a]"
                  >
                    {restaurant.name}
                  </option>
                ))}
              </select>
            </div>

            {[
              { label: 'Title', name: 'title', type: 'text', placeholder: 'e.g., Incorrect Order' },
              { label: 'Description', name: 'description', type: 'textarea', placeholder: 'Describe the issue in detail' },
            ].map((field) => (
              <div key={field.name} className="flex flex-col">
                <label className="text-sm font-semibold mb-1 text-white">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="p-3 rounded-lg bg-white/10 border border-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-[#FA8072] min-h-[100px]"
                    placeholder={field.placeholder}
                    required
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="p-3 rounded-lg bg-white/10 border border-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-[#FA8072]"
                    placeholder={field.placeholder}
                    required
                  />
                )}
              </div>
            ))}

            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1 text-white">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-[#FA8072] text-white focus:outline-none focus:ring-2 focus:ring-[#e0685a]"
                required
              >
                {['Low', 'Medium', 'High'].map((level) => (
                  <option
                    key={level}
                    value={level}
                    className="bg-[#FA8072] text-white hover:bg-[#e0685a]"
                  >
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1 text-white">Images (Optional)</label>
              <input
                type="file"
                name="images"
                onChange={handleChange}
                multiple
                accept="image/*"
                className="p-3 rounded-lg bg-white/10 border border-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-[#FA8072]"
              />
            </div>

            <div className="flex justify-center pt-6 space-x-4">
              <Button
                type="button"
                onClick={handleBackClick}
                className="bg-transparent border border-white text-white hover:bg-white hover:text-black py-2 px-6 rounded-full transition-all duration-300"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="!bg-[#FA8072] hover:!bg-[#e0685a] text-white py-2 px-6 rounded-full transition-all duration-300"
                disabled={loading || fetchLoading || restaurants.length === 0}
              >
                {loading
                  ? isEditMode
                    ? 'Updating...'
                    : 'Submitting...'
                  : isEditMode
                  ? 'Update Complaint'
                  : 'Submit Complaint'}
              </Button>
            </div>
          </form>
        </BlurContainer>
      </main>
    </div>
  );
};

export default ComplaintForm;