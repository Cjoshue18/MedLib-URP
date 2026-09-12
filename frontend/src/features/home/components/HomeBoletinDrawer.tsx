import React, { useState, useEffect } from 'react';
import { Send, ShieldCheck, ArrowRight, X, Mail, ChevronRight } from 'lucide-react';

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
  const [admissionsTab, setAdmissionsTab] = useState<'pregrado' | 'posgrado' | 'residentado'>('pregrado');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  const boletinContent = (
    <div className="bg-white rounded-3xl border-2 border-slate-800 shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-[#00572B] via-[#008744] to-[#00A859] p-5 text-white flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#8cf9a9] block mb-0.5">
            FACULTAD DE MEDICINA HUMANA
          </span>
          <h2 className="text-lg sm:text-xl font-display font-black leading-tight">
            ¡ACCESO DIRECTO <br />AL CONOCIMIENTO!
          </h2>
        </div>
        <div className="text-right flex flex-col items-center bg-black/20 backdrop-blur-xs px-2.5 py-1.5 rounded-xl border border-white/20 shrink-0">
          <span className="text-2xl font-black leading-none text-white">57</span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#8cf9a9]">Años URP</span>
        </div>
      </div>

      <div className="p-5 text-slate-900 space-y-4">
        <div>
          <span className="text-xs font-bold text-slate-700 block mb-1.5">
            Selecciona tu nivel académico:
          </span>
          <div className="flex items-center justify-between gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setAdmissionsTab('pregrado')}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                admissionsTab === 'pregrado'
                  ? 'bg-[#008744] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pregrado
            </button>
            <button
              type="button"
              onClick={() => setAdmissionsTab('posgrado')}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                admissionsTab === 'posgrado'
                  ? 'bg-[#008744] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Posgrado
            </button>
            <button
              type="button"
              onClick={() => setAdmissionsTab('residentado')}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                admissionsTab === 'residentado'
                  ? 'bg-[#008744] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Residentado
            </button>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-3 pt-0.5">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Recibe alertas bibliográficas y novedades:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu.correo@urp.edu.pe"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#008744]"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-[#008744] hover:bg-[#006b35] text-white font-bold text-xs sm:text-sm shadow-urp-brutal-green tactile-btn-green transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{subscribed ? `¡Registrado como ${admissionsTab.toUpperCase()}!` : 'Registrarme al Boletín'}</span>
          </button>
        </form>

        <div className="text-xs pt-0.5">
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-[#008744] shrink-0 mt-0.5" />
            <span className="text-slate-600 leading-snug">
              Acceso con cuenta institucional a literatura científica y soporte clínico.
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigateToDirectory();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Explorar Catálogo de Bases de Datos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-[10px] text-center text-slate-400">
          (*) Servicios médicos exclusivos para la comunidad médica URP
        </p>
      </div>
    </div>
  );

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
        {boletinContent}
      </div>

      <div className="lg:hidden fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
        <div className="relative w-full max-w-sm z-10 animate-in fade-in zoom-in-95 duration-200">
          {boletinContent}
        </div>
      </div>
    </>
  );
};
