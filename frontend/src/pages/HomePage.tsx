import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Clock,
  Stethoscope,
  Send,
  X,
  Mail,
  ChevronRight,
  ChevronLeft,
  RotateCcw
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (view: 'home' | 'directory' | 'conferences' | 'lost-found') => void;
}

const heroSlides = [
  { id: 'slide-1', src: '/carousel/20260910_210323.webp', alt: 'Biblioteca FMH URP - Imagen 1' },
  { id: 'slide-2', src: '/carousel/20260910_210341.webp', alt: 'Biblioteca FMH URP - Imagen 2' },
  { id: 'slide-3', src: '/carousel/20260910_210422.webp', alt: 'Biblioteca FMH URP - Imagen 3' },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [admissionsTab, setAdmissionsTab] = useState<'pregrado' | 'posgrado' | 'residentado'>('pregrado');
  const [isHeroFormOpen, setIsHeroFormOpen] = useState(false);
  const [flippedHexIds, setFlippedHexIds] = useState<Set<string>>(new Set());
  const [isAllFlipped, setIsAllFlipped] = useState(false);
  const hexTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const allFlipTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    const existingScript = document.querySelector('script[src="https://elfsightcdn.com/platform.js"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://elfsightcdn.com/platform.js';
      script.async = true;
      document.body.appendChild(script);
    }
    return () => {
      if (allFlipTimerRef.current) clearTimeout(allFlipTimerRef.current);
      hexTimersRef.current.forEach(timer => clearTimeout(timer));
    };
  }, []);

  const handleHexHover = (id: string) => {
    const existingTimer = hexTimersRef.current.get(id);
    if (existingTimer) {
      clearTimeout(existingTimer);
      hexTimersRef.current.delete(id);
    }

    setFlippedHexIds(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    const timer = setTimeout(() => {
      setFlippedHexIds(prev => {
        if (!prev.has(id)) return prev;
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      hexTimersRef.current.delete(id);
    }, 7000);

    hexTimersRef.current.set(id, timer);
  };

  const handleHexClick = (id: string) => {
    const existingTimer = hexTimersRef.current.get(id);
    if (existingTimer) {
      clearTimeout(existingTimer);
      hexTimersRef.current.delete(id);
    }

    setFlippedHexIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleFlipAll = () => {
    if (allFlipTimerRef.current) {
      clearTimeout(allFlipTimerRef.current);
    }
    hexTimersRef.current.forEach(timer => clearTimeout(timer));
    hexTimersRef.current.clear();

    if (isAllFlipped || flippedHexIds.size > 0) {
      setIsAllFlipped(false);
      setFlippedHexIds(new Set());
    } else {
      setIsAllFlipped(true);
      allFlipTimerRef.current = setTimeout(() => {
        setIsAllFlipped(false);
      }, 5000);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('directory');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  return (
    <main className="w-full bg-[#f8fafc] text-slate-900 overflow-hidden">
      <section className="relative bg-[#12161a] text-white pt-10 pb-24 px-6 sm:px-8 border-b-4 border-[#008744] overflow-hidden">
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          {heroSlides.map((slide, idx) => (
            <img
              key={slide.id}
              src={slide.src}
              alt={slide.alt}
              loading="eager"
              decoding="async"
              className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ease-in-out ${idx === currentSlide ? 'opacity-65' : 'opacity-0'
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
                      'Sorteo de Libros'
                    ].map((item, idx) => (
                      <span key={idx} className="flex items-center gap-6 shrink-0 hover:text-white transition-colors cursor-default">
                        <span>{item}</span>
                        <span className="text-[#008744] font-black text-sm">•</span>
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
                    Portal Oficial para Estudiantes — Biblioteca FMH URP
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end lg:min-h-[570px]">
              {!isHeroFormOpen ? (
                <button
                  type="button"
                  onClick={() => setIsHeroFormOpen(true)}
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
              ) : (
                <div className="relative w-full max-w-sm animate-in fade-in zoom-in-95 duration-300">
                  <button
                    type="button"
                    onClick={() => setIsHeroFormOpen(false)}
                    className="absolute top-4 -left-12 z-20 w-9 h-9 rounded-full bg-slate-600/50 hover:bg-slate-600/90 text-white backdrop-blur-xs border border-white/25 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg hover:scale-110 active:scale-95 group"
                    title="Cerrar formulario"
                    aria-label="Cerrar formulario"
                  >
                    <X className="w-4 h-4 text-white/90 group-hover:text-white group-hover:rotate-90 transition-transform duration-200" />
                  </button>

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
                            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${admissionsTab === 'pregrado'
                              ? 'bg-[#008744] text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                              }`}
                          >
                            Pregrado
                          </button>
                          <button
                            type="button"
                            onClick={() => setAdmissionsTab('posgrado')}
                            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${admissionsTab === 'posgrado'
                              ? 'bg-[#008744] text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                              }`}
                          >
                            Posgrado
                          </button>
                          <button
                            type="button"
                            onClick={() => setAdmissionsTab('residentado')}
                            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${admissionsTab === 'residentado'
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
                          <span className="text-slate-600 leading-snug">Acceso con cuenta institucional a literatura científica y soporte clínico.</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <button
                          onClick={() => onNavigate('directory')}
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
                </div>
              )}
            </div>
          </div>
        </div>

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
                className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 cursor-pointer drop-shadow-md ${idx === currentSlide
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

      <section className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-8">
            <div className="border-b border-slate-200 pb-4 space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#008744] text-white text-xs font-extrabold uppercase tracking-wider shadow-sm">
                <Stethoscope className="w-3.5 h-3.5 text-white" />
                <span>Colección Científica Especializada</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
                Bases de Datos Médicas
              </h2>

              <p className="text-sm text-slate-600">
                Herramientas clave suscritas por la facultad para diagnóstico, farmacología y soporte clínico.
              </p>
            </div>

            <div className="relative w-full py-6 overflow-visible flex items-center justify-center">
              <div className="relative w-full max-w-[530px] aspect-[510/360] select-none">
                <div
                  className="absolute cursor-pointer group z-20"
                  style={{
                    left: `${(17 / 510) * 100}%`,
                    top: `${(174.707 / 360) * 100}%`,
                    width: `${(96 / 510) * 100}%`,
                    height: `${(83.138 / 360) * 100}%`,
                  }}
                  onClick={handleFlipAll}
                  title="Girar todos los recursos"
                  aria-label="Girar todos los recursos"
                >
                  <svg viewBox="0 0 96 83.14" className="w-full h-full overflow-visible drop-shadow-xs">
                    <polygon
                      points="24,0 72,0 96,41.57 72,83.14 24,83.14 0,41.57"
                      className="fill-white group-hover:fill-emerald-50/80 stroke-slate-800 group-hover:stroke-[#008744] stroke-[2] group-hover:stroke-[2.5] transition-all duration-200"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700 group-hover:text-[#008744] transition-colors p-1 select-none pointer-events-none">
                    <RotateCcw className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-500 ${isAllFlipped ? 'rotate-180 text-[#008744]' : 'group-hover:-rotate-45'}`} />
                    <span className="text-[7.5px] sm:text-[8px] font-black uppercase tracking-wider mt-0.5 text-slate-500 group-hover:text-[#008744]">
                      {isAllFlipped ? 'Volver' : 'Girar'}
                    </span>
                  </div>
                </div>

                <svg
                  viewBox="0 0 510 360"
                  className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10"
                >
                  <polyline
                    points="113,-33.1 161,-33.1 185,8.4"
                    fill="none"
                    stroke="#008744"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="401,50 449,50 473,91.6"
                    fill="none"
                    stroke="#008744"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="473"
                    cy="91.6"
                    r="5"
                    fill="white"
                    stroke="#008744"
                    strokeWidth="2"
                  />
                  <polyline
                    points="17,50 -31,50 -55,91.6"
                    fill="none"
                    stroke="#008744"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="-55"
                    cy="91.6"
                    r="5"
                    fill="white"
                    stroke="#008744"
                    strokeWidth="2"
                  />
                  <polyline
                    points="41,341 89,341 113,299.4"
                    fill="none"
                    stroke="#008744"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="257"
                    y1="299.4"
                    x2="281"
                    y2="341"
                    stroke="#008744"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>

                {[
                  { id: 'bmj-best-practice', title: 'BMJ Best Practice', abbr: 'BBP', cat: 'Point-of-Care', col: 0, row: 0 },
                  { id: 'uptodate', title: 'UpToDate', abbr: 'UTD', cat: 'Soporte Clínico', col: 0, row: 1, innerBond: { x1: 30, y1: 6.5, x2: 66, y2: 6.5 } },
                  { id: 'biodigital', title: 'BioDigital 3D', abbr: 'BIO', cat: 'Anatomía 3D', col: 1, row: 0 },
                  { id: 'dynamedex', title: 'DynaMedex', abbr: 'DYNA', cat: 'Point-of-Care', col: 1, row: 1, innerBond: { x1: 8.6, y1: 39.6, x2: 26.6, y2: 8.4 } },
                  { id: 'scielo', title: 'SciELO', abbr: 'SCI', cat: 'Open Access', col: 1, row: 2 },
                  { id: 'clinicalkey-espanol', title: 'ClinicalKey', abbr: 'CK', cat: 'Elsevier', col: 2, row: 0 },
                  { id: 'scopus', title: 'Scopus', abbr: 'SCOP', cat: 'Investigación', col: 2, row: 1 },
                  { id: 'pubmed', title: 'PubMed', abbr: 'PUB', cat: 'MEDLINE', col: 2, row: 2, innerBond: { x1: 30, y1: 6.5, x2: 66, y2: 6.5 } },
                  { id: 'accessmedicina', title: 'AccessMedicina', abbr: 'ACC', cat: 'McGraw-Hill', col: 2, row: 3 },
                  { id: 'nejm', title: 'NEJM', abbr: 'NEJM', cat: 'Medicina General', col: 3, row: 0, innerBond: { x1: 26.6, y1: 74.7, x2: 8.6, y2: 43.5 } },
                  { id: 'the-bmj', title: 'The BMJ', abbr: 'BMJ', cat: 'Revistas Q1', col: 3, row: 1 },
                  { id: 'epistemonikos', title: 'Epistemonikos', abbr: 'EPI', cat: 'Evidencia Clínica', col: 3, row: 2 },
                  { id: 'nature', title: 'Nature', abbr: 'NAT', cat: 'Genómica', col: 4, row: 0, innerBond: { x1: 30, y1: 6.5, x2: 66, y2: 6.5 } },
                  { id: 'sciencedirect', title: 'ScienceDirect', abbr: 'SD', cat: 'Elsevier', col: 4, row: 1, innerBond: { x1: 69.4, y1: 8.4, x2: 87.4, y2: 39.6 } },
                  { id: 'cochrane', title: 'Cochrane Library', abbr: 'COCH', cat: 'Revisiones Q1', col: 4, row: 2 },
                ].map((item) => {
                  const cx = 65 + item.col * 72;
                  const cy = 50 + item.row * 83.138 + (item.col % 2 !== 0 ? 41.569 : 0);
                  const leftPct = ((cx - 48) / 510) * 100;
                  const topPct = ((cy - 41.569) / 360) * 100;
                  const widthPct = (96 / 510) * 100;
                  const heightPct = (83.138 / 360) * 100;
                  const isFlipped = isAllFlipped || flippedHexIds.has(item.id);

                  const yTop = cy - 41.569;
                  const yBottom = cy + 41.569;
                  const tTop = Math.max(0, Math.min(1, (yTop - 10) / 340));
                  const tBottom = Math.max(0, Math.min(1, (yBottom - 10) / 340));
                  const topG = Math.round(195 - tTop * (195 - 48));
                  const topB = Math.round(112 - tTop * (112 - 20));
                  const botG = Math.round(195 - tBottom * (195 - 48));
                  const botB = Math.round(112 - tBottom * (112 - 20));
                  const topColor = `rgb(0, ${topG}, ${topB})`;
                  const botColor = `rgb(0, ${botG}, ${botB})`;

                  return (
                    <div
                      key={item.id}
                      className="absolute cursor-pointer transition-all duration-200"
                      style={{
                        left: `${leftPct}%`,
                        top: `${topPct}%`,
                        width: `${widthPct}%`,
                        height: `${heightPct}%`,
                        perspective: '800px',
                        zIndex: isFlipped ? 30 : 10,
                      }}
                      onClick={() => handleHexClick(item.id)}
                      onMouseEnter={() => handleHexHover(item.id)}
                      title={`${item.title} — ${item.cat}`}
                    >
                      <div
                        className={`w-full h-full relative transition-transform duration-500 ease-out preserve-3d ${isFlipped ? 'rotate-y-180' : ''
                          }`}
                        style={{
                          transitionDelay: isAllFlipped ? `${item.col * 40 + item.row * 30}ms` : '0ms'
                        }}
                      >
                        <div className="absolute inset-0 w-full h-full backface-hidden">
                          <svg viewBox="0 0 96 83.14" className="w-full h-full drop-shadow-xs overflow-visible">
                            <defs>
                              <linearGradient id={`grad-${item.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor={topColor} />
                                <stop offset="100%" stopColor={botColor} />
                              </linearGradient>
                            </defs>
                            <polygon
                              points="24,0 72,0 96,41.57 72,83.14 24,83.14 0,41.57"
                              fill={`url(#grad-${item.id})`}
                              stroke="#0f172a"
                              strokeWidth="2"
                              className="transition-colors duration-200"
                            />
                            {item.innerBond && (
                              <line
                                x1={item.innerBond.x1}
                                y1={item.innerBond.y1}
                                x2={item.innerBond.x2}
                                y2={item.innerBond.y2}
                                stroke="#8cf9a9"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                opacity="0.45"
                              />
                            )}
                          </svg>
                        </div>

                        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                          <svg viewBox="0 0 96 83.14" className="w-full h-full drop-shadow-md overflow-visible">
                            <polygon
                              points="24,0 72,0 96,41.57 72,83.14 24,83.14 0,41.57"
                              fill="#0f172a"
                              stroke="#00a859"
                              strokeWidth="2.5"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-1.5 text-center select-none pointer-events-none">
                            <span className="text-[#8cf9a9] font-black text-[8px] uppercase tracking-wider leading-none">
                              {item.abbr}
                            </span>
                            <span className="text-white font-extrabold text-[9px] sm:text-[10px] leading-tight mt-0.5 line-clamp-2 px-1">
                              {item.title}
                            </span>
                            <span className="text-emerald-400 text-[7px] sm:text-[8px] font-semibold truncate max-w-[70px] mt-0.5">
                              {item.cat}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="absolute left-[83%] sm:left-[84%] top-[72%] -translate-y-1/2 select-none z-20 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onNavigate('directory')}
                    className="inline-flex items-center gap-1.5 text-sm sm:text-base font-extrabold text-[#008744] hover:text-[#00572b] transition-all hover:translate-x-1 cursor-pointer group"
                    title="Ver más bases de datos médicas"
                  >
                    <span>Ver Más</span>
                    <span className="text-lg sm:text-xl leading-none font-black text-[#008744] group-hover:translate-x-1 transition-transform">&gt;</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-urp-brutal p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 mb-1">
                  Próximas Actividades
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Conferencias y capacitaciones ALFIN programadas.
                </p>

                <div className="space-y-4">
                  <div
                    onClick={() => onNavigate('conferences')}
                    className="flex items-center gap-4 cursor-pointer group py-1"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 aspect-square rounded-2xl bg-[#008744] text-white flex flex-col items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      <span className="text-xl sm:text-2xl font-display font-black leading-none">15</span>
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mt-0.5">NOV</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug group-hover:text-[#008744] transition-colors line-clamp-2">
                        Capacitación: Uso avanzado de ClinicalKey
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>10:00 AM - 12:00 PM</span>
                      </p>
                    </div>
                  </div>

                  <div className="w-4/5 mx-auto border-t border-slate-200/60"></div>

                  <div
                    onClick={() => onNavigate('conferences')}
                    className="flex items-center gap-4 cursor-pointer group py-1"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 aspect-square rounded-2xl bg-[#008744] text-white flex flex-col items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      <span className="text-xl sm:text-2xl font-display font-black leading-none">22</span>
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mt-0.5">NOV</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug group-hover:text-[#008744] transition-colors line-clamp-2">
                        Taller: Búsqueda bibliográfica en Scopus &amp; PubMed
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>03:00 PM - 05:00 PM</span>
                      </p>
                    </div>
                  </div>

                  <div className="w-4/5 mx-auto border-t border-slate-200/60"></div>

                  <div
                    onClick={() => onNavigate('conferences')}
                    className="flex items-center gap-4 cursor-pointer group py-1"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 aspect-square rounded-2xl bg-[#008744] text-white flex flex-col items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      <span className="text-xl sm:text-2xl font-display font-black leading-none">29</span>
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mt-0.5">NOV</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug group-hover:text-[#008744] transition-colors line-clamp-2">
                        Sesión ALFIN: Gestores de Referencias Zotero &amp; Mendeley
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>11:00 AM - 01:00 PM</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4">
                <button
                  onClick={() => onNavigate('conferences')}
                  className="w-full py-3 px-4 rounded-full border-2 border-slate-900 hover:bg-slate-50 font-bold text-xs text-slate-900 shadow-urp-brutal-sm tactile-btn flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Ver Calendario Completo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-6 pb-20">
        <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-urp-brutal p-6 sm:p-8">
          <div className="mb-6 border-b border-slate-200 pb-4">
            <span className="text-[11px] font-bold text-[#008744] uppercase tracking-wider block">
              COMUNIDAD MÉDICA & ACTIVIDADES
            </span>
            <h3 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
              @bib_famurp en Instagram
            </h3>
          </div>

          <div className="w-full px-2 sm:px-8 py-2 overflow-visible min-h-[340px]">
            <div className="elfsight-app-437cd9ca-7bc2-447c-9b36-5e9c7350b63f" data-elfsight-app-lazy></div>
          </div>

          <p className="text-xs text-slate-500 mt-4">
            Síguenos para avisos de horarios especiales en sala, nuevas adquisiciones bibliográficas y convocatorias ALFIN.
          </p>
        </div>
      </section>
    </main>
  );
};
