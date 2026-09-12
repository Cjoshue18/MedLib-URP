import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';
import { HomeBoletinDrawer, BoletinPill } from './HomeBoletinDrawer';

interface HomeHeroProps {
  onNavigate: (view: 'home' | 'directory' | 'conferences' | 'lost-found', query?: string) => void;
}

const heroSlides = [
  { id: 'slide-1', src: '/carousel/20260910_210323.webp', alt: 'Biblioteca FMH URP - Imagen 1' },
  { id: 'slide-2', src: '/carousel/20260910_210341.webp', alt: 'Biblioteca FMH URP - Imagen 2' },
  { id: 'slide-3', src: '/carousel/20260910_210422.webp', alt: 'Biblioteca FMH URP - Imagen 3' },
];

export const HomeHero: React.FC<HomeHeroProps> = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHeroFormOpen, setIsHeroFormOpen] = useState(false);

  useEffect(() => {
    heroSlides.forEach((slide) => {
      const img = new Image();
      img.src = slide.src;
    });
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('directory', searchQuery);
  };

  return (
    <section className="relative bg-[#12161a] text-white pt-10 pb-24 px-6 sm:px-8 border-b-4 border-[#008744] overflow-hidden">
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {heroSlides.map((slide, idx) => (
          <img
            key={slide.id}
            src={slide.src}
            alt={slide.alt}
            loading="eager"
            decoding="async"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ease-in-out ${
              idx === currentSlide ? 'opacity-65' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-[#12161a]/90 via-[#12161a]/70 to-[#12161a]/50"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#12161a]/85 via-transparent to-black/35"></div>
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-20"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#008744]/20 blur-[120px] rounded-full pointer-events-none"></div>
      </div>

      <div className="max-w-[1280px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start lg:min-h-[570px]">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#008744] text-white text-xs font-extrabold uppercase tracking-wider shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#8cf9a9] animate-pulse"></span>
                <span>Biblioteca Virtual y Especializada</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-display font-extrabold leading-[1.1] tracking-tight">
                <span className="text-white block sm:inline">Facultad de </span>
                <br className="hidden sm:block" />
                <span className="animate-camera-pan-text font-black">
                  Medicina Humana
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                Acceso exclusivo a una amplia colección de recursos científicos médicos indexados, soporte clínico especializado y certificaciones oficiales de <strong className="text-white font-semibold">Alfabetización Informacional (ALFIN)</strong>.
              </p>
            </div>

            <div className="space-y-3 max-w-xl">
              <div className="overflow-hidden w-full py-1 relative">
                <div className="animate-marquee-scroll flex items-center gap-6 text-xs text-slate-300/90 font-semibold tracking-wide select-none">
                  {[
                    'Catálogo amplio',
                    'Bases de datos médicas',
                    'Revistas',
                    'Conferencias',
                    'Programa ALFIN',
                    'Sorteo de Libros',
                    'Catálogo amplio',
                    'Bases de datos médicas',
                    'Revistas',
                    'Conferencias',
                    'Programa ALFIN',
                    'Sorteo de Libros',
                  ].map((item, idx) => (
                    <span key={idx} className="flex items-center gap-6 shrink-0 hover:text-white transition-colors cursor-default">
                      <span>{item}</span>
                      <span className="text-[#008744] font-black text-sm">&bull;</span>
                    </span>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSearch} className="flex gap-2.5">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por fármaco, patología, autor o tema médico..."
                    className="w-full pl-12 pr-4 py-3.5 bg-white text-slate-900 rounded-2xl border border-white/20 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#00a859] shadow-2xl transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#008744] hover:bg-[#006b35] text-white font-bold px-7 py-3.5 rounded-2xl transition-all shadow-urp-brutal-green tactile-btn-green flex items-center gap-1.5 shrink-0 cursor-pointer text-sm"
                >
                  <span>Buscar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="space-y-3 pt-1 pl-1">
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Síguenos en:
                </span>
                <div className="flex items-center gap-4">
                  <a
                    href="https://www.facebook.com/famurp.pe/"
                    target="_blank"
                    rel="noreferrer"
                    title="Facebook Oficial Facultad de Medicina Humana URP"
                    aria-label="Facebook Oficial FAMURP"
                    className="group flex items-center gap-2 text-slate-300 hover:text-white transition-all transform hover:scale-105 cursor-pointer"
                  >
                    <svg className="w-6 h-6 drop-shadow-md transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="12" fill="#1877F2" />
                      <path
                        fill="#FFFFFF"
                        d="M14.5 12h-2v7h-3v-7h-1.5v-2.5H9.5V8c0-1.8 1-2.8 2.8-2.8h2.2v2.5h-1.4c-.9 0-1.1.4-1.1 1.1v.7h2.5L14.5 12z"
                      />
                    </svg>
                    <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
                      Facebook
                    </span>
                  </a>

                  <a
                    href="https://www.instagram.com/bib_famurp/"
                    target="_blank"
                    rel="noreferrer"
                    title="Instagram Oficial @bib_famurp"
                    aria-label="Instagram Oficial Biblioteca FMH URP"
                    className="group flex items-center gap-2 text-slate-300 hover:text-white transition-all transform hover:scale-105 cursor-pointer"
                  >
                    <svg className="w-6 h-6 drop-shadow-md transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                      <defs>
                        <radialGradient id="ig-grad-hero" cx="20%" cy="100%" r="150%">
                          <stop offset="0%" stopColor="#ffd521" />
                          <stop offset="25%" stopColor="#f50000" />
                          <stop offset="50%" stopColor="#b900b4" />
                          <stop offset="100%" stopColor="#4300e8" />
                        </radialGradient>
                      </defs>
                      <rect width="24" height="24" rx="6.5" fill="url(#ig-grad-hero)" />
                      <circle cx="12" cy="12" r="4.2" fill="none" stroke="#FFFFFF" strokeWidth="1.8" />
                      <circle cx="17.8" cy="6.2" r="1.1" fill="#FFFFFF" />
                      <rect x="4.5" y="4.5" width="15" height="15" rx="3.8" fill="none" stroke="#FFFFFF" strokeWidth="1.8" />
                    </svg>
                    <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
                      Instagram
                    </span>
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <span className="w-2 h-2 rounded-full bg-[#00a859] animate-pulse"></span>
                <span className="font-handwriting text-lg sm:text-xl text-emerald-300 font-semibold tracking-wide select-none drop-shadow-xs">
                  Portal Oficial para Estudiantes &mdash; Biblioteca FMH URP
                </span>
              </div>

              <div className="lg:hidden flex justify-center pt-2">
                <BoletinPill onOpen={() => setIsHeroFormOpen(true)} orientation="horizontal" />
              </div>
            </div>
          </div>

          <div className="hidden lg:flex lg:col-span-5 justify-end lg:min-h-[570px]">
            {!isHeroFormOpen ? (
              <BoletinPill onOpen={() => setIsHeroFormOpen(true)} orientation="vertical" />
            ) : (
              <HomeBoletinDrawer
                isOpen={isHeroFormOpen}
                onClose={() => setIsHeroFormOpen(false)}
                onNavigateToDirectory={() => onNavigate('directory')}
              />
            )}
          </div>
        </div>
      </div>

      {isHeroFormOpen && (
        <div className="lg:hidden">
          <HomeBoletinDrawer
            isOpen={isHeroFormOpen}
            onClose={() => setIsHeroFormOpen(false)}
            onNavigateToDirectory={() => onNavigate('directory')}
          />
        </div>
      )}

      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 select-none">
        <button
          type="button"
          onClick={handlePrevSlide}
          className="w-8 h-8 flex items-center justify-center text-white/75 hover:text-white transition-colors cursor-pointer drop-shadow-md"
          title="Imagen anterior"
          aria-label="Imagen anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {heroSlides.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 cursor-pointer drop-shadow-md ${
                idx === currentSlide
                  ? 'bg-[#008744] ring-2 ring-white/80'
                  : 'bg-white/40 hover:bg-white/80'
              }`}
              title={`Ir a imagen ${idx + 1}`}
              aria-label={`Ir a imagen ${idx + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNextSlide}
          className="w-8 h-8 flex items-center justify-center text-white/75 hover:text-white transition-colors cursor-pointer drop-shadow-md"
          title="Imagen siguiente"
          aria-label="Imagen siguiente"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
