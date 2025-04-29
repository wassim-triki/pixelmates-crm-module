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
    category: '',
    priority: 'Medium',
    images: [],
  });
  const [formErrors, setFormErrors] = useState({});
  const [fetchError, setFetchError] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [complaintId, setComplaintId] = useState(null);
  const [initialFormData, setInitialFormData] = useState(null);

  // Categories to match ComplaintList
  const categories = ['Food Quality', 'Service', 'Cleanliness', 'Billing', 'Other'];

  // Check for editId query parameter to determine edit mode
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const editId = searchParams.get('editId');
    if (editId) {
      setIsEditMode(true);
      setComplaintId(editId);
      fetchComplaintData(editId);
    } else {
      setInitialFormData({ ...formData });
      setFetchLoading(false);
    }
  }, [location.search]);

  // Fetch complaint data for editing
  const fetchComplaintData = async (id) => {
    try {
      const complaint = await fetchComplaintById(id);
      const complaintData = {
        restaurant: complaint.restaurant?._id || complaint.restaurant || '',
        title: complaint.title || '',
        description: complaint.description || '',
        category: complaint.category || '',
        priority: complaint.priority || 'Medium',
        images: complaint.images || [],
      };
      setFormData(complaintData);
      setInitialFormData(complaintData);
    } catch (err) {
      toast.error('Failed to load complaint data');
      navigate('/my-complaints');
    } finally {
      setFetchLoading(false);
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
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.restaurant) errors.restaurant = 'Restaurant is required';
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.category) errors.category = 'Category is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please log in to submit a complaint');
      navigate('/login');
      return;
    }

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please fill in all required fields');
      return;
    }

    const complaintData = {
      user: user._id,
      restaurant: formData.restaurant,
      title: formData.title,
      description: formData.description,
      category: formData.category,
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
      const errorMessage = error || err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'submit'} complaint`;
      toast.error(errorMessage);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData || {
      restaurant: '',
      title: '',
      description: '',
      category: '',
      priority: 'Medium',
      images: [],
    });
    setFormErrors({});
    toast.info('Form reset');
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
              aria-label="Go back"
            >
              <FaArrowLeft className="text-2xl" />
            </button>
          </div>

          <h1 className="text-3xl font-bold text-center mb-6">
            {isEditMode ? 'Edit Complaint' : 'Submit a Complaint'}
          </h1>

          {fetchLoading && <p className="text-center text-white">Loading data...</p>}
          {fetchError && <p className="text-red-500 text-center mb-4">{fetchError}</p>}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col">
              <label htmlFor="restaurant" className="text-sm font-semibold mb-1 text-white">
                Restaurant <span className="text-red-500">*</span>
              </label>
              <select
                id="restaurant"
                name="restaurant"
                value={formData.restaurant}
                onChange={handleChange}
                className={`p-3 rounded-lg bg-white/10 backdrop-blur-sm border ${
                  formErrors.restaurant ? 'border-red-500' : 'border-[#FA8072]'
                } text-white focus:outline-none focus:ring-2 focus:ring-[#e0685a] disabled:opacity-50`}
                required
                disabled={fetchLoading || restaurants.length === 0}
                aria-invalid={!!formErrors.restaurant}
                aria-describedby={formErrors.restaurant ? 'restaurant-error' : undefined}
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
              {formErrors.restaurant && (
                <p id="restaurant-error" className="text-red-500 text-sm mt-1">
                  {formErrors.restaurant}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label htmlFor="category" className="text-sm font-semibold mb-1 text-white">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`p-3 rounded-lg bg-white/10 backdrop-blur-sm border ${
                  formErrors.category ? 'border-red-500' : 'border-[#FA8072]'
                } text-white focus:outline-none focus:ring-2 focus:ring-[#e0685a]`}
                required
                aria-invalid={!!formErrors.category}
                aria-describedby={formErrors.category ? 'category-error' : undefined}
              >
                <option value="" disabled className="bg-[#FA8072] text-white">
                  Select a category
                </option>
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                    className="bg-[#FA8072] text-white hover:bg-[#e0685a]"
                  >
                    {category}
                  </option>
                ))}
              </select>
              {formErrors.category && (
                <p id="category-error" className="text-red-500 text-sm mt-1">
                  {formErrors.category}
                </p>
              )}
            </div>

            {[
              {
                label: 'Title',
                name: 'title',
                type: 'text',
                placeholder: 'e.g., Incorrect Order',
                required: true,
              },
              {
                label: 'Description',
                name: 'description',
                type: 'textarea',
                placeholder: 'Describe the issue in detail',
                required: true,
              },
            ].map((field) => (
              <div key={field.name} className="flex flex-col">
                <label htmlFor={field.name} className="text-sm font-semibold mb-1 text-white">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className={`p-3 rounded-lg bg-white/10 border ${
                      formErrors[field.name] ? 'border-red-500' : 'border-gray-300'
                    } text-white focus:outline-none focus:ring-2 focus:ring-[#FA8072] min-h-[100px]`}
                    placeholder={field.placeholder}
                    required={field.required}
                    aria-invalid={!!formErrors[field.name]}
                    aria-describedby={formErrors[field.name] ? `${field.name}-error` : undefined}
                  />
                ) : (
                  <input
                    id={field.name}
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className={`p-3 rounded-lg bg-white/10 border ${
                      formErrors[field.name] ? 'border-red-500' : 'border-gray-300'
                    } text-white focus:outline-none focus:ring-2 focus:ring-[#FA8072]`}
                    placeholder={field.placeholder}
                    required={field.required}
                    aria-invalid={!!formErrors[field.name]}
                    aria-describedby={formErrors[field.name] ? `${field.name}-error` : undefined}
                  />
                )}
                {formErrors[field.name] && (
                  <p id={`${field.name}-error`} className="text-red-500 text-sm mt-1">
                    {formErrors[field.name]}
                  </p>
                )}
              </div>
            ))}

          

            <div className="flex flex-col">
              <label htmlFor="images" className="text-sm font-semibold mb-1 text-white">
                Images (Optional)
              </label>
              <input
                id="images"
                type="file"
                name="images"
                multiple
                accept="image/*"
                onChange={handleChange}
                className="p-3 rounded-lg bg-white/10 border border-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-[#FA8072]"
              />
              <p className="text-sm text-gray-300 mt-1">
                Note: Images are converted to URLs locally. Backend should handle file uploads and return URLs.
              </p>
              {formData.images.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.images.map((image, index) => (
                    <img
                      key={index}
                      src={image instanceof File ? URL.createObjectURL(image) : image}
                      alt={`Preview ${index + 1}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-center pt-6 space-x-4">
              <Button
                type="button"
                onClick={handleReset}
                className="bg-transparent border border-white text-white hover:bg-white hover:text-black py-2 px-6 rounded-full transition-all duration-300"
              >
                Reset
              </Button>
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
