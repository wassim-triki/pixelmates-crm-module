import React, { useState } from "react";
import { User, Mail, Lock } from "lucide-react";
import BlurContainer from "../components/blurContainer";
import Button from "../components/button";
import Footer from "../components/footer";

const EditProfile = () => {
  return (
    <div className="flex flex-col min-h-screen bg-transparent relative">
      {/* Main Content */}
      <main className="relative flex-grow flex items-center justify-center py-12 px-6 sm:px-8 md:px-12">
        <BlurContainer className="p-8 sm:p-10 rounded-2xl bg-white/20 backdrop-blur-xl text-white shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-6">Edit Profile</h1>
          {<p className="text-red-500 text-center">{""}</p>}
          <form onSubmit="" className="space-y-6">
            <div className="space-y-4">
              {/* First Name */}
              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <User className="text-yellow-500" size={20} />
                <input
                  type="text"
                  name="firstName"
                  value=""
                  onChange=""
                  className="bg-transparent text-white focus:outline-none w-full placeholder-gray-300"
                  placeholder="First Name"
                  required
                />
              </div>

              {/* Last Name */}
              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <User className="text-yellow-500" size={20} />
                <input
                  type="text"
                  name="lastName"
                  value=""
                  onChange=""
                  className="bg-transparent text-white focus:outline-none w-full placeholder-gray-300"
                  placeholder="Last Name"
                  required
                />
              </div>

              {/* Email */}
              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <Mail className="text-yellow-500" size={20} />
                <input
                  type="email"
                  name="email"
                  value=""
                  onChange=""
                  className="bg-transparent text-white focus:outline-none w-full placeholder-gray-300"
                  placeholder="Email"
                  required
                />
              </div>

              {/* Password */}
              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <Lock className="text-yellow-500" size={20} />
                <input
                  type="password"
                  name="password"
                  value=""
                  onChange=""
                  className="bg-transparent text-white focus:outline-none w-full placeholder-gray-300"
                  placeholder="New Password (optional)"
                />
              </div>
            </div>

            {/* Save Changes Button */}
            <Button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white border-2 border-yellow-500 font-semibold py-3 px-6 rounded-full transition-all duration-300"
            >
              Save Changes
            </Button>
          </form>
        </BlurContainer>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default EditProfile;
