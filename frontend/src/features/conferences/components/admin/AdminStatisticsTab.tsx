import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCw, Calendar, Loader2, FileSpreadsheet } from 'lucide-react';
import { ConferenceSummary, ConferenceReport, ParticipantRecord } from '../../types';
import { conferenceService } from '../../services/conferenceService';
import { excelExportService } from '../../../attendance/services/excelExportService';
import { MONTH_NAMES_ES } from '../../../../utils/dateFormatter';
import { ConferenceReportFilterBar } from './ConferenceReportFilterBar';
import { ConferenceReportHeader } from './ConferenceReportHeader';
import { ConferenceReportSummaryCards } from './ConferenceReportSummaryCards';
import { ConferenceReportParticipantsTable } from './ConferenceReportParticipantsTable';

interface AdminStatisticsTabProps {
  initialConferenceId?: number | null;
  onShowFeedback: (msg: string) => void;
}

export const AdminStatisticsTab: React.FC<AdminStatisticsTabProps> = ({
  initialConferenceId,
  onShowFeedback,
}) => {
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth());
  const [conferences, setConferences] = useState<ConferenceSummary[]>([]);
  const [selectedConferenceId, setSelectedConferenceId] = useState<number | null>(initialConferenceId || null);
  const [report, setReport] = useState<ConferenceReport | null>(null);
  const [isLoadingConferences, setIsLoadingConferences] = useState(false);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'Acreditado' | 'Espontaneo' | 'Inasistencia'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  const availableYears = useMemo(() => {
    const currentY = new Date().getFullYear();
    const yearSet = new Set<number>([currentY - 1, currentY, currentY + 1]);
    conferences.forEach((c) => {
      const y = new Date(c.fechaHoraInicio).getFullYear();
      if (!isNaN(y)) yearSet.add(y);
    });
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [conferences]);

  const filteredConferences = useMemo(() => {
    return conferences.filter((c) => {
      const d = new Date(c.fechaHoraInicio);
      return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
    });
  }, [conferences, selectedYear, selectedMonth]);

  const loadConferencesList = async () => {
    setIsLoadingConferences(true);
    try {
      const data = await conferenceService.getAdminConferences();
      setConferences(data);
    } catch {
      setConferences([]);
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
    if (initialConferenceId && conferences.length > 0) {
      const target = conferences.find((c) => c.idConferencia === initialConferenceId);
      if (target) {
        const d = new Date(target.fechaHoraInicio);
        setSelectedYear(d.getFullYear());
        setSelectedMonth(d.getMonth());
        setSelectedConferenceId(target.idConferencia);
      }
    }
  }, [initialConferenceId, conferences]);

  useEffect(() => {
    if (filteredConferences.length > 0) {
      const exists = filteredConferences.some((c) => c.idConferencia === selectedConferenceId);
      if (!exists) {
        setSelectedConferenceId(filteredConferences[0].idConferencia);
      }
    } else {
      setSelectedConferenceId(null);
      setReport(null);
    }
  }, [filteredConferences, selectedConferenceId]);

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
    const matchesSearch =
      !q ||
      p.nombres.toLowerCase().includes(q) ||
      p.apellidos.toLowerCase().includes(q) ||
      p.numeroDocumento.toLowerCase().includes(q) ||
      p.correo.toLowerCase().includes(q);

    return matchesTab && matchesRole && matchesSearch;
  });

  const pctAsistencia =
    report && report.totalInscritos > 0
      ? Math.round((report.totalAcreditados / report.totalInscritos) * 100)
      : report && report.totalAsistentes > 0
        ? 100
        : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
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
            className="p-3 rounded-lg border-2 border-slate-900 text-slate-700 hover:bg-slate-100 transition-colors shadow-urp-brutal-sm tactile-btn cursor-pointer disabled:opacity-50"
            title="Refrescar reporte"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingReport ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleExportExcel}
            disabled={!report || isLoadingReport}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#107C41] hover:bg-[#0c5e31] text-white font-bold text-xs sm:text-sm shadow-urp-brutal-sm tactile-btn cursor-pointer transition-all disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exportar Reporte Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      <ConferenceReportFilterBar
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        availableYears={availableYears}
        selectedConferenceId={selectedConferenceId}
        onConferenceIdChange={setSelectedConferenceId}
        filteredConferences={filteredConferences}
        isLoadingConferences={isLoadingConferences}
      />

      {isLoadingReport ? (
        <div className="bg-white p-12 rounded-lg border border-slate-200 shadow-xs flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#008744] animate-spin" />
          <p className="text-xs font-bold text-slate-600">Procesando y cruzando nóminas de asistencia...</p>
        </div>
      ) : filteredConferences.length === 0 ? (
        <div className="bg-white p-12 rounded-lg border border-slate-200 shadow-xs text-center space-y-2">
          <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">
            Sin conferencias en {MONTH_NAMES_ES[selectedMonth]} {selectedYear}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No se registran actividades para el mes seleccionado. Selecciona otro periodo en los filtros superiores para visualizar reportes.
          </p>
        </div>
      ) : !report ? (
        <div className="bg-white p-12 rounded-lg border border-slate-200 shadow-xs text-center">
          <p className="text-xs text-slate-500">Selecciona una conferencia para visualizar las estadísticas.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <ConferenceReportHeader report={report} />
          <ConferenceReportSummaryCards report={report} pctAsistencia={pctAsistencia} />
          <ConferenceReportParticipantsTable
            participants={filteredParticipants}
            totalCount={report.participantes.length}
            activeFilterTab={activeFilterTab}
            onFilterTabChange={setActiveFilterTab}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
            counts={{
              total: report.participantes.length,
              acreditados: report.totalAcreditados,
              espontaneos: report.totalEspontaneos,
              inasistencias: report.totalInasistencias,
            }}
          />
        </div>
      )}
    </div>
  );
};
