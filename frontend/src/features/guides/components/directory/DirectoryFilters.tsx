import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Layers, Smartphone, BookOpen, RefreshCw, RotateCcw } from 'lucide-react';
import { resourceService } from '../../services/resourceService';

export interface DirectoryFiltersProps {
  licenseFilter: 'all' | 'subscription' | 'open';
  onLicenseFilterChange: (value: 'all' | 'subscription' | 'open') => void;
  hasMobileAppFilter: boolean;
  onHasMobileAppFilterChange: (value: boolean) => void;
  selectedMaterias: string[];
  onSelectedMateriasChange: (materias: string[]) => void;
  onResetFilters?: () => void;
}

export const DirectoryFilters: React.FC<DirectoryFiltersProps> = ({
  licenseFilter,
  onLicenseFilterChange,
  hasMobileAppFilter,
  onHasMobileAppFilterChange,
  selectedMaterias,
  onSelectedMateriasChange,
  onResetFilters,
}) => {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isLicenseOpen, setIsLicenseOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(true);
  const [isMateriasOpen, setIsMateriasOpen] = useState(false);
  const [materias, setMaterias] = useState<string[]>([]);
  const [isLoadingMaterias, setIsLoadingMaterias] = useState(false);
  const [hasLoadedMaterias, setHasLoadedMaterias] = useState(false);

  const hasActiveFilters =
    licenseFilter !== 'all' || hasMobileAppFilter || selectedMaterias.length > 0;

  const handleToggleMaterias = async () => {
    const nextState = !isMateriasOpen;
    setIsMateriasOpen(nextState);

    if (nextState && !hasLoadedMaterias && !isLoadingMaterias) {
      setIsLoadingMaterias(true);
      try {
        const data = await resourceService.getMaterias();
        setMaterias(data);
        setHasLoadedMaterias(true);
      } catch {
        setMaterias([]);
      } finally {
        setIsLoadingMaterias(false);
      }
    }
  };

  const handleMateriaCheckbox = (materia: string) => {
    if (selectedMaterias.includes(materia)) {
      onSelectedMateriasChange(selectedMaterias.filter((m) => m !== materia));
    } else {
      onSelectedMateriasChange([...selectedMaterias, materia]);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className="flex items-center gap-2 text-left font-display font-bold text-sm text-slate-900 hover:text-[#008744] transition-colors cursor-pointer"
        >
          <span>Filtros</span>
          {isPanelOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {hasActiveFilters && onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1 text-[11px] font-bold text-[#008744] hover:underline cursor-pointer"
            title="Restablecer todos los filtros"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      {isPanelOpen && (
        <div className="p-4 flex flex-col gap-5">
          <div className="border-b border-slate-200 pb-4">
            <button
              type="button"
              onClick={() => setIsLicenseOpen(!isLicenseOpen)}
              className="w-full flex items-center justify-between text-left font-display font-bold text-xs uppercase tracking-wider text-slate-800 hover:text-[#008744] transition-colors cursor-pointer py-1"
            >
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#008744]" />
                Tipo de licencia
              </span>
              {isLicenseOpen ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            {isLicenseOpen && (
              <div className="mt-2.5 flex flex-col gap-2 pl-1">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 hover:text-[#008744] transition-colors">
                  <input
                    type="checkbox"
                    checked={licenseFilter === 'all'}
                    onChange={() => onLicenseFilterChange('all')}
                    className="w-4 h-4 rounded border-slate-300 text-[#008744] focus:ring-[#008744] accent-[#008744] cursor-pointer"
                  />
                  <span className="font-medium">Todas las licencias</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 hover:text-[#008744] transition-colors">
                  <input
                    type="checkbox"
                    checked={licenseFilter === 'subscription'}
                    onChange={() => onLicenseFilterChange(licenseFilter === 'subscription' ? 'all' : 'subscription')}
                    className="w-4 h-4 rounded border-slate-300 text-[#008744] focus:ring-[#008744] accent-[#008744] cursor-pointer"
                  />
                  <span className="font-medium">Suscripción URP</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 hover:text-[#008744] transition-colors">
                  <input
                    type="checkbox"
                    checked={licenseFilter === 'open'}
                    onChange={() => onLicenseFilterChange(licenseFilter === 'open' ? 'all' : 'open')}
                    className="w-4 h-4 rounded border-slate-300 text-[#008744] focus:ring-[#008744] accent-[#008744] cursor-pointer"
                  />
                  <span className="font-medium">Acceso Abierto</span>
                </label>
              </div>
            )}
          </div>

          <div className="border-b border-slate-200 pb-4">
            <button
              type="button"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="w-full flex items-center justify-between text-left font-display font-bold text-xs uppercase tracking-wider text-slate-800 hover:text-[#008744] transition-colors cursor-pointer py-1"
            >
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-[#008744]" />
                App Móvil
              </span>
              {isMobileOpen ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            {isMobileOpen && (
              <div className="mt-2.5 pl-1">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 hover:text-[#008744] transition-colors">
                  <input
                    type="checkbox"
                    checked={hasMobileAppFilter}
                    onChange={(e) => onHasMobileAppFilterChange(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#008744] focus:ring-[#008744] accent-[#008744] cursor-pointer"
                  />
                  <span className="font-medium">Solo con App Móvil</span>
                </label>
              </div>
            )}
          </div>

          <div>
            <button
              type="button"
              onClick={handleToggleMaterias}
              className="w-full flex items-center justify-between text-left font-display font-bold text-xs uppercase tracking-wider text-slate-800 hover:text-[#008744] transition-colors cursor-pointer py-1"
            >
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#008744]" />
                Filtrar Por Materias
              </span>
              {isMateriasOpen ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            {isMateriasOpen && (
              <div className="mt-2.5 pl-1">
                {isLoadingMaterias ? (
                  <div className="py-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#008744]" />
                    <span>Cargando materias...</span>
                  </div>
                ) : materias.length === 0 ? (
                  <p className="text-xs text-slate-400 py-2">No hay materias disponibles.</p>
                ) : (
                  <div className="max-h-60 overflow-y-auto pr-1 flex flex-col gap-2">
                    {materias.map((materia) => {
                      const isChecked = selectedMaterias.includes(materia);
                      return (
                        <label
                          key={materia}
                          className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 hover:text-[#008744] transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleMateriaCheckbox(materia)}
                            className="w-4 h-4 rounded border-slate-300 text-[#008744] focus:ring-[#008744] accent-[#008744] cursor-pointer shrink-0"
                          />
                          <span className="truncate font-medium">{materia}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
