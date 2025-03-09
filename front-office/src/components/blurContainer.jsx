import React from "react";

const BlurContainer = ({
  children,
  className = "",
  blur = "3xl", // sm, md, lg, xl, 2xl, 3xl
  opacity = 70, // 0-100
  padding = 6, // tailwind padding scale
  rounded = "lg", // none, sm, md, lg, xl, 2xl, 3xl
}) => {
  // Mapping for blur values to Tailwind classes
  const blurMap = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl",
    "2xl": "backdrop-blur-2xl",
    "3xl": "backdrop-blur-3xl",
  };

  // Mapping for rounded values to Tailwind classes
  const roundedMap = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
  };

  return (
    <div
      className={`
          bg-white/[.${opacity}]
          ${blurMap[blur]}
          ${roundedMap[rounded]}
          p-${padding}
          border
          border-white/20
          shadow-lg
          ${className}
        `}
    >
      {children}
    </div>
  );
};

export default BlurContainer;
