import React, { useState, useEffect } from 'react';
import { 
  ExternalLink, 
  Database, 
  PlayCircle, 
  Lock, 
  Globe, 
  BookOpen,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import {
  MedicalDatabase,
  getDatabaseLogoUrl,
  resourceService,
  mapApiResourceToMedicalDatabase,
  DatabaseSearchBar,
} from '../features/guides';

export const DirectoryPage: React.FC = () => {
  const [databases, setDatabases] = useState<MedicalDatabase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [licenseFilter, setLicenseFilter] = useState<'all' | 'subscription' | 'open'>('all');
  const [expandedDbIds, setExpandedDbIds] = useState<Set<string>>(new Set());

  const loadLiveDatabases = async () => {
    try {
      setIsLoading(true);
      const apiResources = await resourceService.getResources();
      if (apiResources && apiResources.length > 0) {
        const mapped = apiResources.map(mapApiResourceToMedicalDatabase);
        setDatabases(mapped);
        setIsLiveConnected(true);
      } else {
        setDatabases([]);
        setIsLiveConnected(false);
      }
    } catch {
      setDatabases([]);
      setIsLiveConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLiveDatabases();
  }, []);

  const filteredDbs = databases.filter((db) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      db.title.toLowerCase().includes(q) ||
      db.description.toLowerCase().includes(q) ||
      db.accessType.toLowerCase().includes(q) ||
      db.tags.some((t) => t.toLowerCase().includes(q));

    const matchesLicense =
      licenseFilter === 'all' ||
      (licenseFilter === 'subscription' && db.accessType === 'Suscripción URP') ||
      (licenseFilter === 'open' && db.accessType !== 'Suscripción URP');

    return matchesSearch && matchesLicense;
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
              {db.tags && db.tags.length > 0 ? db.tags.slice(0, 2).join(' • ') : db.accessType}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
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
              <div className={`flex items-center justify-between ${db.hasMobileApp ? 'pb-1.5 border-b border-slate-200/80' : ''}`}>
                <span className="font-bold text-slate-500">Modalidad de Acceso:</span>
                <span className="font-black text-slate-900 flex items-center gap-1">
                  {db.accessType === 'Suscripción URP' ? <Lock className="w-3 h-3 text-[#008744]" /> : <Globe className="w-3 h-3 text-sky-600" />}
                  {db.accessType}
                </span>
              </div>
              {db.hasMobileApp && (
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-500">App Móvil:</span>
                  <span className="font-black text-emerald-700">Disponible (iOS / Android)</span>
                </div>
              )}
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

            {Boolean(db.tutorialUrl) && (
              <div className="bg-white rounded-2xl border-2 border-slate-900 shadow-urp-brutal-sm overflow-hidden mt-1">
                <a
                  href={db.tutorialUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-3 bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-between transition-colors group/tut cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div className="w-8 h-8 rounded-lg bg-[#008744] flex items-center justify-center text-white shrink-0 group-hover/tut:scale-105 transition-transform">
                      <PlayCircle className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 block font-bold">Tutorial Oficial</span>
                      <h5 className="font-bold text-xs truncate">Video Guía de Acceso</h5>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-emerald-400 shrink-0 group-hover/tut:translate-x-0.5 transition-transform" />
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full pb-20">
      <main className="max-w-[1280px] mx-auto px-6 pt-8 sm:pt-10 flex flex-col gap-8">
        <DatabaseSearchBar
          searchTerm={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Buscar recurso por nombre, materia o especialidad..."
          licenseFilter={licenseFilter}
          onLicenseFilterChange={setLicenseFilter}
          suggestions={quickKeywords}
          onSuggestionClick={setSearchQuery}
          variant="hero"
          actionsRight={
            <button 
              type="submit"
              className="px-6 sm:px-8 py-3.5 rounded-2xl bg-[#008744] hover:bg-[#006b35] text-white font-bold text-xs sm:text-sm border-2 border-slate-900 shadow-urp-brutal tactile-btn-green transition-all cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
            >
              <span>Buscar</span>
            </button>
          }
        />

        <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-urp-brutal p-6 sm:p-8 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="font-display font-extrabold text-lg sm:text-2xl text-slate-900">
                  {isLoading
                    ? 'Consultando catálogo activo...'
                    : `Mostrando recursos (${filteredDbs.length}${searchQuery ? ` de ${databases.length}` : ''})`}
                </h3>
                {isLoading && (
                  <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#008744]" />
                    Sincronizando con base de datos...
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Haz clic en cualquier plataforma para desplegar su ficha técnica completa, tutorial de acceso remoto y enlace directo.
              </p>
            </div>
            {!isLoading && filteredDbs.length > 0 && (
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

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded-2xl border-2 border-slate-200 p-4.5 animate-pulse flex items-center justify-between">
                  <div className="space-y-2 flex-1 pr-4">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                  </div>
                  <div className="w-14 h-6 bg-slate-100 rounded-md"></div>
                </div>
              ))}
            </div>
          ) : filteredDbs.length > 0 ? (
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
              <p className="text-xs text-slate-500 mt-1">
                {isLiveConnected
                  ? 'Prueba con otra palabra clave o limpia el campo de búsqueda.'
                  : 'No se pudo establecer conexión con el catálogo de bases de datos biomédicas.'}
              </p>
              {!isLiveConnected && (
                <button
                  type="button"
                  onClick={loadLiveDatabases}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-urp-600 hover:bg-urp-700 transition-colors shadow-sm cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reintentar conexión</span>
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
