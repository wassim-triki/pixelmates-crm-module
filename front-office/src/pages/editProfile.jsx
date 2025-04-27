import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BlurContainer from '../components/blurContainer';
import Button from '../components/button';
import { useAuth } from '../context/authContext';
import { FaCamera } from 'react-icons/fa';
import { FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Mail, Phone, Calendar, Home, User } from 'lucide-react';

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    birthday: '',
    image: '',
  });
  const [imagePreview, setImagePreview] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        birthday: user.birthday ? user.birthday.split('T')[0] : '',
        image: user.image || '',
      });
      setImagePreview(user.image || '');
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();

      for (const key in formData) {
        form.append(key, formData[key]);
      }

      await updateUser(form, true);
      toast.success('Profile updated successfully!');
      navigate('/profile');
    } catch (err) {
      toast.error('Error updating profile!');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackClick = () => {
    navigate('/profile');
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent relative">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/Backg_Login.png')",
          filter: 'blur(5px)',
        }}
      />

      {/* Main Content */}
      <main className="relative flex-grow flex items-center justify-center py-30 px-6">
        <BlurContainer className="w-full max-w-4xl p-8 sm:p-10 rounded-2xl bg-white/20 backdrop-blur-xl text-white shadow-lg">
          <div className="flex justify-start mb-6">
            <button
              onClick={handleBackClick}
              className="text-white bg-transparent p-2 rounded-full hover:bg-gray-500 transition-all duration-300"
            >
              <FaArrowLeft className="text-2xl" />
            </button>
          </div>
          <h1 className="text-3xl font-bold text-center mb-8">Edit Profile</h1>

          {/* Profile Image */}
          <div className="flex justify-center mb-12">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="w-32 h-32 rounded-full object-cover"
                />
                <label
                  htmlFor="image"
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer"
                >
                  <FaCamera className="text-black text-xl hover:text-gray-300" />
                </label>
              </div>
            ) : (
              <div className="relative w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-white">No Image</span>
                <label
                  htmlFor="image"
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer"
                >
                  <FaCamera className="text-black text-xl hover:text-gray-300" />
                </label>
              </div>
            )}
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col space-y-6 w-full max-w-xl mx-auto">
              <div className="flex space-x-4">
                <div className="w-full">
                  <div className="flex items-center mb-2">
                    <User size={20} className="text-white mr-2" />
                    <label htmlFor="firstName" className="text-white">First Name</label>
                  </div>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-white/20 border border-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-[#FA8072] max-w-full"
                  />
                </div>

                <div className="w-full">
                  <div className="flex items-center mb-2">
                    <User size={20} className="text-white mr-2" />
                    <label htmlFor="lastName" className="text-white">Last Name</label>
                  </div>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-white/20 border border-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-[#FA8072] max-w-full"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="w-full">
                  <div className="flex items-center mb-2">
                    <Mail size={20} className="text-white mr-2" />
                    <label htmlFor="email" className="text-white">Email</label>
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-white/20 border border-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-[#FA8072] max-w-full"
                  />
                </div>

                <div className="w-full">
                  <div className="flex items-center mb-2">
                    <Phone size={20} className="text-white mr-2" />
                    <label htmlFor="phone" className="text-white">Phone</label>
                  </div>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-white/20 border border-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-[#FA8072] max-w-full"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="w-full">
                  <div className="flex items-center mb-2">
                    <Home size={20} className="text-white mr-2" />
                    <label htmlFor="address" className="text-white">Address</label>
                  </div>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-white/20 border border-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-[#FA8072] max-w-full"
                  />
                </div>

                <div className="w-full">
                  <div className="flex items-center mb-2">
                    <Calendar size={20} className="text-white mr-2" />
                    <label htmlFor="birthday" className="text-white">Birthday</label>
                  </div>
                  <input
                    type="date"
                    id="birthday"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-white/20 border border-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-[#FA8072] max-w-full"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                className="w-48 !bg-[#FA8072] hover:!bg-[#e0685a] text-white border-2 border-[#FA8072] font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-2"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </BlurContainer>
      </main>
    </div>
  );
};

export default EditProfile;
