
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = "" }) => {
  const sizeClasses = {
    sm: { icon: 'w-6 h-6', text: 'text-base', gap: 'gap-2' },
    md: { icon: 'w-8 h-8', text: 'text-xl', gap: 'gap-3' },
    lg: { icon: 'w-12 h-12', text: 'text-3xl', gap: 'gap-4' },
    xl: { icon: 'w-16 h-16', text: 'text-4xl', gap: 'gap-5' },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex items-center ${currentSize.gap} ${className}`}>
      {/* Professional Tech Icon: Hexagonal Circuit Stylized S */}
      <div className={`${currentSize.icon} relative shrink-0 group`}>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg rotate-3 group-hover:rotate-6 transition-transform duration-300 shadow-lg shadow-indigo-500/20"></div>
        <div className="absolute inset-0 bg-[#020617] rounded-lg flex items-center justify-center border border-indigo-500/30">
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            className="w-3/4 h-3/4 text-indigo-500"
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-indigo-500/20 blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      {showText && (
        <div className={`brand-font font-bold tracking-tight text-white ${currentSize.text} leading-none`}>
          <span className="font-semibold text-slate-300">Seuramoe</span>
          <span className="font-extrabold text-indigo-500">Tech</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
