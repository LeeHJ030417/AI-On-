import React from 'react';

const NetworkIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.59,13.51l6.83,3.98" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.41,6.51l-6.82,3.98" />
  </svg>
);

export default NetworkIcon;