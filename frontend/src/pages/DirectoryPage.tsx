import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  Database, 
  PlayCircle, 
  Lock, 
  Globe, 
  X,
  BookOpen,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import { DATABASES_DATA, MedicalDatabase, getDatabaseLogoUrl } from '../features/guides/data/databasesData';
import { resourceService } from '../features/guides/services/resourceService';
import { mapApiResourceToMedicalDatabase } from '../features/guides/utils/resourceAdapter';

export const DirectoryPage: React.FC = () => {
  const [databases, setDatabases] = useState<MedicalDatabase[]>(DATABASES_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDbIds, setExpandedDbIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let isMounted = true;
    const loadLiveDatabases = async () => {
      try {
        setIsLoading(true);
        const apiResources = await resourceService.getResources();
        if (isMounted && apiResources && apiResources.length > 0) {
          const mapped = apiResources.map(mapApiResourceToMedicalDatabase);
          setDatabases(mapped);
          setIsLiveConnected(true);
        }
      } catch {
        if (isMounted) {
          setDatabases(DATABASES_DATA);
          setIsLiveConnected(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadLiveDatabases();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredDbs = databases.filter((db) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      db.title.toLowerCase().includes(q) ||
      db.description.toLowerCase().includes(q) ||
      db.category.toLowerCase().includes(q) ||
      db.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  const col1DbsLg = filteredDbs.filter((_, i) => i % 3 === 0);
  const col2DbsLg = filteredDbs.filter((_, i) => i % 3 === 1);
  const col3DbsLg = filteredDbs.filter((_, i) => i % 3 === 2);

  const col1DbsMd = filteredDbs.filter((_, i) => i % 2 === 0);
  const col2DbsMd = filteredDbs.filter((_, i) => i % 2 !== 0);

  const toggleExpand = (id: string) => {
    setExpandedDbIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExpandAllToggle = () => {
    if (expandedDbIds.size === filteredDbs.length) {
      setExpandedDbIds(new Set());
    } else {
      setExpandedDbIds(new Set(filteredDbs.map((d) => d.id)));
    }
  };

  const quickKeywords = [
    'ClinicalKey',
    'UpToDate',
    'Scopus',
    'PubMed',
    'Anatomía',
    'Farmacología',
    'Elsevier'
  ];

  const renderDatabaseCard = (db: MedicalDatabase) => {
    const isExpanded = expandedDbIds.has(db.id);
    const logoSrc = getDatabaseLogoUrl(db.logoFile);

    return (
      <div
        key={db.id}
        className={`rounded-2xl transition-all duration-300 border-2 overflow-hidden ${
          isExpanded
            ? 'bg-white border-slate-900 shadow-urp-brutal'
            : 'bg-white border-slate-200 hover:border-slate-900 hover:shadow-urp-brutal-sm'
        }`}
      >
        <div
          onClick={() => toggleExpand(db.id)}
          className="p-4 sm:p-4.5 flex items-center justify-between cursor-pointer select-none group"
        >
          <div className="min-w-0 pr-3">
            <h4 className={`text-xs sm:text-sm font-bold transition-colors truncate ${
              isExpanded ? 'text-[#008744]' : 'text-slate-900 group-hover:text-[#008744]'
            }`}>
              {db.title}
            </h4>
            <span className="text-[11px] text-slate-500 font-medium block truncate mt-0.5">
              {db.category}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-[10px] sm:text-[11px] font-extrabold px-2.5 py-1 rounded-md border ${
              db.accessType === 'Suscripción URP'
                ? 'bg-emerald-50 text-[#008744] border-emerald-300'
                : 'bg-sky-50 text-sky-700 border-sky-300'
            }`}>
              {db.accessType === 'Suscripción URP' ? '🔐 URP' : '🌐 OPEN'}
            </span>
            <div className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-transform duration-300 ${
              isExpanded 
                ? 'rotate-180 bg-[#008744] text-white border-[#008744]' 
                : 'bg-slate-50 text-slate-400 border-slate-200 group-hover:border-slate-900 group-hover:text-slate-900'
            }`}>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="px-4 pb-5 sm:px-6 sm:pb-6 pt-3 border-t-2 border-slate-100 flex flex-col gap-4">
            <div className="flex justify-center items-center h-24 p-3 bg-slate-50/80 border-2 border-slate-200 rounded-2xl shadow-inner">
              {logoSrc ? (
                <img 
                  src={logoSrc} 
                  alt={db.title} 
                  className="max-h-14 max-w-full object-contain"
                />
              ) : (
                <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                  <Database className="w-5 h-5 text-[#008744]" />
                  <span>{db.title}</span>
                </div>
              )}
            </div>

            <div>
              <div className="flex gap-1.5 flex-wrap mb-2.5">
                {db.tags.map((tag, idx) => (
                  <span 
                    key={idx}
                    className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md text-[10px] font-bold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {db.description}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80">
                <span className="font-bold text-slate-500">Modalidad de Acceso:</span>
                <span className="font-black text-slate-900 flex items-center gap-1">
                  {db.accessType === 'Suscripción URP' ? <Lock className="w-3 h-3 text-[#008744]" /> : <Globe className="w-3 h-3 text-sky-600" />}
                  {db.accessType}
                </span>
              </div>
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80">
                <span className="font-bold text-slate-500">Categoría:</span>
                <span className="font-black text-slate-900">{db.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-500">Afiliación:</span>
                <span className="font-black text-[#008744] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Facultad de Medicina URP
                </span>
              </div>
            </div>

            <a
              href={db.accessUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-full py-3 px-5 rounded-xl bg-[#008744] hover:bg-[#006b35] text-white font-bold text-xs sm:text-sm shadow-urp-brutal-green tactile-btn-green transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{db.accessType === 'Suscripción URP' ? 'Acceder vía Intranet URP' : 'Ir a la Base de Datos'}</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <div className="bg-white rounded-2xl border-2 border-slate-900 shadow-urp-brutal-sm overflow-hidden mt-1">
              <div 
                className="bg-cover bg-center w-full h-36 relative group cursor-pointer"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80')`
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (db.tutorialUrl) {
                    window.open(db.tutorialUrl, '_blank');
                  } else {
                    alert(`Guía de uso para ${db.title}: Ingresa con tus credenciales URP en https://test.urp.edu.pe/Intranet/.`);
                  }
                }}
              >
                <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/50 transition-colors flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-white/90 group-hover:scale-110 group-hover:bg-white transition-all flex items-center justify-center text-[#008744] shadow-md">
                    <PlayCircle className="w-7 h-7" />
                  </div>
                </div>
                <span className="absolute bottom-2.5 right-2.5 bg-slate-900/90 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-md">
                  2:15 MIN
                </span>
              </div>
              <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-white">Tutorial de Acceso Remoto</h4>
                  <span className="text-[10px] text-slate-400">Guía paso a paso para estudiantes y docentes</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-[#8cf9a9]" />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full pb-20">
      <main className="max-w-[1280px] mx-auto px-6 pt-8 sm:pt-10 flex flex-col gap-8">
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-3">
          <form 
            onSubmit={(e) => e.preventDefault()} 
            className="w-full flex items-center gap-2.5 sm:gap-3"
          >
            <div className="relative flex-1 bg-white rounded-2xl border-2 border-slate-900 shadow-urp-brutal-sm px-4 py-3 flex items-center gap-2.5">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar recurso por nombre, materia o especialidad..."
                className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-transparent outline-none font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer transition-colors shrink-0"
                  title="Limpiar búsqueda"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button 
              type="submit"
              className="px-6 sm:px-8 py-3.5 rounded-2xl bg-[#008744] hover:bg-[#006b35] text-white font-bold text-xs sm:text-sm border-2 border-slate-900 shadow-urp-brutal tactile-btn-green transition-all cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
            >
              <span>Buscar</span>
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#008744]" />
              Sugerencias:
            </span>
            {quickKeywords.map((kw) => (
              <button
                key={kw}
                type="button"
                onClick={() => setSearchQuery(kw)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-semibold ${
                  searchQuery.toLowerCase() === kw.toLowerCase()
                    ? 'bg-[#008744] text-white border-[#008744]'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-900 hover:text-slate-900 shadow-2xs'
                }`}
              >
                {kw}
              </button>
            ))}
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-bold hover:bg-rose-100 transition-colors cursor-pointer"
              >
                Ver todos
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-urp-brutal p-6 sm:p-8 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="font-display font-extrabold text-lg sm:text-2xl text-slate-900">
                  Mostrando recursos ({filteredDbs.length})
                </h3>
                {isLiveConnected && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-[#00572B] border border-emerald-300 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-[#008744] animate-pulse" />
                    EN VIVO
                  </span>
                )}
                {isLoading && (
                  <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#008744]" />
                    Sincronizando...
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Haz clic en cualquier plataforma para desplegar su ficha técnica completa, tutorial de acceso remoto y enlace directo.
              </p>
            </div>
            {filteredDbs.length > 0 && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleExpandAllToggle}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-300 hover:border-slate-900 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                >
                  {expandedDbIds.size === filteredDbs.length ? 'Colapsar todos' : 'Expandir todos'}
                </button>
              </div>
            )}
          </div>

          {filteredDbs.length > 0 ? (
            <>
              <div className="hidden lg:grid lg:grid-cols-3 gap-4 items-start">
                <div className="flex flex-col gap-4">
                  {col1DbsLg.map(renderDatabaseCard)}
                </div>
                <div className="flex flex-col gap-4">
                  {col2DbsLg.map(renderDatabaseCard)}
                </div>
                <div className="flex flex-col gap-4">
                  {col3DbsLg.map(renderDatabaseCard)}
                </div>
              </div>

              <div className="hidden md:grid md:grid-cols-2 lg:hidden gap-4 items-start">
                <div className="flex flex-col gap-4">
                  {col1DbsMd.map(renderDatabaseCard)}
                </div>
                <div className="flex flex-col gap-4">
                  {col2DbsMd.map(renderDatabaseCard)}
                </div>
              </div>

              <div className="flex flex-col gap-4 md:hidden">
                {filteredDbs.map(renderDatabaseCard)}
              </div>
            </>
          ) : (
            <div className="py-16 text-center text-slate-500">
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-base font-bold text-slate-800">No se encontraron recursos</p>
              <p className="text-xs text-slate-500 mt-1">Prueba con otra palabra clave o limpia el campo de búsqueda.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
