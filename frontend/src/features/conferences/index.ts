export type {
  TipoParticipante,
  TipoDocumento,
  ConferenceSummary,
  CreateConferenceRequest,
  UpdateConferenceRequest,
  RegisterParticipantRequest,
  MarkAttendanceRequest,
  ParticipantRecord,
  ConferenceReport,
} from './types';
export { conferenceService } from './services/conferenceService';

export { AdminConferencesTab } from './components/admin/AdminConferencesTab';
export { AdminConferenceCard } from './components/admin/AdminConferenceCard';
export { AdminConferenceModal } from './components/admin/AdminConferenceModal';
export { AdminStatisticsTab } from './components/admin/AdminStatisticsTab';
export { ConferenceReportSummaryCards } from './components/admin/ConferenceReportSummaryCards';
export { ConferenceReportParticipantsTable } from './components/admin/ConferenceReportParticipantsTable';

export { ConferenceMonthlyCalendar } from './components/calendar/ConferenceMonthlyCalendar';
export { ConferenceCard } from './components/calendar/ConferenceCard';

export { ConferenceParticipantFormFields } from './components/attendance/ConferenceParticipantFormFields';
export { ConferenceRegistrationView } from './components/attendance/ConferenceRegistrationView';
export { ConferenceRegistrationSuccessCard } from './components/attendance/ConferenceRegistrationSuccessCard';
export { AttendanceLiveView } from './components/attendance/AttendanceLiveView';
export { AttendanceLiveSuccessCard } from './components/attendance/AttendanceLiveSuccessCard';



