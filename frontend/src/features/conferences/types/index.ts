export type TipoParticipante = 'Pregrado' | 'Posgrado' | 'Docente' | 'Residentado' | 'Otro' | 'Estudiante';

export type TipoDocumento = 'DNI' | 'CODIGO_URP' | 'CE';

export interface ConferenceSummary {
  idConferencia: number;
  tituloEvento: string;
  expositorPonente: string;
  entidadEditorial: string;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  modalidad: string;
  enlaceVirtual: string | null;
  asistenciaAbierta: boolean;
  estadoEvento: string;
  autoPurgar30Dias: boolean;
  fechaCaducidadPurge: string | null;
  totalInscritos: number;
  totalAsistentes: number;
}

export interface CreateConferenceRequest {
  tituloEvento: string;
  expositorPonente: string;
  entidadEditorial: string;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  modalidad: string;
  enlaceVirtual?: string | null;
  autoPurgar30Dias: boolean;
}

export interface UpdateConferenceRequest {
  tituloEvento: string;
  expositorPonente: string;
  entidadEditorial: string;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  modalidad: string;
  enlaceVirtual?: string | null;
  estadoEvento: string;
  autoPurgar30Dias: boolean;
}

export interface RegisterParticipantRequest {
  tipoParticipante: TipoParticipante;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  correo: string;
  cicloAcademico: number | null;
}

export interface MarkAttendanceRequest {
  tipoParticipante: TipoParticipante;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  correo: string;
  cicloAcademico: number | null;
}

export interface ParticipantRecord {
  numeroDocumento: string;
  tipoDocumento: string;
  tipoParticipante: string;
  nombres: string;
  apellidos: string;
  correo: string;
  cicloAcademico: number | null;
  fechaHoraRegistro: string | null;
  fechaHoraMarcacion: string | null;
  estado: 'Acreditado' | 'Espontaneo' | 'Inasistencia';
}

export interface ConferenceReport {
  conferencia: ConferenceSummary;
  totalInscritos: number;
  totalAsistentes: number;
  totalAcreditados: number;
  totalEspontaneos: number;
  totalInasistencias: number;
  participantes: ParticipantRecord[];
}
