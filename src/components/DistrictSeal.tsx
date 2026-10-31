import React from 'react';

interface DistrictSealProps {
  className?: string;
  size?: number;
}

export const DistrictSeal: React.FC<DistrictSealProps> = ({ className = '', size = 138 }) => {
  return (
    <div 
      className={`relative shrink-0 flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      {/* Pure solid white backing circle layer directly behind the circular logo (no shadow line, no outer rings) */}
      <div 
        className="absolute inset-1 rounded-full bg-white pointer-events-none"
      />

      {/* High-Resolution Logo on top of white layer */}
      <img
        src="/assets/aistudio/toboso_district_logo_clean.png"
        alt="District of Toboso Official Seal"
        className="relative z-10 w-full h-full object-contain pointer-events-none p-1"
        loading="eager"
        decoding="sync"
      />
    </div>
  );
};
