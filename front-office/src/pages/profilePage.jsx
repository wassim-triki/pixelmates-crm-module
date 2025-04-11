import React from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Calendar, Home, Edit3 } from 'lucide-react';
import BlurContainer from '../components/blurContainer';
import Button from '../components/button';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-transparent relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/Backg_Login.png')",
          filter: 'blur(5px)', // Apply blur effect on the background image
        }}
      />

      {/* Main Content */}
      <main className="relative flex-grow flex items-center justify-center py-30 px-6 sm:px-8 md:px-12">
        <BlurContainer className="w-full sm:w-[750px] p-8 sm:p-10 rounded-2xl bg-white/20 backdrop-blur-xl text-white shadow-lg">
          <div className="flex flex-col items-center space-y-6">

            {/* Profile Image */}
            <div className="w-32 h-32 rounded-full flex items-center justify-center overflow-hidden mb-6">
              {user?.image ? (
                <img
                  src={user.image}
                  alt="User profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={50} className="text-gray-700" />
              )}
            </div>

            {/* User Name */}
            <h1 className="text-3xl font-bold mb-6">
              {user?.firstName + ' ' + user?.lastName}
            </h1>

            {/* Profile Info */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 w-full">
              {/* First Name */}
              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg w-full">
                <span className="text-white font-semibold">First Name:</span>
                <p className="text-center flex-1 break-words">{user?.firstName || 'Not provided'}</p>
              </div>

              {/* Last Name */}
              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg w-full">
                <span className="text-white font-semibold">Last Name:</span>
                <p className="text-center flex-1 break-words">{user?.lastName || 'Not provided'}</p>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg w-full">
                <Mail className="text-white" size={20} />
                <p className="text-center flex-1 break-words truncate">{user?.email}</p>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg w-full">
                <Phone className="text-white" size={20} />
                <p className="text-center flex-1 break-words">{user?.phone || 'Not provided'}</p>
              </div>

              {/* Address */}
              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg w-full">
                <Home className="text-white" size={20} />
                <p className="text-center flex-1 break-words">{user?.address || 'Not provided'}</p>
              </div>

              {/* Birthday */}
              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg w-full">
                <Calendar className="text-white" size={20} />
                <p className="text-center flex-1 break-words">
                  {user?.birthday ? new Date(user.birthday).toLocaleDateString() : 'Not provided'}
                </p>
              </div>
            </div>

            {/* Edit Profile Button */}
            <Link to="/edit-profile">
              <Button className="w-full !bg-[#FA8072] hover:!bg-[#e0685a] active:bg-[#FA8072] text-white hover:text-white active:text-white border-2 disabled:border-[#FA8072]/50 border-[#FA8072] font-semibold py-3 px-6 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center space-x-2 mt-6">
                <Edit3 size={18} />
                <span>Edit Profile</span>
              </Button>
            </Link>
          </div>
        </BlurContainer>
      </main>
    </div>
  );
};

export default Profile;
