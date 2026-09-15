import * as XLSX from 'xlsx';
import { ConferenceReport, ParticipantRecord } from '../../conferences/types';

export const excelExportService = {
  exportReport(report: ConferenceReport): void {
    const wb = XLSX.utils.book_new();

    const summaryData = [
      ['UNIVERSIDAD RICARDO PALMA - FACULTAD DE MEDICINA HUMANA'],
      ['BIBLIOTECA VIRTUAL Y ESPECIALIZADA (BVE-FAMURP)'],
      ['REPORTE OFICIAL DE CAPACITACIÓN Y ASISTENCIAS ALFIN'],
      [''],
      ['DATOS DE LA ACTIVIDAD ACADÉMICA'],
      ['ID Conferencia:', report.conferencia.idConferencia],
      ['Título del Evento:', report.conferencia.tituloEvento],
      ['Expositor / Ponente:', report.conferencia.expositorPonente],
      ['Entidad / Editorial:', report.conferencia.entidadEditorial],
      ['Modalidad:', report.conferencia.modalidad],
      ['Estado del Evento:', report.conferencia.estadoEvento],
      ['Fecha y Hora de Inicio:', new Date(report.conferencia.fechaHoraInicio).toLocaleString()],
      ['Fecha y Hora de Fin:', new Date(report.conferencia.fechaHoraFin).toLocaleString()],
      [''],
      ['CONSOLIDADO DE AUDITORÍA Y ACREDITACIÓN'],
      ['Total de Pre-inscritos:', report.totalInscritos],
      ['Total de Asistentes en Sesión:', report.totalAsistentes],
      ['Acreditados (Inscritos que Asistieron):', report.totalAcreditados],
      ['Asistentes Espontáneos (Sin Pre-inscripción):', report.totalEspontaneos],
      ['Inasistencias (Inscritos que Faltaron):', report.totalInasistencias],
      ['Efectividad de Asistencia (%):', report.totalInscritos > 0 
        ? `${Math.round((report.totalAcreditados / report.totalInscritos) * 100)}%` 
        : '100%'],
      [''],
      ['Fecha de Emisión del Documento:', new Date().toLocaleString()]
    ];

    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    wsSummary['!cols'] = [{ wch: 35 }, { wch: 45 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumen');

    const mapParticipantsToRows = (records: ParticipantRecord[]) => {
      return records.map((r, index) => ({
        'N°': index + 1,
        'Tipo Doc': r.tipoDocumento,
        'N° Documento': r.numeroDocumento,
        'Apellidos': r.apellidos,
        'Nombres': r.nombres,
        'Rol': r.tipoParticipante,
        'Ciclo': r.cicloAcademico ? `${r.cicloAcademico}°` : 'N/A',
        'Correo Institucional': r.correo,
        'Fecha Registro': r.fechaHoraRegistro ? new Date(r.fechaHoraRegistro).toLocaleString() : 'No Aplica',
        'Hora Marcación': r.fechaHoraMarcacion ? new Date(r.fechaHoraMarcacion).toLocaleTimeString() : 'Sin Registro',
        'Estado': r.estado
      }));
    };

    const acreditados = report.participantes.filter(p => p.estado === 'Acreditado');
    const wsAcreditados = XLSX.utils.json_to_sheet(mapParticipantsToRows(acreditados));
    wsAcreditados['!cols'] = [
      { wch: 5 }, { wch: 12 }, { wch: 15 }, { wch: 25 }, { wch: 25 }, 
      { wch: 15 }, { wch: 8 }, { wch: 32 }, { wch: 20 }, { wch: 20 }, { wch: 15 }
    ];
    XLSX.utils.book_append_sheet(wb, wsAcreditados, 'Acreditados (Oficial)');

    const espontaneos = report.participantes.filter(p => p.estado === 'Espontaneo');
    if (espontaneos.length > 0) {
      const wsEspontaneos = XLSX.utils.json_to_sheet(mapParticipantsToRows(espontaneos));
      wsEspontaneos['!cols'] = [
        { wch: 5 }, { wch: 12 }, { wch: 15 }, { wch: 25 }, { wch: 25 }, 
        { wch: 15 }, { wch: 8 }, { wch: 32 }, { wch: 20 }, { wch: 20 }, { wch: 15 }
      ];
      XLSX.utils.book_append_sheet(wb, wsEspontaneos, 'Asistentes Espontáneos');
    }

    const inasistencias = report.participantes.filter(p => p.estado === 'Inasistencia');
    if (inasistencias.length > 0) {
      const wsInasistencias = XLSX.utils.json_to_sheet(mapParticipantsToRows(inasistencias));
      wsInasistencias['!cols'] = [
        { wch: 5 }, { wch: 12 }, { wch: 15 }, { wch: 25 }, { wch: 25 }, 
        { wch: 15 }, { wch: 8 }, { wch: 32 }, { wch: 20 }, { wch: 20 }, { wch: 15 }
      ];
      XLSX.utils.book_append_sheet(wb, wsInasistencias, 'Inasistencias');
    }

    const cleanTitle = report.conferencia.tituloEvento
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .slice(0, 30);

    const filename = `ALFIN_URP_${cleanTitle}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, filename);
  }
};
