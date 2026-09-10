import React, { useState } from 'react';
import { 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  ExternalLink, 
  Stethoscope, 
  ChevronRight,
  Send,
  X,
  Mail
} from 'lucide-react';
import { getDatabaseLogoUrl } from '../features/guides/data/databasesData';

interface HomePageProps {
  onNavigate: (view: 'home' | 'directory' | 'conferences' | 'lost-found') => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [admissionsTab, setAdmissionsTab] = useState<'pregrado' | 'posgrado' | 'residentado'>('pregrado');
  const [isHeroFormOpen, setIsHeroFormOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('directory');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  const getLogo = (filename: string) => getDatabaseLogoUrl(filename);

  return (
    <main className="w-full bg-[#f8fafc] text-slate-900 overflow-hidden">
      <section className="relative bg-[#12161a] text-white pt-10 pb-20 px-6 sm:px-8 border-b-4 border-[#008744] overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-40 pointer-events-none"></div>

        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#008744]/15 blur-[120px] rounded-full pointer-events-none"></div>

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
                  Acceso exclusivo a una amplia colección de recursos científicos biomédicos indexados, soporte clínico especializado y certificaciones oficiales de <strong className="text-white font-semibold">Alfabetización Informacional (ALFIN)</strong>.
                </p>
              </div>

              <div className="space-y-3 max-w-xl">
                <div className="overflow-hidden w-full py-1 relative">
                  <div className="animate-marquee-scroll flex items-center gap-6 text-xs text-slate-300/90 font-semibold tracking-wide select-none">
                    {[
                      'Catálogo amplio',
                      'Bases de datos biomédicas',
                      'Revistas',
                      'Conferencias',
                      'Programa ALFIN',
                      'Sorteo de Libros',
                      'Catálogo amplio',
                      'Bases de datos biomédicas',
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
                      placeholder="Buscar por fármaco, patología, autor o tema biomédico..."
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
                        (*) Servicios biomédicos exclusivos para la comunidad médica URP
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#008744] text-white text-xs font-extrabold uppercase tracking-wider shadow-sm mb-2">
                  <Stethoscope className="w-3.5 h-3.5 text-white" />
                  <span>Colección Científica Especializada</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
                  Recursos Biomédicos Destacados
                </h2>
                <p className="text-sm text-slate-600 mt-0.5">
                  Herramientas clave suscritas por la facultad para diagnóstico, farmacología y soporte clínico.
                </p>
              </div>

              <button
                onClick={() => onNavigate('directory')}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#008744] hover:text-[#00572b] transition-colors self-start sm:self-auto cursor-pointer"
              >
                <span>Ver Catálogo Completo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-7 bg-white rounded-3xl border-2 border-slate-900 shadow-urp-brutal p-6 flex flex-col justify-between relative overflow-hidden group">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 p-2 flex items-center justify-center shrink-0">
                      <img
                        src={getLogo('dynamedex.png')}
                        alt="DynaMedex Logo"
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          if (target.parentElement) {
                            target.parentElement.innerHTML = '<span class="text-xs font-black text-[#008744] font-display">DYNA</span>';
                          }
                        }}
                      />
                    </div>
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-100 text-[#006b35] border border-emerald-200">
                      Suscripción Oficial URP
                    </span>
                  </div>

                  <h3 className="text-xl font-display font-extrabold text-slate-900 mb-2 group-hover:text-[#008744] transition-colors">
                    DynaMedex: Decisiones Clínicas en Tiempo Real
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    Fusión de DynaMed y Micromedex. Accede a monografías de fármacos, calculadoras y guías diagnósticas basadas en evidencia para internado y pases de visita.
                  </p>

                  <div className="space-y-1.5 mb-5 text-xs text-slate-700">
                    <div className="flex items-center gap-2 font-medium">
                      <span className="text-[#008744] font-bold">✓</span>
                      <span>Guías de Práctica Clínica actualizadas</span>
                    </div>
                    <div className="flex items-center gap-2 font-medium">
                      <span className="text-[#008744] font-bold">✓</span>
                      <span>Interacciones Farmacológicas Micromedex</span>
                    </div>
                    <div className="flex items-center gap-2 font-medium">
                      <span className="text-[#008744] font-bold">✓</span>
                      <span>Calculadoras y Algoritmos Clínicos</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => onNavigate('directory')}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#008744] hover:bg-[#00572b] text-white text-xs font-bold shadow-urp-brutal-green tactile-btn-green transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Consultar DynaMedex</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="md:col-span-5 bg-white rounded-3xl border-2 border-slate-900 shadow-urp-brutal p-6 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 p-2 flex items-center justify-center shrink-0">
                      <img
                        src={getLogo('biodigital.png')}
                        alt="BioDigital Logo"
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          if (target.parentElement) {
                            target.parentElement.innerHTML = '<span class="text-xs font-black text-[#008744] font-display">BIO</span>';
                          }
                        }}
                      />
                    </div>
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-100 text-[#006b35] border border-emerald-200">
                      Suscripción Oficial URP
                    </span>
                  </div>

                  <h3 className="text-xl font-display font-extrabold text-slate-900 mb-2 group-hover:text-[#008744] transition-colors">
                    BioDigital Human 3D
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    Disección virtual tridimensional interactiva. Explora la anatomía humana, fisiopatología y estructuras neurovasculares en alta fidelidad.
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => onNavigate('directory')}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#008744] hover:bg-[#00572b] text-white text-xs font-bold shadow-urp-brutal-green tactile-btn-green transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Abrir BioDigital 3D</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="md:col-span-5 bg-white rounded-3xl border-2 border-slate-900 shadow-urp-brutal p-6 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 p-2 flex items-center justify-center shrink-0">
                      <img
                        src={getLogo('clinicalkeyespanol.png')}
                        alt="ClinicalKey Logo"
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          if (target.parentElement) {
                            target.parentElement.innerHTML = '<span class="text-xs font-black text-[#008744] font-display">CK</span>';
                          }
                        }}
                      />
                    </div>
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-100 text-[#006b35] border border-emerald-200">
                      Suscripción Oficial URP
                    </span>
                  </div>

                  <h3 className="text-xl font-display font-extrabold text-slate-900 mb-2 group-hover:text-[#008744] transition-colors">
                    ClinicalKey Español
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    Colección médica completa de Elsevier: tratados de referencia médica, revistas biomédicas y material multimedia clínico.
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => onNavigate('directory')}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#008744] hover:bg-[#00572b] text-white text-xs font-bold shadow-urp-brutal-green tactile-btn-green transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Consultar ClinicalKey</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="md:col-span-7 bg-white rounded-3xl border-2 border-slate-900 shadow-urp-brutal p-6 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 p-2 flex items-center justify-center shrink-0">
                      <img
                        src={getLogo('accessmedicina-espanol.png')}
                        alt="AccessMedicina Logo"
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          if (target.parentElement) {
                            target.parentElement.innerHTML = '<span class="text-xs font-black text-[#008744] font-display">ACC</span>';
                          }
                        }}
                      />
                    </div>
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-100 text-[#006b35] border border-emerald-200">
                      Suscripción Oficial URP
                    </span>
                  </div>

                  <h3 className="text-xl font-display font-extrabold text-slate-900 mb-2 group-hover:text-[#008744] transition-colors">
                    AccessMedicina McGraw-Hill
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    Textos médicos indispensables de formación médica continua, casos clínicos interactivos de ciencias básicas y clínicas, y autoevaluaciones.
                  </p>

                  <div className="space-y-1.5 mb-5 text-xs text-slate-700">
                    <div className="flex items-center gap-2 font-medium">
                      <span className="text-[#008744] font-bold">✓</span>
                      <span>Harrison Principios de Medicina Interna</span>
                    </div>
                    <div className="flex items-center gap-2 font-medium">
                      <span className="text-[#008744] font-bold">✓</span>
                      <span>Goodman &amp; Gilman: Farmacología Médica</span>
                    </div>
                    <div className="flex items-center gap-2 font-medium">
                      <span className="text-[#008744] font-bold">✓</span>
                      <span>Casos Clínicos &amp; Autoevaluaciones USMLE</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => onNavigate('directory')}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#008744] hover:bg-[#00572b] text-white text-xs font-bold shadow-urp-brutal-green tactile-btn-green transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Ingresar a AccessMedicina</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-slate-200 pb-4">
            <div>
              <span className="text-[11px] font-bold text-[#008744] uppercase tracking-wider block">
                COMUNIDAD MÉDICA & ACTIVIDADES
              </span>
              <h3 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                @bib_famurp en Instagram
              </h3>
            </div>
            <a
              href="https://www.instagram.com/bib_famurp/"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
            >
              <span>Seguir a @bib_famurp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsn8AqQ7LQ9a7cpggMBvOo6uUtrDzH-RSxjVguqDpbMJ4HrbR9A-H1tjWOhVwFAkv25jpxu7FRHWcRdVDnJ1GfTbZRBWr_PHq4LnbgDAa95RG2AV2ezQfXz8SULwv-R4d3Gbi2B-8jFLyWcR5p3crJ9W-_QXBYdzRbW_wX5JSeLLCyDFa-MJm0Epzakv-ZBMnnXyLyc1pD5hP3gFleqHJ3gVeZkOZ0PRYN2N4w7CPxz92CiEwdDJU"
                alt="Instalaciones Biblioteca URP"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            <div className="aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoxyVJ9hVxn0zsPakl41qGZYZ3-sp9xMLeBPWGMBHsyurYWXN9At3vpLT2RjXTzre8Fpci-TZL4CWddottiT7jirnRFsqoJE7uJr13rgyTnYfCQDmxPg1JgW9xPo2tioK4-wAMUAXBOX072KwNH70TxRf1mRzxBUg5LQba0by2n-QiFKm4L_GuKRC5Vwqadv5bD76FZKg9Ob6UB4gLqrnBNfXIhHcxdCTN4PYOnJYX-7T7fvaCnUs"
                alt="Talleres ALFIN URP"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            <div className="aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAidUIRZ5AE2f3_TC91yGMET1xv7yiwGPDI56rUABykDP0yC6nE6aHSoR-2gFHBMjKMVlzfsYYq2CvhCxZ9QbYDIqcB5G2tievSZsp1djZ_nA_R0l-lUbmro5718TiyMehlOpVvmaJgfG4H2HMIxA3OyHU0rxbBpE2jhF3wFZVXHdhwDBRkUFpTOYD_GTNX20FemdOC5psYFmq7Ch-j5de0EzCLAMn-V4e20Lb9L76wSe-rNTB6YMY"
                alt="Atención al usuario"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            <div className="aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAF4LTqwOPgPOC1XTyiv340j1CucejKPYS9ZE3vHvhU-AzFWFA8z8ck0ux2u0FlQK2lvvKFUSXiWwzD4QK0wdOglcnmeZBOcUonEUAcPTrzAXFDFdCPHdObHH_cKq5k_dYpmGL_mr7tvzWyRllUWM_XYSQiAOS0irqWGjxUn7G14p80moJFvBYNd7Au9HE0EBT4cUR-65jRBRloFPH3snHRLTDIYW8POsMvIeWIApyvi42lQl-KMKo"
                alt="Colección médica"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-4">
            Síguenos para avisos de horarios especiales en sala, nuevas adquisiciones bibliográficas y convocatorias ALFIN.
          </p>
        </div>
      </section>
    </main>
  );
};
