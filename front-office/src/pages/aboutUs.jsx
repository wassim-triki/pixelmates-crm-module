import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const BlurContainer = ({ children, className }) => (
  <motion.div
    className={`${className} backdrop-blur-xl bg-black/30 border border-white/10`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    {children}
  </motion.div>
);

const AboutUs = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const featureVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6 }
    })
  };

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="fixed inset-0 bg-cover bg-center -z-10"
        style={{ 
          backgroundImage: "url('/Backg_Login.png')",
          scale,
          filter: 'brightness(0.8) contrast(1.2)'
        }}
      />

      {/* Main Content */}
      <div className="min-h-screen flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-16">
        <div className="w-full max-w-7xl">
          <BlurContainer className="rounded-3xl p-8 shadow-2xl">
            {/* Hero Section */}
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#FA8072] to-orange-400 bg-clip-text text-transparent mb-6">
                Redefining Culinary Tech
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Welcome to TheMenuFy, your go-to food destination.
              </p>
            </motion.div>

            {/* Features Grid */}
            <motion.section 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-28"
              initial="hidden"
              animate="visible"
            >
              {[ 
                {
                  title: "Smart Reservations",
                  icon: "⏱️",
                  items: [
                    "Real-time sync & AI allocation",
                    "Automated waitlists",
                    "Dynamic table management"
                  ]
                },
                {
                  title: "Efficient Complaint",
                  icon: "💬",
                  items: [
                    "Centralized issue tracking",
                    "Smart priority routing",
                    "AI resolution & feedback loops"
                  ]
                },
                {
                  title: "Loyalty Engine",
                  icon: "💎",
                  items: [
                    "Behavior-based rewards",
                    "Personalized campaigns",
                    "360° customer insights"
                  ]
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  variants={featureVariants}
                  custom={i}
                  className="bg-gradient-to-br from-black/40 to-black/20 p-8 rounded-2xl border border-white/10 backdrop-blur-sm hover:border-[#FA8072]/50 transition-all"
                  whileHover={{ y: -10 }}
                >
                  <div className="flex flex-col items-center text-4xl mb-4 animate-float">
                    <span>{feature.icon}</span>
                    <h3 className="text-2xl font-semibold text-[#FA8072] mb-4 text-center">{feature.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {feature.items.map((item, j) => (
                      <li key={j} className="flex items-center text-white/90">
                        <span className="text-[#FA8072] mr-2">▹</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.section>

            {/* Vision & Values */}
            <motion.div 
              className="grid md:grid-cols-2 gap-8 mb-28"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="relative p-8 rounded-2xl bg-black/30 border border-white/10 hover:border-[#FA8072]/50 transition-all">
                <div className="absolute inset-0 bg-[url('/texture.png')] opacity-10 rounded-2xl" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FA8072] to-orange-400 bg-clip-text text-transparent mb-6">
                  Our Vision
                </h2>
                <p className="text-lg text-white/90 leading-relaxed">
                  Creating a world where every restaurant interaction is seamless, personalized, 
                  and memorable through intelligent automation and human-centric design.
                </p>
              </div>

              <div className="relative p-8 rounded-2xl bg-black/30 border border-white/10 hover:border-[#FA8072]/50 transition-all">
                <div className="absolute inset-0 bg-[url('/texture.png')] opacity-10 rounded-2xl" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FA8072] to-orange-400 bg-clip-text text-transparent mb-6">
                  Core Values
                </h2>
                <ul className="space-y-4">
                  {['Innovation First', 'Customer Obsession', 'Data Integrity', 'Sustainable Growth'].map((value, i) => (
                    <li key={i} className="flex items-center text-white/90">
                      <span className="w-8 h-8 bg-[#FA8072] rounded-full flex items-center justify-center mr-3">
                        {i+1}
                      </span>
                      {value}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Partners Section */}
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
          </BlurContainer>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="fixed top-20 left-4 w-24 h-24 bg-[#FA8072]/20 rounded-full blur-xl animate-float" />
      <div className="fixed bottom-20 right-8 w-16 h-16 bg-orange-400/20 rounded-full blur-xl animate-float-delayed" />
    </div>
  );
};

export default AboutUs;