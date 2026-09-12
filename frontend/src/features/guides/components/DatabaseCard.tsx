import React from 'react';
import { ExternalLink, ShieldCheck, Globe, PlayCircle } from 'lucide-react';
import { BiomedicalDatabase, getDatabaseLogoUrl } from '../data/databasesData';

interface DatabaseCardProps {
  database: BiomedicalDatabase;
  onOpenTutorial?: (db: BiomedicalDatabase) => void;
}

export const DatabaseCard: React.FC<DatabaseCardProps> = ({ database, onOpenTutorial }) => {
  const isSubscription = database.accessType === 'Suscripción URP';
  const logoSrc = getDatabaseLogoUrl(database.logoFile);

  return (
    <article className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-urp-300 transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      {database.isFeatured && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-urp-500 via-emerald-400 to-teal-500"></div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-200 shrink-0">
            <img 
              src={logoSrc} 
              alt={database.title} 
              className="max-h-full max-w-full object-contain filter drop-shadow-sm"
              loading="lazy"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                if (target.parentElement) {
                  target.parentElement.innerHTML = '<span class="text-xs font-bold text-urp-700 font-display">MED</span>';
                }
              }}
            />
          </div>

          <div className="flex flex-col items-end gap-1.5">
            {isSubscription ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-urp-800 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-urp-700" />
                <span>Suscripción URP</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200">
                <Globe className="w-3.5 h-3.5 text-sky-600" />
                <span>Acceso Abierto</span>
              </span>
            )}
            
            {database.tags && database.tags.length > 0 && (
              <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                {database.tags[0]}
              </span>
            )}
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 group-hover:text-urp-800 transition-colors font-display line-clamp-1 mb-2">
          {database.title}
        </h3>

        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
          {database.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-2">
          {database.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="text-[10px] font-medium text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
              #{tag}
            </span>
          ))}
          {database.tags.length > 3 && (
            <span className="text-[10px] font-medium text-slate-400 self-center">
              +{database.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
        {database.tutorialUrl ? (
          <button
            onClick={() => onOpenTutorial && onOpenTutorial(database)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-urp-700 transition-colors py-1.5 px-2 rounded-lg hover:bg-white"
            title="Ver guía y tutorial de acceso"
          >
            <PlayCircle className="w-4 h-4 text-emerald-600" />
            <span>Tutorial</span>
          </button>
        ) : (
          <span className="text-[11px] text-slate-400 font-medium">
            {isSubscription ? 'Autenticación requerida' : 'Consulta libre'}
          </span>
        )}

        {isSubscription ? (
          <a
            href={database.accessUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-urp-700 hover:bg-urp-800 text-white font-semibold text-xs shadow-sm hover:shadow transition-all duration-200 active:scale-98 ml-auto"
            title="Acceso seguro para estudiantes y docentes URP"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
            <span>Acceder vía Intranet</span>
            <ExternalLink className="w-3 h-3 text-emerald-200/80" />
          </a>
        ) : (
          <a
            href={database.accessUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs shadow-sm hover:shadow transition-all duration-200 active:scale-98 ml-auto"
            title="Abrir recurso científico de acceso libre"
          >
            <Globe className="w-3.5 h-3.5 text-sky-300" />
            <span>Abrir Recurso</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        )}
      </div>
    </article>
  );
};
