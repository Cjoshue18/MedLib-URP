import React from 'react';
import headerLogo from '../../assets/logo-header.webp';

interface HeaderBrandBadgeProps {
  onNavigate?: (view: 'home') => void;
  className?: string;
  isLightBackground?: boolean;
}

export const HeaderBrandBadge: React.FC<HeaderBrandBadgeProps> = ({
  onNavigate,
  className = '',
  isLightBackground = false,
}) => {
  return (
    <button
      type="button"
      onClick={() => onNavigate?.('home')}
      className={`group relative inline-flex items-center h-full text-left focus:outline-none cursor-pointer select-none transition-all ${className}`}
      title="Biblioteca Virtual y Especializada de Medicina Humana - Ir al inicio"
      aria-label="Biblioteca Virtual y Especializada de Medicina Humana - Ir al inicio"
    >
      <div className="flex items-center gap-3.5 sm:gap-4 md:gap-4.5">
        <img
          src={headerLogo}
          alt="Escudo Oficial Universidad Ricardo Palma"
          className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 object-contain rounded-full shadow-sm group-hover:scale-105 group-hover:ring-2 group-hover:ring-[#008744]/40 transition-all duration-300 shrink-0"
        />
        <div className="flex flex-col justify-center leading-none select-none">
          <span
            className={`font-display text-xs sm:text-[14px] md:text-[16px] font-bold tracking-tight leading-tight transition-colors drop-shadow-sm ${
              isLightBackground
                ? 'text-slate-900 group-hover:text-[#008744]'
                : 'text-white group-hover:text-[#8cf9a9]'
            }`}
          >
            Biblioteca Virtual y Especializada de
          </span>
          <span className="font-display text-sm sm:text-base md:text-[20px] font-black tracking-tight leading-tight animate-camera-pan-text drop-shadow-sm">
            Medicina Humana
          </span>
        </div>
      </div>
    </button>
  );
};
