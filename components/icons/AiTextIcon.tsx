import React from 'react';

const AiTextIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
  >
    <text
      x="50%"
      y="50%"
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize="16"
      fontWeight="bold"
      fill="white"
      fontFamily="sans-serif"
    >
      AI
    </text>
  </svg>
);

export default AiTextIcon;
