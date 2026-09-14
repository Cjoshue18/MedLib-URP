import { Search, X, Sparkles, ChevronDown } from 'lucide-react';

interface DatabaseSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  licenseFilter?: 'all' | 'subscription' | 'open';
  onLicenseFilterChange?: (value: 'all' | 'subscription' | 'open') => void;
  statusFilter?: 'all' | 'active' | 'inactive';
  onStatusFilterChange?: (value: 'all' | 'active' | 'inactive') => void;
  actionsRight?: React.ReactNode;
  suggestions?: string[];
  onSuggestionClick?: (value: string) => void;
  variant?: 'panel' | 'hero';
}

export const DatabaseSearchBar: React.FC<DatabaseSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = 'Buscar por nombre, palabra clave o materia...',
  licenseFilter,
  onLicenseFilterChange,
  statusFilter,
  onStatusFilterChange,
  actionsRight,
  suggestions,
  onSuggestionClick,
  variant = 'panel',
}) => {
  if (variant === 'hero') {
    return (
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-3">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3"
        >
          <div className="relative flex-1 bg-white rounded-2xl border-2 border-slate-900 shadow-urp-brutal-sm px-4 py-3 flex items-center gap-2.5">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={placeholder}
              className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-transparent outline-none font-medium"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer transition-colors shrink-0"
                title="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {onLicenseFilterChange && (
            <div className="relative shrink-0 w-full sm:w-auto">
              <select
                value={licenseFilter || 'all'}
                onChange={(e) => onLicenseFilterChange(e.target.value as 'all' | 'subscription' | 'open')}
                className="w-full sm:w-auto appearance-none py-3 pl-4 pr-10 rounded-2xl border-2 border-slate-900 bg-white text-xs font-bold text-slate-800 shadow-urp-brutal-sm outline-none cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <option value="all">Todas las licencias</option>
                <option value="subscription">Suscripción URP</option>
                <option value="open">Acceso Abierto</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-700 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.5]" />
            </div>
          )}

          {actionsRight}
        </form>

        {suggestions && suggestions.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#008744]" />
              Sugerencias:
            </span>
            {suggestions.map((kw) => (
              <button
                key={kw}
                type="button"
                onClick={() => (onSuggestionClick ? onSuggestionClick(kw) : onSearchChange(kw))}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-semibold ${
                  searchTerm.toLowerCase() === kw.toLowerCase()
                    ? 'bg-[#008744] text-white border-[#008744]'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-900 hover:text-slate-900 shadow-2xs'
                }`}
              >
                {kw}
              </button>
            ))}
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="text-xs px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-bold hover:bg-rose-100 transition-colors cursor-pointer"
              >
                Ver todos
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-300 text-sm focus:border-[#008744] focus:ring-1 focus:ring-[#008744] outline-none transition-colors"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {(onLicenseFilterChange || onStatusFilterChange) && (
          <div className="flex items-center gap-2">
            {onLicenseFilterChange && (
              <div className="relative">
                <select
                  value={licenseFilter || 'all'}
                  onChange={(e) => onLicenseFilterChange(e.target.value as 'all' | 'subscription' | 'open')}
                  className="appearance-none py-2 pl-3 pr-8 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white focus:border-[#008744] outline-none cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <option value="all">Todas las licencias</option>
                  <option value="subscription">Suscripción URP</option>
                  <option value="open">Acceso Abierto</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            )}

            {onStatusFilterChange && (
              <div className="relative">
                <select
                  value={statusFilter || 'all'}
                  onChange={(e) => onStatusFilterChange(e.target.value as 'all' | 'active' | 'inactive')}
                  className="appearance-none py-2 pl-3 pr-8 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white focus:border-[#008744] outline-none cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <option value="all">Todos los estados</option>
                  <option value="active">Solo Activos</option>
                  <option value="inactive">Solo Inactivos</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            )}
          </div>
        )}
      </div>

      {actionsRight && (
        <div className="flex items-center gap-2 shrink-0">
          {actionsRight}
        </div>
      )}
    </div>
  );
};
