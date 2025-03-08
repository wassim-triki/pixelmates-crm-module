import React from "react";

const Footer = () => {
  let year = new Date().getFullYear();
  return (
    <div className="footer">
      <div className="copyright">
        <p>
        © 2025 The MenuFy. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
