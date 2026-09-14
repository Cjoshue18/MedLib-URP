import React from 'react';
import { AlertTriangle, Plus, RefreshCw } from 'lucide-react';

interface AdminResourceSubjectConfirmDialogProps {
  isOpen: boolean;
  pendingNewSubjects: string[];
  isSaving: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const AdminResourceSubjectConfirmDialog: React.FC<AdminResourceSubjectConfirmDialogProps> = ({
  isOpen,
  pendingNewSubjects,
  isSaving,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200 shadow-xs">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold font-display text-slate-900 leading-tight">
              Confirmación de nuevas materias
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Se crearán registros de nuevas materias que no existían previamente:
            </p>
          </div>
        </div>

        <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200 max-h-48 overflow-y-auto">
          <div className="flex flex-wrap gap-1.5">
            {pendingNewSubjects.map((subject, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white text-amber-900 text-xs font-bold border border-amber-300 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-amber-600" />
                <span>{subject}</span>
              </span>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-slate-500 leading-normal">
          Verifica si corresponden a nuevas especialidades o si se trata de variaciones ortográficas de materias ya existentes.
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Retroceder
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-[#008744] hover:bg-[#00572B] text-white text-xs font-bold shadow-urp-brutal-green tactile-btn-green transition-all cursor-pointer flex items-center gap-1.5"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <span>Aceptar</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
