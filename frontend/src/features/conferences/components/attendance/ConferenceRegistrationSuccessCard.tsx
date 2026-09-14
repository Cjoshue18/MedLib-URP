import React from 'react';
import {
  CheckCircle2,
  User,
  Building2,
  Video,
  MapPin,
  Calendar,
  Clock,
  Share2,
  Link as LinkIcon,
  Check,
} from 'lucide-react';
import { ConferenceSummary } from '../../types';


interface ConferenceRegistrationSuccessCardProps {
  conference: ConferenceSummary;
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  tipoParticipante: string;
  correo: string;
  cicloAcademico: number | null;
  registrationLink: string;
  copiedLink: boolean;
  onCopyRegistrationLink: () => void;
  onBackToCalendar: () => void;
}

export const ConferenceRegistrationSuccessCard: React.FC<ConferenceRegistrationSuccessCardProps> = ({
  conference,
  nombres,
  apellidos,
  tipoDocumento,
  numeroDocumento,
  tipoParticipante,
  correo,
  cicloAcademico,
  registrationLink,
  copiedLink,
  onCopyRegistrationLink,
  onBackToCalendar,
}) => {
  const startDate = new Date(conference.fechaHoraInicio);
  const endDate = new Date(conference.fechaHoraFin);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="bg-[#008744] text-white p-8 text-center border-b border-emerald-700">
          <div className="w-16 h-16 rounded-full bg-white text-[#008744] flex items-center justify-center mx-auto mb-4 border border-emerald-200 shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest text-emerald-100 block mb-1">
            Registro Confirmado &bull; BVE-FAMURP
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-black leading-tight text-white">
            ¡Muchas Gracias por tu Pre-inscripción!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-lg mx-auto mt-2 leading-relaxed">
            Tu participación en la capacitación ha sido registrada exitosamente en la nómina oficial de la Biblioteca Virtual y Especializada de Medicina Humana.
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
              Resumen de la Conferencia
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
                {conference.modalidad === 'Virtual' ? (
                  <Video className="w-3.5 h-3.5 text-[#008744]" />
                ) : (
                  <MapPin className="w-3.5 h-3.5 text-[#008744]" />
                )}
                {conference.modalidad}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#008744]" />
                {startDate.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#008744]" />
                {startDate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200 space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-emerald-900">
              Datos del Participante Registrado
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-slate-700">
              <p><strong>Nombres:</strong> {nombres} {apellidos}</p>
              <p><strong>{tipoDocumento}:</strong> {numeroDocumento}</p>
              <p><strong>Estamento:</strong> {tipoParticipante}</p>
              <p><strong>Correo:</strong> {correo}</p>
              {cicloAcademico && <p><strong>Ciclo Académico:</strong> {cicloAcademico}° Ciclo</p>}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Enlace de Inscripción del Evento
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Comparte este enlace directo con tus compañeros o profesores interesados en asistir:
                </p>
              </div>
              <Share2 className="w-4 h-4 text-[#008744] shrink-0" />
            </div>

            <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-300">
              <LinkIcon className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                readOnly
                value={registrationLink}
                className="bg-transparent text-xs font-mono text-slate-700 flex-1 outline-none truncate"
              />
              <button
                type="button"
                onClick={onCopyRegistrationLink}
                className="px-3 py-1.5 rounded-lg bg-[#008744] text-white text-xs font-bold hover:bg-[#006b35] transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <span>Copiar Enlace</span>
                )}
              </button>
            </div>
          </div>

          {conference.enlaceVirtual && (
            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                <Video className="w-4 h-4 text-blue-700" />
                <span>Acceso a la Sala Virtual (Teams / Zoom)</span>
              </div>
              <p className="text-[11px] text-blue-800 leading-relaxed">
                Podrás conectarte el día de la sesión usando el siguiente enlace institucional:
              </p>
              <a
                href={conference.enlaceVirtual}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono font-bold text-blue-700 hover:underline break-all block"
              >
                {conference.enlaceVirtual}
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
