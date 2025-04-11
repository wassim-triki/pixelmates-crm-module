import React, { useState, useEffect } from 'react';
import BlurContainer from '../components/blurContainer';
import Button from '../components/button';
import { useAuth } from '../context/authContext';
import { FaCamera } from 'react-icons/fa';

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
  const [imagePreview, setImagePreview] = useState(''); // Initialize imagePreview state

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        birthday: user.birthday ? user.birthday.split('T')[0] : '', // Format the date here
        image: user.image || '', // Set initial image if exists
      });
      setImagePreview(user.image || ''); // Set the image preview if available
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(formData);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Error updating profile: ' + err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result, // Store the base64 encoded image
        }));
        setImagePreview(reader.result); // Set image preview
      };
      reader.readAsDataURL(file); // Read the file as base64
    }
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
        <BlurContainer className="w-full max-w-3xl p-8 sm:p-10 rounded-2xl bg-white/20 backdrop-blur-xl text-white shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-8">Edit Profile</h1>

          {/* Profile Image */}
          <div className="flex justify-center mb-6">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="w-32 h-32 rounded-full object-cover"
                />
                {/* Camera Icon to Upload Image */}
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
                {/* Camera Icon to Upload Image */}
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {[
                { label: 'First Name', name: 'firstName', type: 'text' },
                { label: 'Last Name', name: 'lastName', type: 'text' },
                { label: 'Email', name: 'email', type: 'email' },
                { label: 'Phone', name: 'phone', type: 'text' },
                { label: 'Address', name: 'address', type: 'text' },
                { label: 'Birthday', name: 'birthday', type: 'date' },
              ].map((field) => (
                <div key={field.name} className="flex flex-col sm:flex-row sm:items-center">
                  <label
                    htmlFor={field.name}
                    className="w-full sm:w-32 text-sm font-semibold mb-2 sm:mb-0 sm:mr-4"
                  >
                    {field.label}:
                  </label>
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="flex-grow p-3 rounded-lg bg-white/20 border border-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-[#FA8072]"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                className="w-full sm:w-1/2 !bg-[#FA8072] hover:!bg-[#e0685a] active:bg-[#FA8072] text-white border-2 border-[#FA8072] font-semibold py-3 px-6 rounded-full transition-all duration-300"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </BlurContainer>
      </main>
    </div>
  );
};

export default EditProfile;
