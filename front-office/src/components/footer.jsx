import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="absolute bottom-0 w-full text-white backdrop-transparent text-center pt-5">
      <p className="text-sm">© {currentYear} TheMenuFy. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
