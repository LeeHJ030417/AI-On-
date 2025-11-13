import React from 'react';

const MouseIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18.5 3A3.5 3.5 0 0 0 15 6.5V10H9V6.5A3.5 3.5 0 0 0 5.5 3"/>
    <path d="M16 10.5c0 2.5-2 4.5-4 4.5s-4-2-4-4.5"/>
    <path d="M12 3v2"/>
    <path d="M12 15a4 4 0 0 0 4 4h.5a3.5 3.5 0 0 0 0-7H16"/>
  </svg>
);

export default MouseIcon;
