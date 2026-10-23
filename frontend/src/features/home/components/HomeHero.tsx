import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';
import { HomeUpcomingActivities } from './HomeUpcomingActivities';
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
    <>
      <section className="relative bg-[#0F172A] text-slate-900 pt-28 sm:pt-32 pb-20 px-6 sm:px-8 border-b-4 border-[#008744] overflow-hidden transition-colors duration-200">
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
                idx === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/40 to-transparent via-40% to-70%"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/25 via-transparent to-transparent"></div>
        </div>

        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center lg:min-h-[500px]">
            <div className="lg:col-span-7 space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[62px] font-lora font-normal sm:font-medium text-white leading-[1.08] tracking-tight">
                Un lugar para<br className="hidden sm:block" />{' '}
                <span className="italic font-normal text-[#8CF9A9]">pensar</span> en<br className="hidden sm:block" />{' '}
                profundidad.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-dm-sans max-w-xl leading-relaxed">
                Portal oficial para estudiantes, donde podrán acceder a bases de datos científicas, literatura especializada y conferencias médicas.
              </p>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end items-center">
              <div className="w-full max-w-[420px]">
                <HomeUpcomingActivities onNavigate={onNavigate} />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 select-none">
          <button
            type="button"
            onClick={handlePrevSlide}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer drop-shadow-sm"
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
                    ? 'bg-[#8CF9A9] ring-2 ring-[#8CF9A9]/40'
                    : 'bg-slate-600 hover:bg-slate-500'
                }`}
                title={`Ir a imagen ${idx + 1}`}
                aria-label={`Ir a imagen ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNextSlide}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer drop-shadow-sm"
            title="Imagen siguiente"
            aria-label="Imagen siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <section className="w-full bg-[#f8fafc] py-8 px-6 sm:px-8">
        <div className="max-w-[760px] mx-auto space-y-3.5">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5">
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
              className="bg-[#008744] hover:bg-[#006b35] text-white font-bold px-7 py-3.5 rounded-lg transition-all tactile-btn-green flex items-center justify-center gap-1.5 shrink-0 cursor-pointer text-sm"
            >
              <span>Buscar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

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
        </div>
      </section>
    </>
  );
};
