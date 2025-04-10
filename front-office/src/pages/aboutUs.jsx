import React from 'react';

const AboutUs = () => {
  return (
    <div className="relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-fixed bg-center -z-10"
        style={{
          backgroundImage: "url('/Backg_Login.png')",
        }}
      />

      {/* Content Container */}
      <div className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-screen-xl mx-auto rounded-2xl p-8 backdrop-blur-md">

          {/* Header Section */}
          <section className="text-center mb-10 mt-14"> 
          <h1 className="text-5xl text-[#fa8072] font-bold">About Us</h1>
            <p className="text-lg text-white mt-3">
              Welcome to TheMenuFy, your go-to food destination.
            </p>
          </section>

          {/* Why Choose Us */}
{/* Why Choose Us */}
<section className="mb-10 text-white">
  <h2 className="text-4xl text-[#fa8072] font-semibold text-center mb-8">Why Choose Us?</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {[
      {
        title: "Seamless Experience",
        description:
          "Enjoy a smooth, intuitive interface that makes ordering your favorite meals fast and easy.",
      },
      {
        title: "Curated Local Eats",
        description:
          "Connect with the best local restaurants, offering a variety of dishes to suit every craving.",
      },
      {
        title: "Fast & Reliable Delivery",
        description:
          "Count on our efficient delivery network to bring your meals hot and fresh, right to your door.",
      },
    ].map((reason, idx) => (
      <div
        key={idx}
        className="bg-white/10 p-8 rounded-xl shadow-lg hover:-translate-y-2 hover:shadow-2xl transition text-center"
      >
        <h3 className="text-xl text-[#fa8072] font-semibold mb-4">{reason.title}</h3>
        <p className="text-lg leading-relaxed">{reason.description}</p>
      </div>
    ))}
  </div>
</section>


          {/* Our Features */}
          <section className="mb-10 text-white">
            <h2 className="text-4xl text-[#fa8072] font-semibold text-center mb-8">Our Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
              {[
                {
                  title: "Smart Reservation Management",
                  items: [
                    "Real-time sync between online & in-person bookings",
                    "AI-powered table allocation",
                    "Automated waitlists",
                  ],
                },
                {
                  title: "Intelligent Complaint Handling",
                  items: [
                    "Centralized dashboard",
                    "Automated priority system",
                    "AI chatbot & feedback loop",
                  ],
                },
                {
                  title: "Advanced Customer Loyalty Program",
                  items: [
                    "Personalized rewards",
                    "AI-driven loyalty system",
                    "Data insights to enhance engagement",
                  ],
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 p-8 rounded-xl shadow-lg hover:-translate-y-2 hover:shadow-2xl transition"
                >
        <h3 className="text-xl text-[#fa8072] font-semibold mb-4 text-center">{feature.title}</h3>
        <ul className="list-disc list-inside space-y-1">
                    {feature.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Vision & Values */}
          <section className="flex flex-col md:flex-row justify-between gap-8 mb-10 text-white">
            <div className="flex-1 bg-white/10 p-8 rounded-xl shadow-lg hover:-translate-y-2 hover:shadow-2xl transition text-center">
              <h2 className="text-3xl text-[#fa8072] font-semibold mb-4">Our Vision</h2>
              <p className="text-lg leading-relaxed">
                Our vision is straightforward: to provide customers with a memorable culinary experience by
                combining creativity, freshness, and authenticity.
              </p>
            </div>
            <div className="flex-1 bg-white/10 p-8 rounded-xl shadow-lg hover:-translate-y-2 hover:shadow-2xl transition text-center">
              <h2 className="text-3xl text-[#fa8072] font-semibold mb-4">Our Values</h2>
              <p className="text-lg leading-relaxed">
                We are guided by a set of values that define our approach to cuisine and customer service.
                Quality, authenticity, and customer satisfaction are at the core of everything we do.
              </p>
            </div>
          </section>

          {/* Partners */}
          <section className="text-center text-white">
            <h2 className="text-4xl text-[#fa8072] font-semibold mb-4">Our Partners</h2>
            <p className="text-lg mb-10">
              Our partners are at the heart of our success. Together, we offer a unique culinary diversity.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Paul",
                  img: "/Paul.png",
                  description: "Famous French bakery offering freshly baked goods and savory delights.",
                },
                {
                  name: "The Gate",
                  img: "/TheGate.jpg",
                  description: "Elegant restaurant known for Middle Eastern-inspired dishes.",
                },
                {
                  name: "The 716",
                  img: "/The716.jpg",
                  description: "Upscale dining with a focus on local ingredients and contemporary dishes.",
                },
              ].map((partner, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 p-6 rounded-xl shadow-lg hover:-translate-y-2 hover:shadow-2xl transition"
                >
                  <img
                    src={partner.img}
                    alt={partner.name}
                    className="w-full h-52 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl text-[#fa8072] font-semibold mb-2">{partner.name}</h3>
                  <p>{partner.description}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default AboutUs;
