import React from 'react';
import headerLogo from '../../assets/logo-header.webp';

interface HeaderBrandBadgeProps {
  onNavigate?: (view: 'home') => void;
  className?: string;
}

export const HeaderBrandBadge: React.FC<HeaderBrandBadgeProps> = ({
  onNavigate,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={() => onNavigate?.('home')}
      className={`group relative inline-flex items-center h-full text-left focus:outline-none cursor-pointer select-none transition-all ${className}`}
      title="Biblioteca Virtual de Medicina Humana - Ir al inicio"
      aria-label="Biblioteca Virtual de Medicina Humana - Ir al inicio"
    >
      <div className="flex items-center gap-3.5 sm:gap-4 md:gap-4.5">
        <img
          src={headerLogo}
          alt="Escudo Oficial Universidad Ricardo Palma"
          className="w-11 h-11 sm:w-12 sm:h-12 md:w-13 md:h-13 object-contain rounded-full shadow-sm group-hover:scale-105 group-hover:ring-2 group-hover:ring-[#008744]/40 transition-all duration-300 shrink-0"
        />
        <div className="flex flex-col justify-center leading-none select-none">
          <span className="font-display text-xs sm:text-[14px] md:text-base font-bold text-slate-900 tracking-tight leading-tight group-hover:text-[#008744] transition-colors">
            Biblioteca Virtual de
          </span>
          <span className="font-display text-sm sm:text-base md:text-[19px] font-black tracking-tight leading-tight animate-camera-pan-text">
            Medicina Humana
          </span>
        </div>
      </div>
    </button>
  );
};
