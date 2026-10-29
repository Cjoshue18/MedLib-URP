import React, { useState } from 'react';
import { ChevronDown, Layers, Smartphone, BookOpen, RefreshCw, RotateCcw } from 'lucide-react';
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
      <div
        className={`px-4 py-3 transition-colors duration-200 flex items-center justify-between ${
          isPanelOpen
            ? 'bg-[#008744] text-white border-b border-[#007A3D]'
            : 'bg-white text-slate-900'
        }`}
      >
        <button
          type="button"
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className="w-full flex items-center justify-between text-left font-display font-bold text-sm cursor-pointer"
        >
          <span className={isPanelOpen ? 'text-white' : 'text-slate-900 hover:text-[#008744] transition-colors'}>
            Filtros
          </span>
          <div className="flex items-center gap-2.5">
            {hasActiveFilters && onResetFilters && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  onResetFilters();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    onResetFilters();
                  }
                }}
                className={`flex items-center gap-1 text-[11px] font-bold cursor-pointer hover:underline ${
                  isPanelOpen ? 'text-white' : 'text-[#008744]'
                }`}
                title="Restablecer todos los filtros"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Limpiar</span>
              </span>
            )}
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                isPanelOpen ? 'rotate-180 text-white' : 'text-slate-600'
              }`}
            />
          </div>
        </button>
      </div>

      {isPanelOpen && (
        <div className="p-4 flex flex-col gap-5">
          <div className="border-b border-slate-200 pb-4">
            <button
              type="button"
              onClick={() => setIsLicenseOpen(!isLicenseOpen)}
              className="w-full flex items-center justify-between text-left font-display font-bold text-xs uppercase tracking-wider text-slate-800 hover:text-[#008744] transition-colors cursor-pointer py-1 group"
            >
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#008744]" />
                Tipo de licencia
              </span>
              <div
                className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all duration-300 ${
                  isLicenseOpen
                    ? 'rotate-180 bg-[#008744] text-white border-[#008744]'
                    : 'bg-white text-slate-400 border-slate-200 group-hover:border-slate-300 group-hover:text-slate-700'
                }`}
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </button>

            {isLicenseOpen && (
              <div className="mt-2.5 flex flex-col gap-2 pl-1">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 hover:text-[#008744] transition-colors">
                  <input
                    type="radio"
                    name="licenseFilter"
                    value="all"
                    checked={licenseFilter === 'all'}
                    onChange={() => onLicenseFilterChange('all')}
                    className="w-4 h-4 text-[#008744] focus:ring-[#008744] accent-[#008744] cursor-pointer"
                  />
                  <span className="font-medium">Todas las licencias</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 hover:text-[#008744] transition-colors">
                  <input
                    type="radio"
                    name="licenseFilter"
                    value="subscription"
                    checked={licenseFilter === 'subscription'}
                    onChange={() => onLicenseFilterChange('subscription')}
                    className="w-4 h-4 text-[#008744] focus:ring-[#008744] accent-[#008744] cursor-pointer"
                  />
                  <span className="font-medium">Suscripción URP</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 hover:text-[#008744] transition-colors">
                  <input
                    type="radio"
                    name="licenseFilter"
                    value="open"
                    checked={licenseFilter === 'open'}
                    onChange={() => onLicenseFilterChange('open')}
                    className="w-4 h-4 text-[#008744] focus:ring-[#008744] accent-[#008744] cursor-pointer"
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
              className="w-full flex items-center justify-between text-left font-display font-bold text-xs uppercase tracking-wider text-slate-800 hover:text-[#008744] transition-colors cursor-pointer py-1 group"
            >
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-[#008744]" />
                App Móvil
              </span>
              <div
                className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all duration-300 ${
                  isMobileOpen
                    ? 'rotate-180 bg-[#008744] text-white border-[#008744]'
                    : 'bg-white text-slate-400 border-slate-200 group-hover:border-slate-300 group-hover:text-slate-700'
                }`}
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
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
                  <span className="font-medium">Cuenta con app móvil</span>
                </label>
              </div>
            )}
          </div>

          <div>
            <button
              type="button"
              onClick={handleToggleMaterias}
              className="w-full flex items-center justify-between text-left font-display font-bold text-xs uppercase tracking-wider text-slate-800 hover:text-[#008744] transition-colors cursor-pointer py-1 group"
            >
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#008744]" />
                Filtrar Por Materias
              </span>
              <div
                className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all duration-300 ${
                  isMateriasOpen
                    ? 'rotate-180 bg-[#008744] text-white border-[#008744]'
                    : 'bg-white text-slate-400 border-slate-200 group-hover:border-slate-300 group-hover:text-slate-700'
                }`}
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
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
                  <div className="max-h-[360px] overflow-y-auto pr-1 flex flex-col gap-2">
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
