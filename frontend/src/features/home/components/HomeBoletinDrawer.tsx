import React, { useEffect } from 'react';
import { X, Mail, ChevronRight } from 'lucide-react';
import { BoletinSubscriptionCard } from './BoletinSubscriptionCard';

interface BoletinPillProps {
  onOpen: () => void;
  orientation?: 'horizontal' | 'vertical';
}

export const BoletinPill: React.FC<BoletinPillProps> = ({ onOpen, orientation = 'horizontal' }) => {
  if (orientation === 'vertical') {
    return (
      <button
        type="button"
        onClick={onOpen}
        className="group relative w-12 sm:w-14 h-64 sm:h-72 mt-4 lg:mt-6 rounded-full bg-[#008744] hover:bg-[#006b35] text-white shadow-urp-brutal-green tactile-btn-green flex flex-col items-center justify-between py-6 px-1.5 transition-all duration-300 cursor-pointer border-2 border-white/20 hover:scale-105 active:scale-95"
        title="Abrir formulario de boletín y novedades"
        aria-label="Abrir formulario de boletín y novedades"
      >
        <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
          <Mail className="w-4 h-4 text-white" />
        </div>

        <span className="[writing-mode:vertical-rl] rotate-180 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-white whitespace-nowrap select-none my-auto">
          BOLETÍN &amp; NOVEDADES
        </span>

        <ChevronRight className="w-4 h-4 text-[#8cf9a9] rotate-90 shrink-0 group-hover:translate-y-0.5 transition-transform" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#008744] hover:bg-[#006b35] text-white shadow-urp-brutal-green tactile-btn-green border-2 border-white/20 text-xs font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
      title="Abrir formulario de boletín y novedades"
      aria-label="Abrir formulario de boletín y novedades"
    >
      <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
        <Mail className="w-3.5 h-3.5 text-white" />
      </div>

      <span className="select-none">
        BOLETÍN &amp; NOVEDADES
      </span>

      <ChevronRight className="w-4 h-4 text-[#8cf9a9] shrink-0 group-hover:translate-x-0.5 transition-transform" />
    </button>
  );
};

interface HomeBoletinDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToDirectory: () => void;
}

export const HomeBoletinDrawer: React.FC<HomeBoletinDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateToDirectory,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="hidden lg:block relative w-full max-w-sm animate-in fade-in zoom-in-95 duration-300">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 -left-12 z-20 w-9 h-9 rounded-full bg-slate-600/50 hover:bg-slate-600/90 text-white backdrop-blur-xs border border-white/25 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg hover:scale-110 active:scale-95 group"
          title="Cerrar formulario"
          aria-label="Cerrar formulario"
        >
          <X className="w-4 h-4 text-white/90 group-hover:text-white group-hover:rotate-90 transition-transform duration-200" />
        </button>
        <BoletinSubscriptionCard
          variant="home"
          onNavigateToDirectory={onNavigateToDirectory}
        />
      </div>

      <div className="lg:hidden fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
        <div className="relative w-full max-w-sm z-10 animate-in fade-in zoom-in-95 duration-200">
          <BoletinSubscriptionCard
            variant="home"
            onNavigateToDirectory={onNavigateToDirectory}
          />
        </div>
      </div>
    </>
  );
};
