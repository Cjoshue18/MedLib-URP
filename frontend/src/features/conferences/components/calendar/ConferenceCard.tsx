import React from 'react';
import { Clock, MapPin, Video, Radio, Share2, Check } from 'lucide-react';
import { ConferenceSummary } from '../../types';


interface ConferenceCardProps {
  conf: ConferenceSummary;
  isCopied: boolean;
  onCopyShareLink: (conf: ConferenceSummary) => void;
  onOpenAttendance: (conf: ConferenceSummary) => void;
  onOpenRegistration: (conf: ConferenceSummary) => void;
}

export const ConferenceCard: React.FC<ConferenceCardProps> = ({
  conf,
  isCopied,
  onCopyShareLink,
  onOpenAttendance,
  onOpenRegistration,
}) => {
  const startDate = new Date(conf.fechaHoraInicio);
  const endDate = new Date(conf.fechaHoraFin);
  const dayStr = isNaN(startDate.getTime()) ? '15' : startDate.getDate().toString().padStart(2, '0');
  const monthStr = isNaN(startDate.getTime())
    ? 'NOV'
    : startDate.toLocaleDateString('es-PE', { month: 'short' }).toUpperCase();
  const timeStr = `${startDate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all overflow-hidden flex flex-col sm:flex-row group">
      <div className="bg-[#008744] text-white flex flex-col items-center justify-center p-6 min-w-[120px] shrink-0 font-display font-black shadow-inner">
        <span className="text-3xl sm:4xl leading-none">{dayStr}</span>
        <span className="text-xs uppercase tracking-widest font-extrabold mt-1">{monthStr}</span>
        <span className="text-[10px] font-medium text-emerald-200 mt-1">
          {conf.modalidad}
        </span>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-semibold">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#008744]" />
                {timeStr}
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5">
                {conf.modalidad === 'Virtual' ? (
                  <Video className="w-3.5 h-3.5 text-[#008744]" />
                ) : (
                  <MapPin className="w-3.5 h-3.5 text-[#008744]" />
                )}
                {conf.modalidad === 'Virtual' ? 'Sala Virtual URP' : 'Auditorio Principal FAMURP'}
              </span>
            </div>

            {conf.asistenciaAbierta && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300 animate-pulse">
                <Radio className="w-3 h-3 text-emerald-600" />
                Asistencia Abierta
              </span>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-display font-extrabold text-slate-900 mb-2 group-hover:text-[#008744] transition-colors">
            {conf.tituloEvento}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
            Ponente: <strong>{conf.expositorPonente}</strong> | Patrocinado por: <em>{conf.entidadEditorial}</em>
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onCopyShareLink(conf)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer text-xs font-semibold"
              title="Copiar enlace de invitación"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Enlace copiado</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Compartir</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {conf.asistenciaAbierta && (
              <button
                onClick={() => onOpenAttendance(conf)}
                className="py-2 px-4 rounded-full border-2 border-emerald-700 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-urp-brutal-sm tactile-btn cursor-pointer flex items-center gap-1.5"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Marcar Asistencia</span>
              </button>
            )}
            <button
              onClick={() => onOpenRegistration(conf)}
              className="py-2 px-5 rounded-full border-2 border-slate-900 font-bold text-xs text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-urp-brutal-sm tactile-btn cursor-pointer"
            >
              Inscribirme
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
