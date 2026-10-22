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
      className={`group relative inline-flex items-center h-[calc(100%+1px)] -mb-[1px] text-left focus:outline-none cursor-pointer select-none transition-all ${className}`}
      title="Biblioteca Virtual de Medicina Humana - Ir al inicio"
      aria-label="Biblioteca Virtual de Medicina Humana - Ir al inicio"
    >
      <div className="relative h-full flex items-center filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.08)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.05)] group-hover:drop-shadow-[0_8px_18px_rgba(0,0,0,0.13)] transition-all duration-300">
        <div
          className="bg-black h-full pl-5 sm:pl-7 md:pl-8 pr-12 sm:pr-14 md:pr-16 flex items-center gap-3.5 sm:gap-4 md:gap-4.5 transition-colors"
          style={{
            clipPath: 'polygon(0 0, 100% 0, calc(100% - 32px) 100%, 0 100%)',
          }}
        >
          <img
            src={headerLogo}
            alt="Escudo Oficial Universidad Ricardo Palma"
            className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain rounded-full shadow-sm group-hover:scale-105 group-hover:ring-2 group-hover:ring-[#008744]/40 transition-all duration-300 shrink-0"
          />
          <div className="flex flex-col justify-center leading-none select-none">
            <span className="font-display text-xs sm:text-[14px] md:text-base font-bold text-white tracking-tight leading-tight group-hover:text-slate-100 transition-colors">
              Biblioteca Virtual de
            </span>
            <span className="font-display text-sm sm:text-base md:text-[19px] font-black tracking-tight leading-tight animate-camera-pan-text">
              Medicina Humana
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};
