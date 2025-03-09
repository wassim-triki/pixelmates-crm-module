import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/button";
import Footer from "../components/footer";
import BlurContainer from "../components/blurContainer";

function VerifyCode() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
         {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/login.jpg')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)",
        }}
      />
      <main className="relative flex flex-col items-center justify-center w-full px-4">
        <BlurContainer className="w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-xl">
          <h1 className="text-3xl font-bold text-white text-center">Enter Verification Code</h1>
          {<p className="text-red-500 text-center"></p>}
          <form className="w-full space-y-6" onSubmit="">
            <input
              type="text"
              value=""
              onChange=""
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60"
              placeholder="Enter the code sent to your email"
              required
            />
            <Button type="submit" className="w-full bg-yellow-500 text-white py-3 px-6 rounded-full">
              Verify Code
            </Button>
          </form>
        </BlurContainer>
      </main>
      <Footer />
    </div>
  );
}

export default VerifyCode;
