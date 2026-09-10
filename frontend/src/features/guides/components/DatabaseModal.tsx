import React from 'react';
import { X, ShieldCheck, Globe, ExternalLink, AlertCircle } from 'lucide-react';
import { BiomedicalDatabase, getDatabaseLogoUrl } from '../data/databasesData';

interface DatabaseModalProps {
  database: BiomedicalDatabase | null;
  onClose: () => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({ database, onClose }) => {
  if (!database) return null;

  const isSubscription = database.accessType === 'Suscripción URP';
  const logoSrc = getDatabaseLogoUrl(database.logoFile);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 animate-scaleUp"
        role="dialog"
      >
        <div className="p-6 sm:p-8 border-b border-slate-100 flex items-start justify-between gap-4 bg-gradient-to-br from-slate-50 to-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center p-2.5 shrink-0">
              <img src={logoSrc} alt={database.title} className="max-h-full max-w-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                {isSubscription ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-urp-800 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-urp-700" />
                    <span>Suscripción URP</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200">
                    <Globe className="w-3.5 h-3.5 text-sky-600" />
                    <span>Acceso Abierto</span>
                  </span>
                )}
                <span className="text-xs text-slate-500">{database.category}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                {database.title}
              </h2>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6 text-sm text-slate-700">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-display">
              Descripción del Recurso
            </h4>
            <p className="text-slate-600 leading-relaxed">
              {database.description}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 font-display">
              <ShieldCheck className="w-4 h-4 text-urp-700" />
              <span>Instrucciones para Acceso Remoto Institucional</span>
            </h4>
            
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-urp-800 font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span>Ingresa a la <strong>Intranet de la URP</strong> con tu correo institucional y contraseña oficial.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-urp-800 font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span>En el menú lateral, dirígete a la sección <strong>"Biblioteca Virtual"</strong> y selecciona <strong>"Facultad de Medicina Humana"</strong>.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-urp-800 font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span>Haz clic en <strong>{database.title}</strong> para iniciar sesión autenticada sin restricciones de IP.</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Tip para Rotaciones de Internado:</strong> Crea tu cuenta de usuario dentro del campus de la universidad antes de iniciar tus rotaciones hospitalarias para habilitar el acceso desde la app móvil.
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-display">
              Temas y Especialidades Cubiertas
            </h4>
            <div className="flex flex-wrap gap-2">
              {database.tags.map((tag, idx) => (
                <span key={idx} className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors"
          >
            Cerrar Ficha
          </button>

          <div className="w-full sm:w-auto flex items-center gap-3">
            {isSubscription ? (
              <a
                href={database.accessUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-urp-700 hover:bg-urp-800 text-white font-semibold text-xs shadow-sm transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-200" />
                <span>Acceder vía Intranet URP</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <a
                href={database.accessUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs shadow-sm transition-colors"
              >
                <Globe className="w-4 h-4 text-sky-300" />
                <span>Abrir Recurso Abierto</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
