import React from 'react';
import {
  CheckCircle2,
  User,
  Building2,
  Clock,
  ExternalLink,
  Calendar,
} from 'lucide-react';
import { ConferenceSummary } from '../types';

interface AttendanceLiveSuccessCardProps {
  conference: ConferenceSummary;
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  tipoParticipante: string;
  correo: string;
  cicloAcademico: number | null;
  timestampRegistrado: string | null;
  onBackToCalendar: () => void;
}

export const AttendanceLiveSuccessCard: React.FC<AttendanceLiveSuccessCardProps> = ({
  conference,
  nombres,
  apellidos,
  tipoDocumento,
  numeroDocumento,
  tipoParticipante,
  correo,
  cicloAcademico,
  timestampRegistrado,
  onBackToCalendar,
}) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="bg-slate-900 text-white p-8 text-center border-b border-slate-800">
          <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-4 border-2 border-emerald-400 shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400 block mb-1">
            Asistencia Registrada &bull; BVE-FAMURP
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-black leading-tight text-white">
            ¡Asistencia Marcada con Éxito!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mt-2 leading-relaxed">
            Tu participación en la capacitación en vivo ha sido validada y registrada con marca temporal en el sistema de acreditación académica.
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
              Actividad Académica
            </h2>
            <p className="text-base font-display font-black text-slate-900">
              {conference.tituloEvento}
            </p>
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-semibold text-slate-600 pt-1">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#008744]" />
                {conference.expositorPonente}
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#008744]" />
                {conference.entidadEditorial}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#008744]" />
                Hora de marcación: <strong>{timestampRegistrado}</strong>
              </span>
            </div>
          </div>

          <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200 space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-emerald-900">
              Constancia de Marcación en Vivo
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-slate-700">
              <p><strong>Participante:</strong> {nombres} {apellidos}</p>
              <p><strong>{tipoDocumento}:</strong> {numeroDocumento}</p>
              <p><strong>Rol / Estamento:</strong> {tipoParticipante}</p>
              <p><strong>Correo:</strong> {correo}</p>
              {cicloAcademico && <p><strong>Ciclo Académico:</strong> {cicloAcademico}° Ciclo</p>}
              <p><strong>Estado:</strong> <span className="text-emerald-700 font-bold">Presente (En Sesión)</span></p>
            </div>
          </div>

          {conference.enlaceVirtual && (
            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-blue-900">
                  Transmisión en Vivo (Microsoft Teams)
                </h3>
                <p className="text-[11px] text-blue-700 mt-0.5">
                  Puedes regresar a la sala de videoconferencia para continuar la capacitación.
                </p>
              </div>
              <a
                href={conference.enlaceVirtual}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Volver a la Sala Teams</span>
              </a>
            </div>
          )}

          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onBackToCalendar}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-[#008744] hover:bg-[#006b35] text-white font-display font-black text-sm shadow-urp-brutal-green tactile-btn-green transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Ver Calendario de Conferencias</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
