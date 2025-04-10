import React from 'react';
import { motion } from 'framer-motion'; // Added for motion.div

// Placeholder for BlurContainer (replace with your actual implementation)
const BlurContainer = ({ blur, opacity, padding, rounded, className, children }) => (
  <div
    className={`${className} backdrop-blur-${blur} bg-opacity-${opacity} p-${padding} rounded-${rounded}`}
  >
    {children}
  </div>
);

const AboutUs = () => {
  return (
    <div className="relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-fixed bg-center -z-10"
        style={{ backgroundImage: "url('/Backg_Login.png')" }}
      />

      {/* Main Content */}
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
                <h1 className="text-3xl md:text-5xl font-bold text-white">About Us</h1>
                <p className="text-lg md:text-xl mt-4 text-white">
                  Welcome to TheMenuFy, your go-to food destination.
                </p>
              </div>

              {/* Content Container */}
              <div className="px-4 sm:px-6 lg:px-8 py-10">
                <div className="max-w-screen-xl mx-auto rounded-2xl p-8 backdrop-blur-md">
                  {/* Our Features Section */}
                  <section className="text-center mb-16">
                    <h2 className="text-3xl font-semibold text-[#FA8072] mb-6">Our Features</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      <motion.div
                        className="bg-white/10 backdrop-blur-lg p-6 rounded-lg border border-white/20"
                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.2)' }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className="text-xl font-semibold text-[#FA8072] mb-4">
                          Smart Reservation Management
                        </h3>
                        <ul className="list-disc text-left text-white/90 pl-5">
                          <li>Real-time sync between online & in-person bookings</li>
                          <li>AI-powered table allocation for seamless seating</li>
                          <li>Automated waitlists with instant notifications</li>
                        </ul>
                      </motion.div>

                      <motion.div
                        className="bg-white/10 backdrop-blur-lg p-6 rounded-lg border border-white/20"
                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.2)' }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className="text-xl font-semibold text-[#FA8072] mb-4">
                          Intelligent Complaint Handling
                        </h3>
                        <ul className="list-disc text-left text-white/90 pl-5">
                          <li>Centralized dashboard for quick issue resolution</li>
                          <li>Automated priority system for faster responses</li>
                          <li>AI chatbot & instant feedback loop to build trust</li>
                        </ul>
                      </motion.div>

                      <motion.div
                        className="bg-white/10 backdrop-blur-lg p-6 rounded-lg border border-white/20"
                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.2)' }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className="text-xl font-semibold text-[#FA8072] mb-4">
                          Advanced Customer Loyalty Program
                        </h3>
                        <ul className="list-disc text-left text-white/90 pl-5">
                          <li>Personalized rewards & promotions</li>
                          <li>AI-driven loyalty points based on behavior</li>
                          <li>Data insights to enhance customer engagement</li>
                        </ul>
                      </motion.div>
                    </div>
                  </section>

                  {/* Vision & Values Section */}
                  <section className="flex flex-col md:flex-row justify-between gap-8 mb-16 text-white">
                    <motion.div
                      className="flex-1 bg-white/10 p-8 rounded-xl shadow-lg border border-white/20"
                      whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.2)' }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-3xl font-semibold text-[#FA8072] mb-6 text-center">
                        Our Vision
                      </h2>
                      <p className="text-lg leading-relaxed text-left">
                        At TheMenuFy, our vision is to provide customers with a memorable culinary
                        experience by combining creativity, freshness, and authenticity.
                      </p>
                    </motion.div>

                    <motion.div
                      className="flex-1 bg-white/10 p-8 rounded-xl shadow-lg border border-white/20"
                      whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.2)' }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-3xl font-semibold text-[#FA8072] mb-6 text-center">
                        Our Values
                      </h2>
                      <p className="text-lg leading-relaxed text-left">
                        We are guided by values that define our approach to cuisine and service:
                        quality, authenticity, and customer satisfaction are at our core.
                      </p>
                    </motion.div>
                  </section>

                  {/* Our Partners Section */}
                  <section className="text-center mb-16">
                    <h2 className="text-3xl font-semibold text-[#FA8072] mb-6">Our Partners</h2>
                    <p className="text-lg text-white mb-6 text-left">
                      Our partners are central to our success. TheMenuFy collaborates with local
                      restaurants and cafes known for their quality and passion, offering a unique
                      culinary diversity tailored to all tastes.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {[
                        {
                          name: 'Paul',
                          img: '/Paul.png',
                          description:
                            'A famous French bakery offering freshly baked bread, pastries, and savory delights with a focus on quality ingredients.',
                        },
                        {
                          name: 'The Gate',
                          img: '/TheGate.jpg',
                          description:
                            'A renowned restaurant known for its elegant atmosphere and Middle Eastern-inspired dishes with a modern twist.',
                        },
                        {
                          name: 'The 716',
                          img: '/The716.jpg',
                          description:
                            'An upscale dining experience with contemporary dishes made from fresh, local ingredients and a chic ambiance.',
                        },
                      ].map((partner, idx) => (
                        <motion.div
                          key={idx}
                          className="bg-white/10 backdrop-blur-lg p-6 rounded-lg border border-white/20"
                          whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.2)' }}
                          transition={{ duration: 0.3 }}
                        >
                          <img
                            src={partner.img}
                            alt={partner.name}
                            className="w-full h-52 object-cover rounded-t-lg mb-4"
                          />
                          <h3 className="text-xl font-semibold text-[#FA8072] mb-2">
                            {partner.name}
                          </h3>
                          <p className="text-white/90 text-left">{partner.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </BlurContainer>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;