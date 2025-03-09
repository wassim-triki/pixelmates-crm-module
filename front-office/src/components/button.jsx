import React from "react";

const Button = ({ children, className, ...props }) => {
  return (
    <button
      className={`bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-2xl transition-all ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
