import React from 'react';

const ShieldHeatmapLogo = ({ width = 36, height = 36 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={width}
      height={height}
    >
      {/* Shield */}
      <path
        d="M32 2L6 10v18c0 14.9 10.6 28.5 26 34 15.4-5.5 26-19.1 26-34V10L32 2z"
        fill="#2563eb"
      />
      {/* Heatmap dots */}
      <circle cx="28" cy="30" r="2" fill="#f97316" />
      <circle cx="32" cy="28" r="2" fill="#facc15" />
      <circle cx="36" cy="32" r="2" fill="#ff0000ff" />
      <circle cx="32" cy="36" r="2" fill="#3b82f6" />
    </svg>
  );
};

export default ShieldHeatmapLogo;
