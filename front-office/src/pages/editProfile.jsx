import React, { useState, useEffect } from 'react';
import BlurContainer from '../components/blurContainer';
import Button from '../components/button';
import { useAuth } from '../context/authContext';


const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    birthday: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        birthday: user.birthday ? user.birthday.split('T')[0] : '', // Formater la date ici
      });
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
      <main className="relative flex-grow flex items-center justify-center py-12 px-6">
        <BlurContainer className="w-full max-w-3xl p-8 sm:p-10 rounded-2xl bg-white/20 backdrop-blur-xl text-white shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-8">Edit Profile</h1>

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
