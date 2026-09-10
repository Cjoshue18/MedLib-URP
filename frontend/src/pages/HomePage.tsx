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

interface HomePageProps {
  onNavigate: (view: 'home' | 'directory' | 'conferences' | 'lost-found') => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState<'todos' | 'bases' | 'revistas' | 'alfin'>('todos');
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

  // Dynamic logos via Vite import.meta.url
  const getLogo = (filename: string) => 
    new URL(`../assets/logos/${filename}`, import.meta.url).href;

  return (
    <main className="w-full bg-[#f8fafc] text-slate-900 overflow-hidden">
      
      {/* =========================================================================
          HERO SECTION: Anti-AI Asymmetric Split Layout
          Inspirado en urp.edu.pe y el formulario oficial de Admisión URP
          ========================================================================= */}
      <section className="relative bg-[#12161a] text-white pt-10 pb-20 px-6 sm:px-8 border-b-4 border-[#008744] overflow-hidden">
        {/* Subtle grid background pattern */}
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-40 pointer-events-none"></div>

        {/* Ambient emerald radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#008744]/15 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-[1280px] mx-auto relative z-10">
          
          {/* Top Identity Bar (Pastillas SUNEDU/IAC removidas, Portal Oficial para Estudiantes) */}
          <div className="flex items-center justify-between gap-3 mb-8 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#00a859] animate-pulse"></span>
              <span className="font-semibold tracking-wider uppercase">PORTAL OFICIAL PARA ESTUDIANTES — BIBLIOTECA FMH URP</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span>Universidad Ricardo Palma</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Bold Typographic Statement & Integrated Search */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="space-y-4">
                {/* Pastilla no translúcida: Color puro sólido de alto contraste */}
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

              {/* Integrated Biomedical Search */}
              <div className="bg-[#1e242c] p-3 sm:p-4 rounded-2xl border-2 border-white/15 shadow-2xl">
                {/* Search category filters (Sin conteos rígidos) */}
                <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setSearchCategory('todos')}
                    className={`px-3 py-1 rounded-full font-semibold transition-colors shrink-0 cursor-pointer ${
                      searchCategory === 'todos' 
                        ? 'bg-[#008744] text-white shadow-sm' 
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    Todo el catálogo
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchCategory('bases')}
                    className={`px-3 py-1 rounded-full font-semibold transition-colors shrink-0 cursor-pointer ${
                      searchCategory === 'bases' 
                        ? 'bg-[#008744] text-white shadow-sm' 
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    Bases de Datos Biomédicas
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchCategory('revistas')}
                    className={`px-3 py-1 rounded-full font-semibold transition-colors shrink-0 cursor-pointer ${
                      searchCategory === 'revistas' 
                        ? 'bg-[#008744] text-white shadow-sm' 
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    Revistas & Libros
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchCategory('alfin')}
                    className={`px-3 py-1 rounded-full font-semibold transition-colors shrink-0 cursor-pointer ${
                      searchCategory === 'alfin' 
                        ? 'bg-[#008744] text-white shadow-sm' 
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    Talleres ALFIN
                  </button>
                </div>

                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar por fármaco, patología, autor o tema biomédico..."
                      className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 rounded-xl border border-slate-300 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#00a859]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#008744] hover:bg-[#006b35] text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-urp-brutal-green tactile-btn-green flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <span>Buscar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Redes Sociales Oficiales: Sin pastillas, iconos auténticos, coloridos y directos */}
              <div className="flex items-center gap-4 pt-1 pl-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Síguenos en:
                </span>
                <div className="flex items-center gap-4">
                  {/* Facebook Oficial FAMURP */}
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

                  {/* Instagram Oficial Biblioteca FAMURP */}
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

            </div>

            {/* Right Column: Toggleable Hero Form with Slim Pill Trigger */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              {!isHeroFormOpen ? (
                /* Pastilla de alto medio y anchura delgada que al hacer click abre el formulario */
                <button
                  type="button"
                  onClick={() => setIsHeroFormOpen(true)}
                  className="group relative w-48 sm:w-52 h-64 sm:h-72 rounded-3xl bg-gradient-to-b from-[#008744] via-[#006b35] to-[#004722] p-5 text-white border-2 border-white/20 shadow-2xl flex flex-col items-center justify-between text-center cursor-pointer hover:border-[#8cf9a9] hover:scale-105 active:scale-95 transition-all duration-300 tactile-btn-green"
                  aria-label="Abrir formulario de boletín y acceso directo"
                >
                  {/* Subtle top indicator */}
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8cf9a9]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8cf9a9] animate-ping"></span>
                    <span>Acceso Directo</span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/25 flex items-center justify-center text-white shadow-md group-hover:rotate-6 group-hover:scale-110 transition-transform">
                      <Mail className="w-7 h-7 text-[#8cf9a9]" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-display font-black leading-tight tracking-tight">
                        Boletín &amp; Novedades
                      </h3>
                      <p className="text-[11px] text-slate-200 mt-1 leading-snug">
                        Alertas y soporte FMH URP
                      </p>
                    </div>
                  </div>

                  {/* Bottom call to action pill */}
                  <div className="w-full py-2 px-3 rounded-xl bg-black/25 backdrop-blur-xs border border-white/20 flex items-center justify-center gap-1.5 text-xs font-bold text-white group-hover:bg-[#8cf9a9] group-hover:text-slate-950 transition-colors">
                    <span>Abrir Formulario</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ) : (
                /* Signature URP Admissions-Style Card con animación de aparición suave y botón cerrar */
                <div className="relative w-full max-w-sm bg-white rounded-3xl border-2 border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                  
                  {/* Institutional Green Header with URP Gradient, Anniversary Badge & Close Button */}
                  <div className="bg-gradient-to-r from-[#00572B] via-[#008744] to-[#00A859] p-5 text-white flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold tracking-widest uppercase text-[#8cf9a9] block mb-0.5">
                        FACULTAD DE MEDICINA HUMANA
                      </span>
                      <h2 className="text-lg sm:text-xl font-display font-black leading-tight">
                        ¡ACCESO DIRECTO <br />AL CONOCIMIENTO!
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right flex flex-col items-center bg-black/20 backdrop-blur-xs px-2.5 py-1.5 rounded-xl border border-white/20">
                        <span className="text-2xl font-black leading-none text-white">57</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#8cf9a9]">Años URP</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsHeroFormOpen(false)}
                        className="w-8 h-8 rounded-full bg-black/25 hover:bg-black/45 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
                        title="Cerrar formulario"
                        aria-label="Cerrar formulario"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Card Body: Unified Form & Actions */}
                  <div className="p-5 text-slate-900 space-y-4">
                    
                    {/* Selector de Nivel Académico (Pregrado / Posgrado / Residentado) */}
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

                    {/* Formulario de Boletín Institucional integrado */}
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

                    {/* Highlight de Beneficio */}
                    <div className="text-xs pt-0.5">
                      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <ShieldCheck className="w-4 h-4 text-[#008744] shrink-0 mt-0.5" />
                        <span className="text-slate-600 leading-snug">Acceso con cuenta institucional a literatura científica y soporte clínico.</span>
                      </div>
                    </div>

                    {/* Botón de Acceso a Bases de Datos */}
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
              )}
            </div>

          </div>
        </div>
      </section>


      {/* =========================================================================
          MAIN BODY LAYOUT: 2/3 (Recursos Biomédicos) + 1/3 (Próximas Actividades)
          Organización en paralelo tal como solicitó el usuario
          ========================================================================= */}
      <section className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* =====================================================================
              LEFT COLUMN (7 cols): Recursos Biomédicos Destacados
              ===================================================================== */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Header del bloque de Recursos */}
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

