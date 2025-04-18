import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlurContainer from '../components/blurContainer';
import Button from '../components/button';
import { FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ReservationForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 1,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // For now, just simulate a successful reservation
    toast.success('Static reservation submitted!');
    navigate('/');
  };

  const handleBackClick = () => navigate('/');

  return (
    <div className="flex flex-col min-h-screen bg-transparent relative">
      {/* Blurred background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/Backg_Login.png')",
          filter: 'blur(5px)',
        }}
      />

      {/* Blurred container */}
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

          <h1 className="text-3xl font-bold text-center mb-6">Book a Table</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { label: 'Full Name', name: 'name', type: 'text' },
              { label: 'Email', name: 'email', type: 'email' },
              { label: 'Phone', name: 'phone', type: 'tel' },
            ].map((field) => (
              <div key={field.name} className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="p-3 rounded-lg bg-white/20 border border-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-[#FA8072]"
                  required
                />
              </div>
            ))}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="p-3 rounded-lg bg-white/20 border border-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-[#FA8072]"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="p-3 rounded-lg bg-white/20 border border-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-[#FA8072]"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">
                Number of guests (max: 6)
              </label>
              <input
                type="number"
                name="guests"
                min="1"
                max="6"
                value={formData.guests}
                onChange={handleChange}
                className="p-3 rounded-lg bg-white/20 border border-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-[#FA8072]"
                required
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
              >
                Confirm Reservation
              </Button>
            </div>
          </form>
        </BlurContainer>
      </main>
    </div>
  );
};

export default ReservationForm;
