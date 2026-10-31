import React from 'react';

interface PhilIriSealProps {
  className?: string;
  size?: number;
}

export const PhilIriSeal: React.FC<PhilIriSealProps> = ({ className = '', size = 48 }) => {
  return (
    <div
      className={`relative shrink-0 flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Circular Laurel / Ring */}
        <circle cx="60" cy="60" r="56" fill="#061325" stroke="#10b981" strokeWidth="2.5" />
        <circle cx="60" cy="60" r="50" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3 2" />

        {/* Radiating Sunburst / Knowledge Rays */}
        <path d="M60 16 L60 22" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        <path d="M60 98 L60 104" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 60 L22 60" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        <path d="M98 60 L104 60" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        <path d="M29 29 L34 34" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        <path d="M86 86 L91 91" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        <path d="M91 29 L86 34" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        <path d="M29 91 L34 86" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />

        {/* DepEd Inner Shield / Seal Gradient */}
        <circle cx="60" cy="60" r="42" fill="url(#philIriGrad)" />

        <defs>
          <linearGradient id="philIriGrad" x1="60" y1="18" x2="60" y2="102" gradientUnits="userSpaceOnUse">
            <stop stopColor="#065f46" />
            <stop offset="0.6" stopColor="#047857" />
            <stop offset="1" stopColor="#064e3b" />
          </linearGradient>
        </defs>

        {/* Open Book Representation */}
        <path
          d="M60 48 C 50 43, 36 43, 26 47 L 26 77 C 36 73, 50 73, 60 78 C 70 73, 84 73, 94 77 L 94 47 C 84 43, 70 43, 60 48 Z"
          fill="#ffffff"
          stroke="#064e3b"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Book Spine Center Divider */}
        <line x1="60" y1="48" x2="60" y2="78" stroke="#10b981" strokeWidth="1.8" />

        {/* Left Page Text Lines */}
        <line x1="32" y1="53" x2="54" y2="52" stroke="#059669" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="32" y1="59" x2="54" y2="58" stroke="#059669" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="32" y1="65" x2="54" y2="64" stroke="#059669" strokeWidth="1.2" strokeLinecap="round" />

        {/* Right Page Text Lines */}
        <line x1="66" y1="52" x2="88" y2="53" stroke="#059669" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="66" y1="58" x2="88" y2="59" stroke="#059669" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="66" y1="64" x2="88" y2="65" stroke="#059669" strokeWidth="1.2" strokeLinecap="round" />

        {/* Reading Literacy Ribbon / Bookmark */}
        <path
          d="M60 46 L60 35 L64 32 L68 35 L68 46"
          fill="#f59e0b"
          stroke="#d97706"
          strokeWidth="1"
        />

        {/* Golden Assessment Checkmark Crest */}
        <circle cx="60" cy="88" r="9" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.2" />
        <path
          d="M56 88 L59 91 L65 85"
          stroke="#064e3b"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
