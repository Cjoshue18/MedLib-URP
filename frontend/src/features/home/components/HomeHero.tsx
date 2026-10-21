import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';
import { BoletinSubscriptionCard } from './BoletinSubscriptionCard';
import { HERO_SLIDES, HERO_MARQUEE_ITEMS } from '../constants/heroConstants';

interface HomeHeroProps {
  onNavigate: (view: 'home' | 'directory' | 'conferences' | 'lost-found', query?: string) => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const preloadTimer = setTimeout(() => {
      HERO_SLIDES.slice(1).forEach((slide) => {
        const img = new Image();
        img.src = slide.src;
      });
    }, 1500);

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);

    return () => {
      clearTimeout(preloadTimer);
      clearInterval(timer);
    };
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('directory', searchQuery);
  };

  return (
    <section className="relative bg-white text-slate-900 pt-10 pb-24 px-6 sm:px-8 border-b-4 border-[#008744] overflow-hidden transition-colors duration-200">
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {HERO_SLIDES.map((slide, idx) => (
          <img
            key={slide.id}
            src={slide.src}
            alt={slide.alt}
            loading={idx === 0 ? 'eager' : 'lazy'}
            decoding={idx === 0 ? 'sync' : 'async'}
            fetchPriority={idx === 0 ? 'high' : 'low'}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ease-in-out ${
              idx === currentSlide ? 'opacity-85' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent"></div>
      </div>

      <div className="max-w-[1280px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center lg:min-h-[570px]">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#008744]/10 border border-[#008744]/30 text-[#008744] text-xs font-extrabold uppercase tracking-wider shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#008744] animate-pulse"></span>
                <span>Facultad de Medicina Humana</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-display font-extrabold leading-[1.1] tracking-tight">
                <span className="text-slate-900 block sm:inline">Biblioteca Virtual de </span>
                <br className="hidden sm:block" />
                <span className="animate-camera-pan-text font-black">
                  Medicina Humana
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Portal oficial para estudiantes, donde podrán acceder a bases de datos científicas, literatura especializada y conferencias médicas.
              </p>
            </div>

            <div className="space-y-3 max-w-xl">
              <div className="overflow-hidden w-full py-1.5 relative border-y border-slate-200">
                <div className="animate-marquee-scroll flex items-center gap-6 text-xs text-slate-600 font-semibold tracking-wide select-none">
                  {HERO_MARQUEE_ITEMS.map((item, idx) => (
                    <span key={idx} className="flex items-center gap-6 shrink-0 hover:text-slate-900 transition-colors cursor-default">
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
                    placeholder="Buscar base de datos, por materia académica o recurso..."
                    className="w-full pl-12 pr-4 py-3.5 bg-white text-slate-900 rounded-lg border border-slate-300 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#00a859] shadow-md transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#008744] hover:bg-[#006b35] text-white font-bold px-7 py-3.5 rounded-lg transition-all shadow-urp-brutal-green tactile-btn-green flex items-center gap-1.5 shrink-0 cursor-pointer text-sm"
                >
                  <span>Buscar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="lg:hidden pt-4 flex justify-center">
              <BoletinSubscriptionCard
                variant="home"
                onNavigateToDirectory={() => onNavigate('directory')}
                className="w-full max-w-[350px]"
              />
            </div>
          </div>

          <div className="hidden lg:flex lg:col-span-5 justify-end items-center">
            <BoletinSubscriptionCard
              variant="home"
              onNavigateToDirectory={() => onNavigate('directory')}
              className="w-full max-w-[350px]"
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 select-none">
        <button
          type="button"
          onClick={handlePrevSlide}
          className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer drop-shadow-sm"
          title="Imagen anterior"
          aria-label="Imagen anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 cursor-pointer drop-shadow-md ${
                idx === currentSlide
                  ? 'bg-[#008744] ring-2 ring-[#008744]/40'
                  : 'bg-slate-300 hover:bg-slate-400'
              }`}
              title={`Ir a imagen ${idx + 1}`}
              aria-label={`Ir a imagen ${idx + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNextSlide}
          className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer drop-shadow-sm"
          title="Imagen siguiente"
          aria-label="Imagen siguiente"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
