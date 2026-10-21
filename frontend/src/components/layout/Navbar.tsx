import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import headerLogo from '../../assets/logo-header.webp';

interface NavbarProps {
  currentView: 'home' | 'directory' | 'conferences' | 'lost-found';
  onNavigate: (view: 'home' | 'directory' | 'conferences' | 'lost-found') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50 w-full transition-colors duration-200">
      <div className="flex justify-between items-center w-full pl-6 md:pl-8 pr-4 md:pr-0 h-20">
        <button
          onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
          className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
          title="Ir al inicio de MedLib-URP"
          aria-label="Ir al inicio de MedLib-URP"
        >
          <img
            src={headerLogo}
            alt="Logo Universidad Ricardo Palma"
            className="w-11 h-11 object-contain rounded-full shadow-md group-hover:scale-110 group-hover:ring-2 group-hover:ring-[#008744] transition-all"
          />
          <span className="font-headline-md text-headline-md font-bold text-slate-900 tracking-tight group-hover:text-[#008744] transition-colors">
            MedLib-URP
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => onNavigate('directory')}
            className={`font-label-md text-label-md transition-colors duration-200 cursor-pointer ${
              currentView === 'directory'
                ? 'text-[#008744] border-b-2 border-[#008744] pb-1 font-semibold'
                : 'text-slate-600 hover:text-[#008744]'
            }`}
          >
            Bases de Datos
          </button>
          <button
            onClick={() => onNavigate('conferences')}
            className={`font-label-md text-label-md transition-colors duration-200 cursor-pointer ${
              currentView === 'conferences'
                ? 'text-[#008744] border-b-2 border-[#008744] pb-1 font-semibold'
                : 'text-slate-600 hover:text-[#008744]'
            }`}
          >
            Conferencias
          </button>
          <button
            onClick={() => onNavigate('lost-found')}
            className={`font-label-md text-label-md transition-colors duration-200 cursor-pointer ${
              currentView === 'lost-found'
                ? 'text-[#008744] border-b-2 border-[#008744] pb-1 font-semibold'
                : 'text-slate-600 hover:text-[#008744]'
            }`}
          >
            Objetos Perdidos
          </button>
          <a
            href="https://biblioteca.urp.edu.pe/abnopac/"
            target="_blank"
            rel="noreferrer"
            className="text-slate-600 hover:text-[#008744] font-label-md text-label-md transition-colors duration-200 inline-flex items-center gap-1.5"
          >
            <span>Catálogo de Libros</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </nav>

        <div className="flex items-center gap-4 h-full">
          <a
            href="https://test.urp.edu.pe/Intranet/"
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex items-center justify-center bg-[#008744] hover:bg-[#006b35] text-white px-5 py-2.5 my-auto mr-4 md:mr-6 rounded-lg font-label-md text-label-md transition-all shadow-urp-brutal-green font-semibold tracking-wide cursor-pointer"
          >
            INTRANET URP
          </a>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-700 hover:text-[#008744] hover:bg-slate-100 flex items-center justify-center w-10 h-10 rounded-lg cursor-pointer"
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-6 py-4 space-y-3">
          <button
            onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 font-label-md text-slate-800 hover:text-[#008744]"
          >
            Inicio
          </button>
          <button
            onClick={() => { onNavigate('directory'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 font-label-md text-slate-800 hover:text-[#008744]"
          >
            Bases de Datos
          </button>
          <button
            onClick={() => { onNavigate('conferences'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 font-label-md text-slate-800 hover:text-[#008744]"
          >
            Conferencias
          </button>
          <button
            onClick={() => { onNavigate('lost-found'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 font-label-md text-slate-800 hover:text-[#008744]"
          >
            Objetos Perdidos
          </button>
          <a
            href="https://biblioteca.urp.edu.pe/abnopac/"
            target="_blank"
            rel="noreferrer"
            className="block w-full text-left py-2 font-label-md text-slate-800 hover:text-[#008744] inline-flex items-center gap-1.5"
          >
            <span>Catálogo de Libros</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
          <div className="pt-2 border-t border-slate-200">
            <a
              href="https://test.urp.edu.pe/Intranet/"
              target="_blank"
              rel="noreferrer"
              className="flex justify-center bg-[#008744] hover:bg-[#006b35] text-white px-6 py-2.5 rounded-lg font-label-md text-center transition-colors font-semibold shadow-urp-brutal-green"
            >
              INTRANET URP
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
