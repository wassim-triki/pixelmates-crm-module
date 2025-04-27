import React from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Calendar, Home, Edit3 } from 'lucide-react';
import BlurContainer from '../components/blurContainer';
import Button from '../components/button';
import { useAuth } from '../context/authContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-transparent relative">
      {/* Animations CSS */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/Backg_Login.png')",
          filter: 'blur(5px)',
        }}
      />

      <main 
        className="relative flex-grow flex items-center justify-center py-30 px-6 sm:px-8 md:px-12"
        style={{ animation: 'fadeIn 0.8s ease-out' }}
      >
        <BlurContainer className="w-full sm:w-[750px] p-8 sm:p-10 rounded-2xl bg-white/20 backdrop-blur-xl text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex flex-col items-center space-y-6">

            <div className="w-32 h-32 rounded-full flex items-center justify-center overflow-hidden mb-6 
              transform transition duration-300 hover:scale-105">
              {user?.image ? (
                <img
                  src={user.image}
                  alt="User profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={50} className="text-gray-700 animate-float" />
              )}
            </div>

            <h1 className="text-3xl font-bold mb-4 animate-fade-in">
              {user?.firstName + ' ' + user?.lastName}
            </h1>
            <h2 className="text-xl font-semibold text-white mb-6 text-center">
            {user?.role?.name || 'Role not provided'}
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 w-full">
              {[
                { icon: <Mail />, value: user?.email },
                { icon: <Phone />, value: user?.phone },
                { icon: <Home />, value: user?.address },
                { icon: <Calendar />, value: user?.birthday && new Date(user.birthday).toLocaleDateString() },
              ].map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg w-full
                    transition-transform duration-200 hover:translate-x-1 cursor-default"
                >
                  {item.icon && React.cloneElement(item.icon, { 
                    className: "text-white", 
                    size: 20 
                  })}
                  {item.label && <span className="text-white font-semibold">{item.label}:</span>}
                  <p className="text-center flex-1 break-words truncate">
                    {item.value || 'Not provided'}
                  </p>
                </div>
              ))}
            </div>

            <Link to="/edit-profile" className="w-full mt-6 flex justify-center">
            <Button className="w-48 !bg-[#FA8072] hover:!bg-[#e0685a] text-white border-2 border-[#FA8072]
             font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:shadow-lg
             transform hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-2 ">
            <Edit3 size={18} className="transition-transform group-hover:rotate-12" />
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