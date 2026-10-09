import React, { useState, useEffect, useMemo } from 'react';
import { X, Search, Hexagon, ShieldCheck, Globe, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { ResourceApiDto } from '../../types/resourceApiTypes';
import { getDatabaseLogoUrl } from '../../data/databasesData';

interface HexagonMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  resources: ResourceApiDto[];
  onSave: (selectedIds: number[]) => Promise<void>;
}

export const HexagonMatrixModal: React.FC<HexagonMatrixModalProps> = ({
  isOpen,
  onClose,
  resources,
  onSave,
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const initial = new Set(
        resources.filter((r) => r.mostrarEnHexagonos && r.isActive).map((r) => r.id)
      );
      setSelectedIds(initial);
      setSearchTerm('');
      setErrorMsg(null);
    }
  }, [isOpen, resources]);

  const activeResources = useMemo(
    () => resources.filter((r) => r.isActive),
    [resources]
  );

  const filteredResources = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return activeResources;
    return activeResources.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.clinicalDescription && r.clinicalDescription.toLowerCase().includes(q)) ||
        (r.subjects && r.subjects.some((s) => s.toLowerCase().includes(q)))
    );
  }, [activeResources, searchTerm]);

  if (!isOpen) return null;

  const count = selectedIds.size;
  const isExact15 = count === 15;

  const handleToggle = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setErrorMsg(null);
      } else {
        if (next.size >= 15) {
          setErrorMsg('Ya has alcanzado el límite de 15 bases de datos. Desmarca una primero para agregar otra.');
          return prev;
        }
        next.add(id);
        setErrorMsg(null);
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isExact15) {
      setErrorMsg(`Debes seleccionar exactamente 15 bases de datos. Actualmente tienes ${count}.`);
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);
    try {
      await onSave(Array.from(selectedIds));
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar la matriz de hexágonos.';
      setErrorMsg(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shadow-xs">
              <Hexagon className="w-5 h-5 fill-amber-400 text-amber-600" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
                <span>Configuración de Matriz Hexagonal (Portada)</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Selecciona exactamente 15 bases de datos activas para la red 3D interactiva de inicio.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-3.5 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrar por nombre, editorial o materia..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs outline-none focus:border-[#008744]"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                isExact15
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-amber-50 text-amber-900 border-amber-300'
              }`}
            >
              <Hexagon className={`w-3.5 h-3.5 ${isExact15 ? 'fill-emerald-500 text-emerald-700' : 'fill-amber-400 text-amber-600'}`} />
              <span>
                {count} / 15 Seleccionadas {isExact15 ? '(Listo)' : `(Faltan ${15 - count})`}
              </span>
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredResources.map((res) => {
              const isSelected = selectedIds.has(res.id);
              const logoSrc = getDatabaseLogoUrl(res.logoUrl || undefined);

              return (
                <div
                  key={res.id}
                  onClick={() => handleToggle(res.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-emerald-50/60 border-emerald-300 shadow-xs'
                      : count >= 15
                      ? 'bg-white border-slate-200 opacity-60 hover:opacity-80'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#008744] border-[#008744] text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                      {logoSrc ? (
                        <img
                          src={logoSrc}
                          alt={res.name}
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-[8px] font-bold text-slate-400">MED</span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-900 truncate leading-snug">
                        {res.name}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        {res.isSubscription ? (
                          <span className="inline-flex items-center gap-0.5 text-emerald-700 font-semibold">
                            <ShieldCheck className="w-2.5 h-2.5" /> Suscripción URP
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 text-sky-700 font-semibold">
                            <Globe className="w-2.5 h-2.5" /> Acceso Abierto
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 shrink-0">
                      En Matriz
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-500 font-medium">
            {!isExact15 ? (
              <span className="text-amber-700 font-semibold">
                Para guardar debes tener exactamente 15 bases seleccionadas ({count}/15).
              </span>
            ) : (
              <span className="text-emerald-700 font-semibold">
                15 bases seleccionadas correctamente.
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isExact15 || isSaving}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-display font-bold text-white transition-all shadow-xs ${
                isExact15 && !isSaving
                  ? 'bg-[#008744] hover:bg-[#00572B] cursor-pointer'
                  : 'bg-slate-300 cursor-not-allowed opacity-60'
              }`}
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Guardar Matriz (15/15)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
