import React from 'react';
import {
  Clock,
  Video,
  MapPin,
  Building2,
  Users,
  Radio,
  User,
  Check,
  Link,
  ShieldAlert,
  BarChart3,
  Edit3,
  Trash2,
} from 'lucide-react';
import { ConferenceSummary } from '../../types';


interface AdminConferenceCardProps {
  conf: ConferenceSummary;
  copiedLink: { id: number; type: 'reg' | 'att' } | null;
  onCopyLink: (id: number, type: 'reg' | 'att') => void;
  onTogglePurge: (conf: ConferenceSummary) => void;
  onToggleAttendance: (conf: ConferenceSummary) => void;
  onNavigateToStats: (confId: number) => void;
  onEdit: (conf: ConferenceSummary) => void;
  onDelete: (conf: ConferenceSummary) => void;
}

export const AdminConferenceCard: React.FC<AdminConferenceCardProps> = ({
  conf,
  copiedLink,
  onCopyLink,
  onTogglePurge,
  onToggleAttendance,
  onNavigateToStats,
  onEdit,
  onDelete,
}) => {
  const startDate = new Date(conf.fechaHoraInicio);
  const endDate = new Date(conf.fechaHoraFin);
  const isCopiedReg = copiedLink?.id === conf.idConferencia && copiedLink?.type === 'reg';
  const isCopiedAtt = copiedLink?.id === conf.idConferencia && copiedLink?.type === 'att';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col lg:flex-row">
      <div
        className={`p-6 min-w-[140px] flex flex-col justify-between items-center text-center font-display border-b lg:border-b-0 lg:border-r border-slate-200 ${
          conf.asistenciaAbierta
            ? 'bg-emerald-600 text-white'
            : conf.estadoEvento === 'Cancelada'
              ? 'bg-red-700 text-white'
              : conf.estadoEvento === 'Finalizada'
                ? 'bg-slate-950 text-slate-300'
                : 'bg-slate-900 text-white'
        }`}
      >
        <div className="space-y-1">
          <span className="text-3xl font-black leading-none block">
            {startDate.getDate().toString().padStart(2, '0')}
          </span>
          <span className="text-xs uppercase tracking-widest font-extrabold block">
            {startDate.toLocaleDateString('es-PE', { month: 'short' })}
          </span>
          <span className="text-[10px] opacity-80 block">
            {startDate.getFullYear()}
          </span>
        </div>

        <div className="mt-3">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
            conf.estadoEvento === 'Finalizada'
              ? 'bg-black text-slate-300 border border-slate-700'
              : 'bg-white/20'
          }`}>
            {conf.estadoEvento}
          </span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#008744]" />
                {startDate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5">
                {conf.modalidad === 'Virtual' ? (
                  <Video className="w-3.5 h-3.5 text-[#008744]" />
                ) : (
                  <MapPin className="w-3.5 h-3.5 text-[#008744]" />
                )}
                {conf.modalidad}
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#008744]" />
                {conf.entidadEditorial}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200">
                <Users className="w-3.5 h-3.5" />
                <span>{conf.totalInscritos} Inscritos</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <Radio className="w-3.5 h-3.5" />
                <span>{conf.totalAsistentes} Asistentes</span>
              </span>
            </div>
          </div>

          <h3 className="text-base sm:text-lg font-display font-extrabold text-slate-900">
            {conf.tituloEvento}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Expositor: <strong>{conf.expositorPonente}</strong></span>
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onCopyLink(conf.idConferencia, 'reg')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              title="Copiar enlace de pre-inscripción para alumnos"
            >
              {isCopiedReg ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Link className="w-3.5 h-3.5 text-slate-500" />}
              <span>{isCopiedReg ? 'Enlace Copiado' : 'Link Inscripción'}</span>
            </button>

            <button
              type="button"
              onClick={() => onCopyLink(conf.idConferencia, 'att')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              title="Copiar enlace directo de asistencia"
            >
              {isCopiedAtt ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Link className="w-3.5 h-3.5 text-slate-500" />}
              <span>{isCopiedAtt ? 'Enlace Copiado' : 'Link Asistencia'}</span>
            </button>

            <button
              type="button"
              onClick={() => onTogglePurge(conf)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                conf.autoPurgar30Dias
                  ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                  : 'bg-indigo-50 text-indigo-900 border-indigo-200 hover:bg-indigo-100'
              }`}
              title="Configurar ciclo de purga a 30 días"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{conf.autoPurgar30Dias ? 'Auto-Purga: 30 Días (On)' : 'Conservación Indefinida'}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {conf.estadoEvento === 'Finalizada' ? (
              <span className="py-2 px-3.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed">
                <Radio className="w-3.5 h-3.5 opacity-40" />
                <span>Evento Concluido</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onToggleAttendance(conf)}
                className={`py-2 px-3.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                  conf.asistenciaAbierta
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-[#008744] hover:bg-[#006b35] text-white'
                }`}
              >
                <Radio className={`w-3.5 h-3.5 ${conf.asistenciaAbierta ? 'animate-pulse' : ''}`} />
                <span>{conf.asistenciaAbierta ? 'Cerrar Asistencia' : 'Habilitar Asistencia'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigateToStats(conf.idConferencia)}
              className="py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-urp-brutal-sm tactile-btn cursor-pointer"
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ver Estadísticas</span>
            </button>

            <button
              type="button"
              onClick={() => onEdit(conf)}
              className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Editar conferencia"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onDelete(conf)}
              className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              title="Eliminar conferencia"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
