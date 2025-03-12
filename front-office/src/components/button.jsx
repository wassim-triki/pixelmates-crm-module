import React from "react";

const Button = ({ children, className, ...props }) => {
  return (
    <button
      className={`bg-[#FA8072] hover:bg-black text-white font-semibold py-2 px-4 rounded-2xl transition-all ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
