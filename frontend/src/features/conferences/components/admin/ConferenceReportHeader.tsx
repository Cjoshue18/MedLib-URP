import React from 'react';
import { Calendar, Building2, Video, MapPin } from 'lucide-react';
import { ConferenceReport } from '../../types';
import { formatLongDate } from '../../../../utils/dateFormatter';

interface ConferenceReportHeaderProps {
  report: ConferenceReport;
}

export const ConferenceReportHeader: React.FC<ConferenceReportHeaderProps> = ({ report }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-600">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#008744]" />
            {formatLongDate(report.conferencia.fechaHoraInicio)}
          </span>
          <span className="text-slate-300">&bull;</span>
          <span className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#008744]" />
            {report.conferencia.entidadEditorial}
          </span>
          <span className="text-slate-300">&bull;</span>
          <span className="flex items-center gap-1.5">
            {report.conferencia.modalidad === 'Virtual' ? (
              <Video className="w-3.5 h-3.5 text-[#008744]" />
            ) : (
              <MapPin className="w-3.5 h-3.5 text-[#008744]" />
            )}
            {report.conferencia.modalidad}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
              report.conferencia.asistenciaAbierta
                ? 'bg-emerald-600 text-white animate-pulse'
                : 'bg-slate-200 text-slate-700'
            }`}
          >
            {report.conferencia.asistenciaAbierta ? 'Asistencia Abierta (En Vivo)' : 'Asistencia Cerrada'}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-900 text-white">
            {report.conferencia.estadoEvento}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg sm:text-xl font-display font-black text-slate-900">
          {report.conferencia.tituloEvento}
        </h3>
        <p className="text-xs text-slate-600 mt-1">
          Expositor / Especialista: <strong>{report.conferencia.expositorPonente}</strong>
        </p>
      </div>
    </div>
  );
};
