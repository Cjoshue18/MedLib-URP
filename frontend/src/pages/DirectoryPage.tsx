import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, RefreshCw } from 'lucide-react';
import {
  MedicalDatabase,
  resourceService,
  mapApiResourceToMedicalDatabase,
  DatabaseSearchBar,
  DatabaseSkeletonGrid,
  DatabaseAccordionCard,
} from '../features/guides';

interface DirectoryPageProps {
  initialSearchQuery?: string;
}

export const DirectoryPage: React.FC<DirectoryPageProps> = ({ initialSearchQuery = '' }) => {
  const [databases, setDatabases] = useState<MedicalDatabase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [licenseFilter, setLicenseFilter] = useState<'all' | 'subscription' | 'open'>('all');
  const [expandedDbIds, setExpandedDbIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (initialSearchQuery !== undefined) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  const loadLiveDatabases = useCallback(async () => {
    try {
      setIsLoading(true);
      const apiResources = await resourceService.getResources(true);
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
  }, []);

  useEffect(() => {
    loadLiveDatabases();
  }, [loadLiveDatabases]);

  const handleDetailLoaded = (updated: MedicalDatabase) => {
    setDatabases((prev) =>
      prev.map((d) => (d.id === updated.id ? updated : d))
    );
  };

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

  const normalizeText = (str: string): string => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  };

  const filteredDbs = databases.filter((db) => {
    const q = normalizeText(searchQuery);
    const matchesSearch =
      !q ||
      normalizeText(db.title).includes(q) ||
      normalizeText(db.description).includes(q) ||
      normalizeText(db.accessType).includes(q) ||
      db.tags.some((t) => normalizeText(t).includes(q));

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

  const quickKeywords = [
    'ClinicalKey',
    'UpToDate',
    'Scopus',
    'PubMed',
    'Anatomía',
    'Farmacología',
    'Elsevier',
  ];

  const renderCard = (db: MedicalDatabase) => (
    <DatabaseAccordionCard
      key={db.id}
      database={db}
      isExpanded={expandedDbIds.has(db.id)}
      onToggle={() => toggleExpand(db.id)}
      onDetailLoaded={handleDetailLoaded}
    />
  );

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
          </div>

          {isLoading ? (
            <DatabaseSkeletonGrid count={9} />
          ) : filteredDbs.length > 0 ? (
            <>
              <div className="hidden lg:grid lg:grid-cols-3 gap-4 items-start">
                <div className="flex flex-col gap-4">
                  {col1DbsLg.map(renderCard)}
                </div>
                <div className="flex flex-col gap-4">
                  {col2DbsLg.map(renderCard)}
                </div>
                <div className="flex flex-col gap-4">
                  {col3DbsLg.map(renderCard)}
                </div>
              </div>

              <div className="hidden md:grid md:grid-cols-2 lg:hidden gap-4 items-start">
                <div className="flex flex-col gap-4">
                  {col1DbsMd.map(renderCard)}
                </div>
                <div className="flex flex-col gap-4">
                  {col2DbsMd.map(renderCard)}
                </div>
              </div>

              <div className="flex flex-col gap-4 md:hidden">
                {filteredDbs.map(renderCard)}
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
