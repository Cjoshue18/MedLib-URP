import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { HeaderBrandBadge } from './HeaderBrandBadge';

interface NavbarProps {
  currentView: 'home' | 'directory' | 'conferences' | 'lost-found';
  onNavigate: (view: 'home' | 'directory' | 'conferences' | 'lost-found') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(() => typeof window !== 'undefined' && window.scrollY > 15);
  const isNonHome = currentView !== 'home';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="absolute top-0 left-0 right-0 z-40 pointer-events-none w-full">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 flex justify-between items-center w-full h-20">
          <HeaderBrandBadge
            onNavigate={(view) => {
              onNavigate(view);
              setMobileMenuOpen(false);
            }}
            isLightBackground={isNonHome}
            className="pointer-events-auto"
          />
        </div>
      </div>

      <header className="sticky top-0 -mb-20 z-50 w-full overflow-x-clip pointer-events-none transition-colors duration-200">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 flex justify-end items-center w-full h-20">
          <div className="relative pointer-events-auto h-20 flex items-center">
            <div
              className={`absolute top-0 bottom-0 -left-6 sm:-left-8 -right-[100vw] rounded-bl-3xl border-b border-l pointer-events-none transition-colors duration-200 ${
                isNonHome
                  ? isScrolled
                    ? 'bg-[#0F172A]/90 backdrop-blur-md border-slate-800 shadow-md'
                    : 'bg-[#0F172A] border-slate-800 shadow-sm'
                  : isScrolled
                    ? 'bg-white/75 backdrop-blur-md border-slate-200/70 shadow-md'
                    : 'bg-white border-slate-200 shadow-sm'
              }`}
            />

            <nav className="relative z-10 hidden md:flex items-center gap-6 lg:gap-8">
              <button
                onClick={() => onNavigate('directory')}
                className={`font-sans text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                  currentView === 'directory'
                    ? isNonHome
                      ? 'text-[#8CF9A9] border-b-2 border-[#8CF9A9] pb-1'
                      : 'text-[#008744] border-b-2 border-[#008744] pb-1'
                    : isNonHome
                      ? 'text-slate-300 hover:text-white'
                      : 'text-slate-600 hover:text-[#008744]'
                }`}
              >
                Bases de Datos
              </button>
              <button
                onClick={() => onNavigate('conferences')}
                className={`font-sans text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                  currentView === 'conferences'
                    ? isNonHome
                      ? 'text-[#8CF9A9] border-b-2 border-[#8CF9A9] pb-1'
                      : 'text-[#008744] border-b-2 border-[#008744] pb-1'
                    : isNonHome
                      ? 'text-slate-300 hover:text-white'
                      : 'text-slate-600 hover:text-[#008744]'
                }`}
              >
                Conferencias
              </button>
              <button
                onClick={() => onNavigate('lost-found')}
                className={`font-sans text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                  currentView === 'lost-found'
                    ? isNonHome
                      ? 'text-[#8CF9A9] border-b-2 border-[#8CF9A9] pb-1'
                      : 'text-[#008744] border-b-2 border-[#008744] pb-1'
                    : isNonHome
                      ? 'text-slate-300 hover:text-white'
                      : 'text-slate-600 hover:text-[#008744]'
                }`}
              >
                Objetos Perdidos
              </button>
              <a
                href="https://biblioteca.urp.edu.pe/abnopac/"
                target="_blank"
                rel="noreferrer"
                className={`font-sans text-sm font-semibold transition-colors duration-200 inline-flex items-center gap-1.5 ${
                  isNonHome ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-[#008744]'
                }`}
              >
                <span>Catálogo de Libros</span>
                <ExternalLink className={`w-3.5 h-3.5 ${isNonHome ? 'text-slate-400' : 'text-slate-400'}`} />
              </a>
            </nav>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`relative z-10 md:hidden flex items-center justify-center w-10 h-10 rounded-lg cursor-pointer transition-colors ${
                isNonHome
                  ? 'text-white hover:text-[#8CF9A9] hover:bg-slate-800'
                  : 'text-slate-800 hover:text-[#008744] hover:bg-slate-100'
              }`}
              aria-label="Toggle Menu"
            >
              <span className="material-symbols-outlined text-2xl">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            className={`md:hidden border-t border-b shadow-md px-6 py-4 space-y-3 pointer-events-auto transition-all duration-300 ${
              isNonHome
                ? isScrolled
                  ? 'bg-[#0F172A]/90 backdrop-blur-md border-slate-800 text-white'
                  : 'bg-[#0F172A] border-slate-800 text-white'
                : isScrolled
                  ? 'bg-white/85 backdrop-blur-md border-slate-200/70 text-slate-800'
                  : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            <button
              onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
              className={`block w-full text-left py-2 font-sans text-sm font-semibold ${
                isNonHome ? 'text-slate-200 hover:text-[#8CF9A9]' : 'text-slate-800 hover:text-[#008744]'
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => { onNavigate('directory'); setMobileMenuOpen(false); }}
              className={`block w-full text-left py-2 font-sans text-sm font-semibold ${
                isNonHome ? 'text-slate-200 hover:text-[#8CF9A9]' : 'text-slate-800 hover:text-[#008744]'
              }`}
            >
              Bases de Datos
            </button>
            <button
              onClick={() => { onNavigate('conferences'); setMobileMenuOpen(false); }}
              className={`block w-full text-left py-2 font-sans text-sm font-semibold ${
                isNonHome ? 'text-slate-200 hover:text-[#8CF9A9]' : 'text-slate-800 hover:text-[#008744]'
              }`}
            >
              Conferencias
            </button>
            <button
              onClick={() => { onNavigate('lost-found'); setMobileMenuOpen(false); }}
              className={`block w-full text-left py-2 font-sans text-sm font-semibold ${
                isNonHome ? 'text-slate-200 hover:text-[#8CF9A9]' : 'text-slate-800 hover:text-[#008744]'
              }`}
            >
              Objetos Perdidos
            </button>
            <a
              href="https://biblioteca.urp.edu.pe/abnopac/"
              target="_blank"
              rel="noreferrer"
              className={`block w-full text-left py-2 font-sans text-sm font-semibold inline-flex items-center gap-1.5 ${
                isNonHome ? 'text-slate-200 hover:text-[#8CF9A9]' : 'text-slate-800 hover:text-[#008744]'
              }`}
            >
              <span>Catálogo de Libros</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        )}
      </header>
    </>
  );
};
