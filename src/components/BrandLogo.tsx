import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = false,
  className = ''
}) => {
  const sizeMap = {
    sm: { box: 'w-7 h-7 rounded-lg', text: 'text-xs' },
    md: { box: 'w-9 h-9 rounded-xl', text: 'text-sm' },
    lg: { box: 'w-12 h-12 rounded-2xl', text: 'text-lg' },
    xl: { box: 'w-16 h-16 rounded-2xl', text: 'text-2xl' },
  };

  const current = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Logo oficial con esquinas redondeadas elegantes y anillo sutil */}
      <div className={`relative flex items-center justify-center ${current.box} bg-[#050811] shadow-md overflow-hidden shrink-0 ring-1 ring-white/10`}>
        <img
          src="/logo-rounded.png"
          alt="Media Studio Logo"
          className="w-full h-full object-contain select-none pointer-events-none"
          draggable={false}
        />
      </div>

      {showText && (
        <span className={`font-extrabold tracking-tight text-white font-inter ${current.text}`}>
          Media Studio
        </span>
      )}
    </div>
  );
};
