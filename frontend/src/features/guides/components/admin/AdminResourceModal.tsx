import React, { useState, useEffect } from 'react';
import { X, RefreshCw, XCircle } from 'lucide-react';

export interface ResourceFormData {
  id?: number;
  name: string;
  logoUrl: string;
  clinicalDescription: string;
  isSubscription: boolean;
  hasMobileApp: boolean;
  externalUrl: string;
  isActive: boolean;
  mostrarEnHexagonos: boolean;
  subjectsStr: string;
  youtubeVideoId: string;
  videoTitle: string;
  guidePdfUrl: string;
}

const initialResourceFormData: ResourceFormData = {
  name: '',
  logoUrl: '',
  clinicalDescription: '',
  isSubscription: true,
  hasMobileApp: false,
  externalUrl: 'https://test.urp.edu.pe/Intranet/',
  isActive: true,
  mostrarEnHexagonos: false,
  subjectsStr: 'Medicina Humana, Ciencias Básicas',
  youtubeVideoId: '',
  videoTitle: '',
  guidePdfUrl: '',
};

interface AdminResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ResourceFormData) => Promise<void>;
  initialData?: ResourceFormData | null;
  activeResourcesCount?: number;
}

export const AdminResourceModal: React.FC<AdminResourceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  activeResourcesCount,
}) => {
  const [formData, setFormData] = useState<ResourceFormData>(initialResourceFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(initialResourceFormData);
    }
    setFormError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('El nombre del recurso es obligatorio.');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al procesar la operación.';
      setFormError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-3xl">
          <div>
            <h3 className="text-base font-bold font-display text-slate-900">
              {formData.id ? 'Editar Base de Datos Biomédica' : 'Registrar Nueva Base de Datos'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Los cambios se sincronizarán directamente con el catálogo de biblioteca
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 flex-1">
          {formError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <XCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nombre del Recurso *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej. ClinicalKey, PubMed, DynaMedex"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-[#008744] focus:ring-1 focus:ring-[#008744] outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Descripción Clínica
            </label>
            <textarea
              rows={3}
              value={formData.clinicalDescription}
              onChange={(e) => setFormData({ ...formData, clinicalDescription: e.target.value })}
              placeholder="Resumen del contenido y propósito para estudiantes y docentes..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-[#008744] focus:ring-1 focus:ring-[#008744] outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tipo de Licencia
              </label>
              <select
                value={formData.isSubscription ? 'sub' : 'open'}
                onChange={(e) => setFormData({ ...formData, isSubscription: e.target.value === 'sub' })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-[#008744] outline-none bg-white font-medium"
              >
                <option value="sub">Suscripción URP (Vía Intranet)</option>
                <option value="open">Acceso Abierto (Open Access)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                URL de Logotipo
              </label>
              <input
                type="text"
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                placeholder="https://... o nombre de archivo .png/.webp"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-[#008744] focus:ring-1 focus:ring-[#008744] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Enlace Externo de Acceso
            </label>
            <input
              type="url"
              value={formData.externalUrl}
              onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-[#008744] focus:ring-1 focus:ring-[#008744] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Materias Asociadas (Separadas por comas)
            </label>
            <input
              type="text"
              value={formData.subjectsStr}
              onChange={(e) => setFormData({ ...formData, subjectsStr: e.target.value })}
              placeholder="Medicina General, Farmacología, Anatomía, Fisiología"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-[#008744] focus:ring-1 focus:ring-[#008744] outline-none"
            />
          </div>

          <div className="border-t border-slate-200 pt-3">
            <p className="text-xs font-bold font-display text-slate-900 mb-2">Video Tutorial Oficial (Opcional)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  YouTube Video ID o URL
                </label>
                <input
                  type="text"
                  value={formData.youtubeVideoId}
                  onChange={(e) => setFormData({ ...formData, youtubeVideoId: e.target.value })}
                  placeholder="dQw4w9WgXcQ"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:border-[#008744] outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Título del Tutorial
                </label>
                <input
                  type="text"
                  value={formData.videoTitle}
                  onChange={(e) => setFormData({ ...formData, videoTitle: e.target.value })}
                  placeholder="Guía de búsqueda clínica..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:border-[#008744] outline-none"
                />
              </div>
            </div>
          </div>

          {formData.mostrarEnHexagonos ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <span className="text-amber-700 font-bold text-xs">HEX</span>
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Asignada a la Matriz Hexagonal de Portada</span>
                  <span className="text-[11px] text-slate-500 font-medium">Forma parte de las 15 bases activas en la red 3D de inicio.</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300 shrink-0">
                En Portada
              </span>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
                  <span className="text-slate-500 font-bold text-xs">DIR</span>
                </div>
                <div>
                  <span className="font-bold text-slate-700 block">No visible en los hexágonos de portada</span>
                  <span className="text-[11px] text-slate-500 font-medium">Para incluirla en la matriz de 15, usa el botón "Matriz Hexagonal".</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full shrink-0">
                Oculto
              </span>
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-3">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.hasMobileApp}
                  onChange={(e) => setFormData({ ...formData, hasMobileApp: e.target.checked })}
                  className="w-4 h-4 rounded text-[#008744] focus:ring-[#008744]"
                />
                <span>Dispone de App Móvil</span>
              </label>

              <label
                className={`flex items-center gap-2 text-xs font-bold ${
                  initialData?.mostrarEnHexagonos || ((activeResourcesCount ?? 99) <= 15 && initialData?.isActive)
                    ? 'cursor-not-allowed text-slate-400'
                    : 'cursor-pointer text-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  disabled={
                    initialData?.mostrarEnHexagonos || ((activeResourcesCount ?? 99) <= 15 && initialData?.isActive)
                  }
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className={`w-4 h-4 rounded text-[#008744] focus:ring-[#008744] ${
                    initialData?.mostrarEnHexagonos || ((activeResourcesCount ?? 99) <= 15 && initialData?.isActive)
                      ? 'cursor-not-allowed text-slate-400'
                      : 'cursor-pointer'
                  }`}
                />
                <span>Visible y Activo en el Portal</span>
              </label>
            </div>

            {initialData?.mostrarEnHexagonos && (
              <p className="text-[11px] text-rose-700 font-semibold bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
                Esta base de datos forma parte de la matriz hexagonal de inicio y no puede inactivarse directamente. Para inactivarla, primero debes reemplazarla por otra en la matriz usando el botón "Matriz Hexagonal".
              </p>
            )}

            {!initialData?.mostrarEnHexagonos && (activeResourcesCount ?? 99) <= 15 && initialData?.isActive && (
              <p className="text-[11px] text-amber-700 font-semibold bg-amber-50 border border-amber-200 p-2.5 rounded-xl">
                No se puede inactivar: el sistema requiere tener al menos 15 bases de datos activas.
              </p>
            )}
          </div>

          <div className="border-t border-slate-200 pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl font-display font-bold text-xs text-white bg-[#008744] hover:bg-[#00572B] transition-colors shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <span>Guardar Base de Datos</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
