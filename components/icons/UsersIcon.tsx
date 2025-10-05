import React from 'react';

const UsersIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-2.253 9.527 9.527 0 00-1.246-3.239 9.335 9.335 0 00-2.252-2.252 9.38 9.38 0 00-2.625-.372m-2.252 7.5c-.416.023-.83.038-1.246.038s-.83-.015-1.246-.038m2.492-3.857A4.5 4.5 0 0011.25 11.25a4.5 4.5 0 00-4.5 4.5v3.857m0 0a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-2.253 9.527 9.527 0 00-1.246-3.239 9.335 9.335 0 00-2.252-2.252 9.38 9.38 0 00-2.625-.372" />
  </svg>
);

export default UsersIcon;