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
    <header className="bg-[#111827] shadow-md sticky top-0 z-50 w-full">
      <div className="flex justify-between items-center w-full px-6 max-w-[1280px] mx-auto h-20">
        <div className="flex items-center gap-3">
          <a
            href="https://www.urp.edu.pe/"
            target="_blank"
            rel="noreferrer"
            title="Ir al Portal Oficial de la Universidad Ricardo Palma (urp.edu.pe)"
            aria-label="Portal Oficial URP"
            className="flex items-center focus:outline-none group cursor-pointer"
          >
            <img
              src={headerLogo}
              alt="Logo Universidad Ricardo Palma"
              className="w-11 h-11 object-contain rounded-full shadow-md group-hover:scale-110 group-hover:ring-2 group-hover:ring-[#008744] transition-all"
            />
          </a>
          <button
            onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
            className="flex items-center text-left focus:outline-none group cursor-pointer"
            title="Ir al inicio de MedLib-URP"
          >
            <span className="font-headline-md text-headline-md font-bold text-white tracking-tight group-hover:text-[#8cf9a9] transition-colors">
              MedLib-URP
            </span>
          </button>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => onNavigate('directory')}
            className={`font-label-md text-label-md transition-colors duration-200 cursor-pointer ${currentView === 'directory'
                ? 'text-primary border-b-2 border-primary pb-1 font-semibold'
                : 'text-white/80 hover:text-white hover:text-primary'
              }`}
          >
            Directorio Biomédico
          </button>
          <button
            onClick={() => onNavigate('conferences')}
            className={`font-label-md text-label-md transition-colors duration-200 cursor-pointer ${currentView === 'conferences'
                ? 'text-primary border-b-2 border-primary pb-1 font-semibold'
                : 'text-white/80 hover:text-white hover:text-primary'
              }`}
          >
            Conferencias &amp; ALFIN
          </button>
          <button
            onClick={() => onNavigate('lost-found')}
            className={`font-label-md text-label-md transition-colors duration-200 cursor-pointer ${currentView === 'lost-found'
                ? 'text-primary border-b-2 border-primary pb-1 font-semibold'
                : 'text-white/80 hover:text-white hover:text-primary'
              }`}
          >
            Objetos Perdidos
          </button>
          <a
            href="https://biblioteca.urp.edu.pe/abnopac/"
            target="_blank"
            rel="noreferrer"
            className="text-white/80 hover:text-white font-label-md text-label-md hover:text-primary transition-colors duration-200 inline-flex items-center gap-1.5"
          >
            <span>Catálogo ABNOPAC</span>
            <ExternalLink className="w-3.5 h-3.5 text-white/70" />
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('directory')}
            className="text-white/80 hover:text-white transition-colors duration-200 flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 cursor-pointer"
            title="Buscar en el catálogo"
          >
            <span className="material-symbols-outlined text-2xl">search</span>
          </button>

          <a
            href="https://test.urp.edu.pe/Intranet/"
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex bg-primary-container text-white px-6 py-2 rounded-full font-label-md text-label-md hover:bg-surface-tint transition-colors items-center gap-1 shadow-sm font-semibold"
          >
            INTRANET URP
          </a>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white/80 hover:text-white flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 cursor-pointer"
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1f2937] border-t border-slate-700 px-6 py-4 space-y-3">
          <button
            onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 font-label-md text-white/90 hover:text-white"
          >
            Inicio
          </button>
          <button
            onClick={() => { onNavigate('directory'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 font-label-md text-white/90 hover:text-white"
          >
            Directorio Biomédico
          </button>
          <button
            onClick={() => { onNavigate('conferences'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 font-label-md text-white/90 hover:text-white"
          >
            Conferencias &amp; ALFIN
          </button>
          <button
            onClick={() => { onNavigate('lost-found'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 font-label-md text-white/90 hover:text-white"
          >
            Objetos Perdidos
          </button>
          <a
            href="https://biblioteca.urp.edu.pe/abnopac/"
            target="_blank"
            rel="noreferrer"
            className="py-2 font-label-md text-white/90 hover:text-white inline-flex items-center gap-1.5"
          >
            <span>Catálogo ABNOPAC</span>
            <ExternalLink className="w-3.5 h-3.5 text-white/70" />
          </a>
          <div className="pt-2 border-t border-slate-700">
            <a
              href="https://test.urp.edu.pe/Intranet/"
              target="_blank"
              rel="noreferrer"
              className="flex justify-center bg-primary-container text-white px-6 py-2.5 rounded-full font-label-md text-center hover:bg-surface-tint transition-colors font-semibold"
            >
              INTRANET URP
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
