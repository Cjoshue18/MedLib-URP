import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  UserX, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  Calendar, 
  Building2, 
  Video, 
  MapPin, 
  Loader2, 
  FileSpreadsheet
} from 'lucide-react';
import { ConferenceSummary, ConferenceReport, ParticipantRecord } from '../types';
import { conferenceService } from '../services/conferenceService';
import { excelExportService } from '../../attendance/services/excelExportService';

interface AdminStatisticsTabProps {
  initialConferenceId?: number | null;
  onShowFeedback: (msg: string) => void;
}

export const AdminStatisticsTab: React.FC<AdminStatisticsTabProps> = ({
  initialConferenceId,
  onShowFeedback
}) => {
  const [conferences, setConferences] = useState<ConferenceSummary[]>([]);
  const [selectedConferenceId, setSelectedConferenceId] = useState<number | null>(initialConferenceId || null);
  const [report, setReport] = useState<ConferenceReport | null>(null);
  const [isLoadingConferences, setIsLoadingConferences] = useState(false);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'Acreditado' | 'Espontaneo' | 'Inasistencia'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  const loadConferencesList = async () => {
    setIsLoadingConferences(true);
    try {
      const data = await conferenceService.getAdminConferences();
      setConferences(data);
      if (!selectedConferenceId && data.length > 0) {
        setSelectedConferenceId(data[0].idConferencia);
      }
    } catch {
      onShowFeedback('Error al cargar la lista de conferencias.');
    } finally {
      setIsLoadingConferences(false);
    }
  };

  const loadReportData = async (confId: number) => {
    setIsLoadingReport(true);
    try {
      const rep = await conferenceService.getConferenceReport(confId);
      setReport(rep);
    } catch (err: unknown) {
      setReport(null);
      const msg = err instanceof Error ? err.message : 'Error al obtener el reporte cruzado de asistencias.';
      onShowFeedback(msg);
    } finally {
      setIsLoadingReport(false);
    }
  };

  useEffect(() => {
    loadConferencesList();
  }, []);

  useEffect(() => {
    if (initialConferenceId) {
      setSelectedConferenceId(initialConferenceId);
    }
  }, [initialConferenceId]);

  useEffect(() => {
    if (selectedConferenceId) {
      loadReportData(selectedConferenceId);
    }
  }, [selectedConferenceId]);

  const handleExportExcel = () => {
    if (!report) {
      onShowFeedback('No hay datos disponibles para exportar.');
      return;
    }
    try {
      excelExportService.exportReport(report);
      onShowFeedback('Reporte oficial en Excel (.xlsx) generado exitosamente.');
    } catch {
      onShowFeedback('Error al generar el archivo Excel.');
    }
  };

  const filteredParticipants: ParticipantRecord[] = (report?.participantes || []).filter((p) => {
    const matchesTab = activeFilterTab === 'all' || p.estado === activeFilterTab;
    const matchesRole = selectedRole === 'all' || p.tipoParticipante === selectedRole;
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = !q || 
      p.nombres.toLowerCase().includes(q) ||
      p.apellidos.toLowerCase().includes(q) ||
      p.numeroDocumento.toLowerCase().includes(q) ||
      p.correo.toLowerCase().includes(q);

    return matchesTab && matchesRole && matchesSearch;
  });

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

  const pctAsistencia = report && report.totalInscritos > 0
    ? Math.round((report.totalAcreditados / report.totalInscritos) * 100)
    : (report && report.totalAsistentes > 0 ? 100 : 0);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black tracking-wider uppercase text-[#008744] block">
            Auditoría de Asistencias &amp; Acreditación
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-black text-slate-900">
            Estadísticas y Reportes ALFIN
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cruce algorítmico de pre-inscripción vs. marcación en tiempo real con exportación oficial.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => selectedConferenceId && loadReportData(selectedConferenceId)}
            disabled={!selectedConferenceId || isLoadingReport}
            className="p-3 rounded-2xl border-2 border-slate-900 text-slate-700 hover:bg-slate-100 transition-colors shadow-urp-brutal-sm tactile-btn cursor-pointer disabled:opacity-50"
            title="Refrescar reporte"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingReport ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleExportExcel}
            disabled={!report || isLoadingReport}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#008744] hover:bg-[#006b35] text-white font-bold text-xs sm:text-sm shadow-urp-brutal-green tactile-btn-green transition-all cursor-pointer disabled:opacity-50 shrink-0"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Descargar Excel Oficial (.xlsx)</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <Calendar className="w-5 h-5 text-[#008744]" />
          <span className="text-xs font-black text-slate-800 uppercase tracking-wide">
            Seleccionar Conferencia:
          </span>
        </div>

        <select
          value={selectedConferenceId || ''}
          onChange={(e) => setSelectedConferenceId(Number(e.target.value))}
          disabled={isLoadingConferences || conferences.length === 0}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white cursor-pointer"
        >
          {conferences.length === 0 ? (
            <option value="">No hay conferencias disponibles</option>
          ) : (
            conferences.map((c) => (
              <option key={c.idConferencia} value={c.idConferencia}>
                #{c.idConferencia} - {c.tituloEvento} ({new Date(c.fechaHoraInicio).toLocaleDateString('es-PE')})
              </option>
            ))
          )}
        </select>
      </div>

      {isLoadingReport ? (
        <div className="bg-white p-16 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#008744] animate-spin" />
          <p className="text-xs font-bold text-slate-600">Calculando cruce de inscritos vs. asistentes...</p>
        </div>
      ) : !report ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-xs text-center space-y-3">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Selecciona una conferencia</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Elige un evento del selector para desplegar las métricas de asistencia, el porcentaje de acreditación y la lista completa.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#008744]" />
                  {new Date(report.conferencia.fechaHoraInicio).toLocaleString('es-PE')}
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1.5">
                  {report.conferencia.modalidad === 'Virtual' ? <Video className="w-4 h-4 text-[#008744]" /> : <MapPin className="w-4 h-4 text-[#008744]" />}
                  {report.conferencia.modalidad}
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#008744]" />
                  {report.conferencia.entidadEditorial}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  report.conferencia.asistenciaAbierta ? 'bg-emerald-600 text-white animate-pulse' : 'bg-slate-200 text-slate-700'
                }`}>
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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-black uppercase text-slate-500 block">Total Pre-inscritos</span>
              <p className="text-2xl font-display font-black text-slate-900 mt-1">{report.totalInscritos}</p>
              <span className="text-[10px] font-semibold text-blue-600 block mt-0.5">Formulario previo</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-black uppercase text-slate-500 block">Total Asistentes</span>
              <p className="text-2xl font-display font-black text-slate-900 mt-1">{report.totalAsistentes}</p>
              <span className="text-[10px] font-semibold text-emerald-600 block mt-0.5">Marcaciones Teams</span>
            </div>

            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 shadow-xs">
              <span className="text-[10px] font-black uppercase text-emerald-800 block">Acreditados (Oficial)</span>
              <p className="text-2xl font-display font-black text-emerald-900 mt-1">{report.totalAcreditados}</p>
              <span className="text-[10px] font-bold text-emerald-700 block mt-0.5">Inscritos + Asistieron</span>
            </div>

            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 shadow-xs">
              <span className="text-[10px] font-black uppercase text-amber-800 block">Espontáneos</span>
              <p className="text-2xl font-display font-black text-amber-900 mt-1">{report.totalEspontaneos}</p>
              <span className="text-[10px] font-bold text-amber-700 block mt-0.5">Sin pre-inscripción</span>
            </div>

            <div className="bg-red-50/70 p-4 rounded-2xl border border-red-200 shadow-xs">
              <span className="text-[10px] font-black uppercase text-red-800 block">Inasistencias</span>
              <p className="text-2xl font-display font-black text-red-900 mt-1">{report.totalInasistencias}</p>
              <span className="text-[10px] font-bold text-red-700 block mt-0.5">Inscritos que faltaron</span>
            </div>

            <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-xs">
              <span className="text-[10px] font-black uppercase text-slate-300 block">Efectividad</span>
              <p className="text-2xl font-display font-black text-emerald-400 mt-1">{pctAsistencia}%</p>
              <span className="text-[10px] font-bold text-slate-300 block mt-0.5">Tasa de acreditación</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveFilterTab('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    activeFilterTab === 'all'
                      ? 'bg-slate-900 text-white shadow-urp-brutal-sm'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Todos ({report.participantes.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveFilterTab('Acreditado')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    activeFilterTab === 'Acreditado'
                      ? 'bg-emerald-600 text-white shadow-urp-brutal-sm'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  Acreditados ({report.totalAcreditados})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveFilterTab('Espontaneo')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    activeFilterTab === 'Espontaneo'
                      ? 'bg-amber-500 text-white shadow-urp-brutal-sm'
                      : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  Espontáneos ({report.totalEspontaneos})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveFilterTab('Inasistencia')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    activeFilterTab === 'Inasistencia'
                      ? 'bg-red-600 text-white shadow-urp-brutal-sm'
                      : 'bg-red-50 text-red-800 border border-red-200 hover:bg-red-100'
                  }`}
                >
                  Inasistencias ({report.totalInasistencias})
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative min-w-[200px] flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar documento o nombre..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008744]"
                  />
                </div>

                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
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
                    <th className="py-3 px-4">Marcación Teams</th>
                    <th className="py-3 px-4">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs font-medium text-slate-700">
                  {filteredParticipants.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-slate-400 font-bold">
                        No se encontraron participantes que coincidan con los filtros aplicados.
                      </td>
                    </tr>
                  ) : (
                    filteredParticipants.map((p, index) => (
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
              <span>Mostrando {filteredParticipants.length} de {report.participantes.length} participantes</span>
              <span className="text-[11px]">BVE-FAMURP &bull; Sistema de Gestión de Capacitaciones</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
