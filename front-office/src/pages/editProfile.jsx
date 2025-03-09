import React, { useState } from "react";
import { User, Mail, Lock } from "lucide-react";
import BlurContainer from "../components/blurContainer";
import Button from "../components/button";
import Footer from "../components/footer";

const EditProfile = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex items-center justify-center py-12 px-6">
        <BlurContainer className="p-8 rounded-2xl bg-white/10 backdrop-blur-xl text-white">
          <h1 className="text-3xl font-bold text-center mb-6">Edit Profile</h1>
          {<p className="text-red-500 text-center">""</p>}
          <form onSubmit="" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <User className="text-yellow-500" size={20} />
                <input
                  type="text"
                  name="firstName"
                  value=""
                  onChange=""
                  className="bg-transparent text-white focus:outline-none w-full"
                  placeholder="First Name"
                  required
                />
              </div>
              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <User className="text-yellow-500" size={20} />
                <input
                  type="text"
                  name="lastName"
                  value=""
                  onChange=""
                  className="bg-transparent text-white focus:outline-none w-full"
                  placeholder="Last Name"
                  required
                />
              </div>
              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <Mail className="text-yellow-500" size={20} />
                <input
                  type="email"
                  name="email"
                  value=""
                  onChange=""
                  className="bg-transparent text-white focus:outline-none w-full"
                  placeholder="Email"
                  required
                />
              </div>
              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <Lock className="text-yellow-500" size={20} />
                <input
                  type="password"
                  name="password"
                  value=""
                  onChange=""
                  className="bg-transparent text-white focus:outline-none w-full"
                  placeholder="New Password (optional)"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-transparent hover:bg-yellow-500 text-yellow-500 hover:text-white border-2 border-yellow-500 font-semibold py-3 px-6 rounded-full transition-all duration-300"
            >
              Save Changes
            </Button>
          </form>
        </BlurContainer>
      </main>
      <Footer />
    </div>
  );
};

export default EditProfile;