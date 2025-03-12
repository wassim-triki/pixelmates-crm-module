import React from 'react';
import { motion } from 'framer-motion';
import BlurContainer from '../components/blurContainer';

const AboutUs = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/bg.jpg')",
          boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.3)',
        }}
      />
      <div className="relative min-h-screen flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-16">
        <div className="w-full max-w-7xl pt-8">
        <BlurContainer
            blur="xl"
            opacity={30}
            padding={8}
            rounded="2xl"
            className="w-full mx-auto p-6"
          >
            <div className="flex flex-col space-y-10">
              {/* Header Section */}
              <div className="text-center mb-12">
                <h1 className="text-3xl md:text-5xl font-bold text-black">About Us</h1>
                <p className="text-lg md:text-xl mt-4 text-white">
                  Welcome to TheMenuFy, your go-to food destination.
                </p>
              </div>

              {/* Why Choose Us Section */}
              <section className="text-center mb-16">
                <h2 className="text-3xl font-semibold text-[#FA8072] mb-6">Why Choose Us?</h2>
                <p className="text-lg text-white text-left">
                  We provide a seamless and delightful culinary experience with a variety of mouthwatering dishes curated for every taste. Our platform connects you to the best local eateries, ensuring you enjoy great meals delivered right to your doorstep.
                </p>
              </section>

              {/* Our Features Section */}
              <section className="text-center mb-16">
                <h2 className="text-3xl font-semibold text-[#FA8072] mb-6">Our Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Feature 1: Smart Reservation Management */}
                  <div className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition duration-300">
                    <h3 className="text-xl font-semibold text-black mb-4">Smart Reservation Management</h3>
                    <ul className="list-disc text-left text-black">
                      <li>Real-time sync between online & in-person bookings</li>
                      <li>AI-powered table allocation for seamless seating</li>
                      <li>Automated waitlists with instant notifications</li>
                    </ul>
                  </div>

                  {/* Feature 2: Intelligent Complaint Handling */}
                  <div className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition duration-300">
                    <h3 className="text-xl font-semibold text-black mb-4">Intelligent Complaint Handling</h3>
                    <ul className="list-disc text-left text-black">
                      <li>Centralized dashboard for quick issue resolution</li>
                      <li>Automated priority system for faster responses</li>
                      <li>AI chatbot & instant feedback loop to build customer trust</li>
                    </ul>
                  </div>

                  {/* Feature 3: Advanced Customer Loyalty Program */}
                  <div className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition duration-300">
                    <h3 className="text-xl font-semibold text-black mb-4">Advanced Customer Loyalty Program</h3>
                    <ul className="list-disc text-left text-black">
                      <li>Personalized rewards & promotions</li>
                      <li>AI-driven loyalty points system based on behavior</li>
                      <li>Data insights to predict & enhance customer engagement</li>
                    </ul>
                  </div>
                </div>
              </section>

{/* Our Vision and Our Values Sections */}
<section className="flex justify-between py-12 mb-16">
  {/* Our Vision Card */}
  <div className="w-1/2 p-6 bg-white shadow-xl rounded-lg hover:shadow-2xl transition duration-300 mr-8">
    <h2 className="text-3xl font-semibold text-[#FA8072] mb-6 text-center">Our Vision</h2>
    <p className="text-lg text-black text-left">
      At TheMenuFy, our vision is straightforward: to provide our customers with a memorable culinary experience by combining creativity, freshness, and authenticity.
    </p>
  </div>
  
  {/* Our Values Card */}
  <div className="w-1/2 p-6 bg-white shadow-xl rounded-lg hover:shadow-2xl transition duration-300">
    <h2 className="text-3xl font-semibold text-[#FA8072] mb-6 text-center">Our Values</h2>
    <p className="text-lg text-black text-left">
      We are guided by a set of values that define our approach to cuisine and customer service. We prioritize quality, authenticity, and customer satisfaction in everything we do.
    </p>
  </div>
</section>

              {/* Our Partners Section */}
              <section className="text-center mb-16">
  <h2 className="text-3xl font-semibold text-[#FA8072] mb-6">Our Partners</h2>
  <p className="text-lg text-white mb-6 text-left">
    Our partners are at the heart of our success. TheMenuFy collaborates with a selection of local restaurants and cafes, known for their quality and passion. Together, we offer you a unique culinary diversity, tailored to all tastes and preferences.
  </p>
  {/* Partner Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
  <div className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition duration-300">
      <img src="/Paul.png" alt="Paul" className="w-full h-55 object-cover rounded-t-lg" />
      <h3 className="text-xl font-semibold text-[#FA8072] mt-4">Paul</h3>
      <p className="text-black mt-2 text-left">
        Paul is a famous French bakery and café, offering an array of freshly baked bread, pastries, and savory delights. Their dedication to quality ingredients and classic recipes has made them a staple in Tunisia's food scene.
      </p>
    </div>
    <div className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition duration-300">
      <img src="/TheGate.jpg" alt="The Gate" className="w-full h-55 object-cover rounded-t-lg" />
      <h3 className="text-xl font-semibold text-[#FA8072] mt-4">The Gate</h3>
      <p className="text-black mt-2 text-left">
        The Gate is a renowned restaurant in Tunisia, known for its elegant atmosphere and exquisite Middle Eastern-inspired dishes. Their fusion of traditional and contemporary flavors creates a truly unique dining experience.
      </p>
    </div>

    <div className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition duration-300">
      <img src="/The716.jpg" alt="The 716" className="w-full h-55 object-cover rounded-t-lg" />
      <h3 className="text-xl font-semibold text-[#FA8072] mt-4">The 716</h3>
      <p className="text-black mt-2 text-left">
        The 716 is an upscale dining experience in Tunisia, offering contemporary dishes with a focus on fresh, local ingredients. Their innovative menu and chic ambiance provide a refined dining experience that blends modern flair with Tunisian tradition.
      </p>
    </div>
  </div>
</section>

            </div>
          </BlurContainer>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
