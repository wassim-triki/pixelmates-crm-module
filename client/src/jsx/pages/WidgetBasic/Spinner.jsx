import React from 'react';

const Spinner = ({ size = '24px', color = '#fff', width = '2' }) => {
  return (
    <svg
      fill="none"
      height={size}
      width={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-busy="true"
      className="custom-spinner"
    >
      <g className="custom-spinner-group">
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke={color} // Use the color prop
          strokeWidth={width}
          className="custom-spinner-circle"
        />
      </g>
      <style>
        {`
        .custom-spinner-group {
          animation: custom-rotate 2s linear infinite;
          transform-origin: center center;
        }
        .custom-spinner-circle {
          stroke-dasharray: 75, 100;
          stroke-dashoffset: -5;
          animation: custom-dash 1.5s ease-in-out infinite;
          stroke-linecap: round;
        }
        @keyframes custom-rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes custom-dash {
          0% {
            stroke-dasharray: 1, 100;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 44.5, 100;
            stroke-dashoffset: -17.5;
          }
          100% {
            stroke-dasharray: 44.5, 100;
            stroke-dashoffset: -62;
          }
        }
      `}
      </style>
    </svg>
  );
};

export default Spinner;