            {/* Asymmetrical Bento Grid: Row 1 (Dyna 7 cols, Bio 5 cols) / Row 2 (ClinicalKey 5 cols, AccessMedicina 7 cols) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Row 1, Col 1: DynaMedex (Dominante 7 cols - Soporte Clínico Integral) */}
              <div className="md:col-span-7 bg-white rounded-3xl border-2 border-slate-900 shadow-urp-brutal p-6 flex flex-col justify-between relative overflow-hidden group">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 p-2 flex items-center justify-center shrink-0">
                      <img
                        src={getLogo('dynamedex.png')}
                        alt="DynaMedex Logo"
                        className="max-h-full max-w-full object-contain"
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

                  {/* Checklist limpio sin pastillas */}
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

              {/* Row 1, Col 2: BioDigital Human 3D (Especializado 5 cols - Anatomía Visual) */}
              <div className="md:col-span-5 bg-white rounded-3xl border-2 border-slate-900 shadow-urp-brutal p-6 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 p-2 flex items-center justify-center shrink-0">
                      <img
                        src={getLogo('biodigital.png')}
                        alt="BioDigital Logo"
                        className="max-h-full max-w-full object-contain"
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

              {/* Row 2, Col 1: ClinicalKey Español (5 cols - Biblioteca Elsevier) */}
              <div className="md:col-span-5 bg-white rounded-3xl border-2 border-slate-900 shadow-urp-brutal p-6 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 p-2 flex items-center justify-center shrink-0">
                      <img
                        src={getLogo('clinicalkeyespanol.png')}
                        alt="ClinicalKey Logo"
                        className="max-h-full max-w-full object-contain"
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

              {/* Row 2, Col 2: AccessMedicina McGraw-Hill (7 cols - Núcleo de Textos y Casos Clínicos) */}
              <div className="md:col-span-7 bg-white rounded-3xl border-2 border-slate-900 shadow-urp-brutal p-6 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 p-2 flex items-center justify-center shrink-0">
                      <img
                        src={getLogo('accessmedicina-espanol.png')}
                        alt="AccessMedicina Logo"
                        className="max-h-full max-w-full object-contain"
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

                  {/* Checklist limpio sin pastillas */}
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


          {/* =====================================================================
              RIGHT COLUMN (5 cols): Próximas Actividades & ALFIN (Estilo limpio como en captura)
              ===================================================================== */}
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
                  
                  {/* Actividad 1 */}
                  <div 
                    onClick={() => onNavigate('conferences')}
                    className="flex items-center gap-4 cursor-pointer group py-1"
                  >
                    {/* Date Badge: Espacio cuadrado y amplio, no aplastado */}
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

                  {/* Raya centrada en el medio con opacidad baja */}
                  <div className="w-4/5 mx-auto border-t border-slate-200/60"></div>

                  {/* Actividad 2 */}
                  <div 
                    onClick={() => onNavigate('conferences')}
                    className="flex items-center gap-4 cursor-pointer group py-1"
                  >
                    {/* Date Badge: Espacio cuadrado y amplio */}
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

                  {/* Raya centrada en el medio con opacidad baja */}
                  <div className="w-4/5 mx-auto border-t border-slate-200/60"></div>

                  {/* Actividad 3 (Máximo 3 actividades) */}
                  <div 
                    onClick={() => onNavigate('conferences')}
                    className="flex items-center gap-4 cursor-pointer group py-1"
                  >
                    {/* Date Badge: Espacio cuadrado y amplio */}
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


      {/* =========================================================================
          COMMUNITY SECTION: Feed de Instagram de la Biblioteca
          ========================================================================= */}
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

          {/* Asymmetrical Photo Cards */}
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
