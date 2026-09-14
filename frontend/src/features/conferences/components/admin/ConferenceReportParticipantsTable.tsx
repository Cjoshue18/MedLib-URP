import React from 'react';
import { Search, CheckCircle2, AlertCircle, UserX } from 'lucide-react';
import { ParticipantRecord } from '../../types';


interface ConferenceReportParticipantsTableProps {
  participants: ParticipantRecord[];
  totalCount: number;
  activeFilterTab: 'all' | 'Acreditado' | 'Espontaneo' | 'Inasistencia';
  onFilterTabChange: (tab: 'all' | 'Acreditado' | 'Espontaneo' | 'Inasistencia') => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedRole: string;
  onRoleChange: (role: string) => void;
  counts: {
    total: number;
    acreditados: number;
    espontaneos: number;
    inasistencias: number;
  };
}

export const ConferenceReportParticipantsTable: React.FC<ConferenceReportParticipantsTableProps> = ({
  participants,
  totalCount,
  activeFilterTab,
  onFilterTabChange,
  searchTerm,
  onSearchChange,
  selectedRole,
  onRoleChange,
  counts,
}) => {
  const getStatusBadge = (estado: 'Acreditado' | 'Espontaneo' | 'Inasistencia') => {
    switch (estado) {
      case 'Acreditado':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Acreditado (Oficial)</span>
          </span>
        );
      case 'Espontaneo':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
            <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>Espontáneo (Sin Inscripción)</span>
          </span>
        );
      case 'Inasistencia':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-red-100 text-red-900 border border-red-300">
            <UserX className="w-3.5 h-3.5 text-red-700" />
            <span>Inasistencia (Faltó)</span>
          </span>
        );
    }
  };

  const getDocBadge = (tipoDoc: string, numDoc: string) => {
    return (
      <div className="font-mono text-xs">
        <span className="text-[10px] font-bold text-slate-500 block uppercase">
          {tipoDoc}
        </span>
        <span className="font-black text-slate-900">
          {numDoc}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onFilterTabChange('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeFilterTab === 'all'
                ? 'bg-slate-900 text-white shadow-urp-brutal-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Todos ({counts.total})
          </button>

          <button
            type="button"
            onClick={() => onFilterTabChange('Acreditado')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeFilterTab === 'Acreditado'
                ? 'bg-emerald-600 text-white shadow-urp-brutal-sm'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            Acreditados ({counts.acreditados})
          </button>

          <button
            type="button"
            onClick={() => onFilterTabChange('Espontaneo')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeFilterTab === 'Espontaneo'
                ? 'bg-amber-500 text-white shadow-urp-brutal-sm'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            Espontáneos ({counts.espontaneos})
          </button>

          <button
            type="button"
            onClick={() => onFilterTabChange('Inasistencia')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeFilterTab === 'Inasistencia'
                ? 'bg-red-600 text-white shadow-urp-brutal-sm'
                : 'bg-red-50 text-red-800 border border-red-200 hover:bg-red-100'
            }`}
          >
            Inasistencias ({counts.inasistencias})
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar documento o nombre..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008744]"
            />
          </div>

          <select
            value={selectedRole}
            onChange={(e) => onRoleChange(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#008744] cursor-pointer"
          >
            <option value="all">Todos los Roles</option>
            <option value="Estudiante">Estudiantes</option>
            <option value="Docente">Docentes</option>
            <option value="Residentado">Residentado</option>
            <option value="Otro">Otros</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-600">
              <th className="py-3 px-4 w-12 text-center">N°</th>
              <th className="py-3 px-4">Documento</th>
              <th className="py-3 px-4">Participante</th>
              <th className="py-3 px-4">Rol / Estamento</th>
              <th className="py-3 px-4">Ciclo</th>
              <th className="py-3 px-4">Pre-Registro</th>
              <th className="py-3 px-4">Hora Marcación</th>
              <th className="py-3 px-4">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs font-medium text-slate-700">
            {participants.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-slate-400 font-bold">
                  No se encontraron participantes que coincidan con los filtros aplicados.
                </td>
              </tr>
            ) : (
              participants.map((p, index) => (
                <tr key={`${p.tipoDocumento}-${p.numeroDocumento}-${index}`} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-center font-bold text-slate-400">
                    {index + 1}
                  </td>
                  <td className="py-3 px-4">
                    {getDocBadge(p.tipoDocumento, p.numeroDocumento)}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-extrabold text-slate-900">{p.apellidos}, {p.nombres}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{p.correo}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-lg bg-slate-100 font-bold text-[11px] text-slate-800">
                      {p.tipoParticipante}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-700">
                    {p.cicloAcademico ? `${p.cicloAcademico}° Ciclo` : '-'}
                  </td>
                  <td className="py-3 px-4 text-[11px] text-slate-600">
                    {p.fechaHoraRegistro ? new Date(p.fechaHoraRegistro).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }) : '-'}
                  </td>
                  <td className="py-3 px-4 text-[11px] text-slate-600">
                    {p.fechaHoraMarcacion ? new Date(p.fechaHoraMarcacion).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }) : '-'}
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(p.estado)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-semibold">
        <span>Mostrando {participants.length} de {totalCount} participantes</span>
        <span className="text-[11px]">BVE-FAMURP &bull; Sistema de Gestión de Capacitaciones</span>
      </div>
    </div>
  );
};
