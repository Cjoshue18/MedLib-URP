import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { BookOpen, RefreshCw } from 'lucide-react';
import {
  MedicalDatabase,
  resourceService,
  mapApiResourceToMedicalDatabase,
  DatabaseSearchBar,
  DatabaseSkeletonGrid,
  DatabaseAccordionCard,
  DatabaseMasonry,
  DEFAULT_KEY_PLATFORMS,
} from '../features/guides';
import { normalizeText } from '../utils/textUtils';

interface DirectoryPageProps {
  initialSearchQuery?: string;
}

export const DirectoryPage: React.FC<DirectoryPageProps> = ({ initialSearchQuery = '' }) => {
  const [databases, setDatabases] = useState<MedicalDatabase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSkeletonExiting, setIsSkeletonExiting] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const skeletonTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [licenseFilter, setLicenseFilter] = useState<'all' | 'subscription' | 'open'>('all');
  const [expandedDbIds, setExpandedDbIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (initialSearchQuery !== undefined) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  useEffect(() => {
    return () => {
      if (skeletonTimerRef.current) {
        clearTimeout(skeletonTimerRef.current);
      }
    };
  }, []);

  const loadLiveDatabases = useCallback(async () => {
    try {
      setIsLoading(true);
      setShowSkeleton(true);
      setIsSkeletonExiting(false);
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
      setIsSkeletonExiting(true);
      if (skeletonTimerRef.current) {
        clearTimeout(skeletonTimerRef.current);
      }
      skeletonTimerRef.current = setTimeout(() => {
        setShowSkeleton(false);
        setIsSkeletonExiting(false);
      }, 350);
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

  const quickKeywords = useMemo(() => {
    if (!databases || databases.length === 0) return [];

    const tagCounts = new Map<string, number>();

    databases.forEach((db) => {
      db.tags.forEach((rawTag) => {
        const tag = rawTag.trim();
        if (!tag || normalizeText(tag) === 'medicina humana') return;
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    DEFAULT_KEY_PLATFORMS.forEach((platform) => {
      const matchCount = databases.filter((db) =>
        normalizeText(db.title).includes(normalizeText(platform)) ||
        db.tags.some((t) => normalizeText(t).includes(normalizeText(platform)))
      ).length;
      if (matchCount > 0) {
        tagCounts.set(platform, Math.max(tagCounts.get(platform) || 0, matchCount));
      }
    });

    return Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'es'))
      .map(([keyword]) => keyword)
      .slice(0, 8);
  }, [databases]);

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
              className="px-6 sm:px-8 py-3.5 rounded-lg bg-[#008744] hover:bg-[#006b35] text-white font-bold text-xs sm:text-sm shadow-urp-brutal-green tactile-btn-green transition-all cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
            >
              <span>Buscar</span>
            </button>
          }
        />

        <div className="bg-white rounded-lg border-2 border-slate-900 shadow-urp-brutal p-6 sm:p-8 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="font-display font-extrabold text-lg sm:text-2xl text-slate-900 flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <span>Cargando...</span>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#008744]" />
                    </>
                  ) : (
                    `Mostrando recursos (${filteredDbs.length}${searchQuery ? ` de ${databases.length}` : ''})`
                  )}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Haz clic en cualquier plataforma para desplegar su ficha técnica completa, tutorial de acceso remoto y enlace directo.
              </p>
            </div>
          </div>

          <div className="relative w-full min-h-[300px]">
            {showSkeleton && (
              <div
                className={`w-full transition-opacity duration-300 ease-out ${
                  isSkeletonExiting
                    ? 'absolute inset-0 z-10 pointer-events-none opacity-0'
                    : 'relative z-0 opacity-100'
                }`}
              >
                <DatabaseSkeletonGrid count={9} />
              </div>
            )}

            {!isLoading && filteredDbs.length > 0 && (
              <div className="w-full transition-opacity duration-300 ease-out opacity-100">
                <DatabaseMasonry
                  items={filteredDbs}
                  renderItem={renderCard}
                  ease="power2.out"
                  duration={0.5}
                  stagger={0.03}
                  animateFrom="bottom"
                  blurToFocus={true}
                />
              </div>
            )}

            {!isLoading && filteredDbs.length === 0 && (
              <div className="py-16 text-center text-slate-500">
                <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <p className="text-base font-bold text-slate-800">No se encontraron recursos</p>
                <p className="text-xs text-slate-500 mt-1">
                  {isLiveConnected
                    ? 'Prueba con otra palabra clave o limpia el campo de búsqueda.'
                    : 'No se pudo establecer conexión con el catálogo de bases de datos médicas.'}
                </p>
                {!isLiveConnected && (
                  <button
                    type="button"
                    onClick={loadLiveDatabases}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-urp-600 hover:bg-urp-700 transition-colors shadow-sm cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reintentar conexión</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
