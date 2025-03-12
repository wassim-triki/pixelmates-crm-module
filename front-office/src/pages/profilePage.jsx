import React from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Edit3 } from 'lucide-react';
import BlurContainer from '../components/blurContainer';
import Button from '../components/button';
import Footer from '../components/footer';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-transparent relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/Profile.jpg')",
          boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.3)',
        }}
      />

      {/* Main Content */}
      <main className="relative flex-grow flex items-center justify-center py-12 px-6 sm:px-8 md:px-12">
        <BlurContainer className="w-[450px] p-8 sm:p-10 rounded-2xl bg-white/20 backdrop-blur-xl text-white shadow-lg">
          <div className="flex flex-col items-center space-y-6">
            {/* Profile Image */}
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
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

            <h1 className="text-3xl font-bold">
              {user?.firstName + ' ' + user?.lastName}
            </h1>

            {/* Profile Info */}
            <div className="space-y-6 w-full">
              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg w-full">
                <Mail className="text-yellow-500" size={20} />
                <p className="text-center flex-1 mr-7">{user?.email}</p>
              </div>

              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <Lock className="text-yellow-500" size={20} />
                <p className="text-center flex-1 mr-7">••••••••••••••••</p>
              </div>
            </div>

            {/* Edit Button */}
            <Link to="/EditProfile">
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white border-2 border-yellow-500 font-semibold py-3 px-6 rounded-full transition-all duration-300 flex items-center justify-center space-x-2">
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
