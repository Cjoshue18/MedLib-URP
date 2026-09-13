import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar, 
  Clock, 
  User, 
  Users, 
  Radio, 
  BarChart3, 
  Edit3, 
  Trash2, 
  Link, 
  Check, 
  Loader2, 
  X, 
  Save, 
  ShieldAlert, 
  Video, 
  MapPin, 
  Building2 
} from 'lucide-react';
import { ConferenceSummary, CreateConferenceRequest, UpdateConferenceRequest } from '../types';
import { conferenceService } from '../services/conferenceService';

interface AdminConferencesTabProps {
  onNavigateToStats: (conferenceId: number) => void;
  onShowFeedback: (msg: string) => void;
}

export const AdminConferencesTab: React.FC<AdminConferencesTabProps> = ({
  onNavigateToStats,
  onShowFeedback
}) => {
  const [conferences, setConferences] = useState<ConferenceSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConference, setEditingConference] = useState<ConferenceSummary | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const [copiedLink, setCopiedLink] = useState<{ id: number; type: 'reg' | 'att' } | null>(null);

  const [formTitulo, setFormTitulo] = useState('');
  const [formPonente, setFormPonente] = useState('');
  const [formEditorial, setFormEditorial] = useState('');
  const [formInicio, setFormInicio] = useState('');
  const [formFin, setFormFin] = useState('');
  const [formModalidad, setFormModalidad] = useState<'Virtual' | 'Presencial'>('Virtual');
  const [formEnlace, setFormEnlace] = useState('');
  const [formAutoPurge, setFormAutoPurge] = useState(true);
  const [formEstado, setFormEstado] = useState('Programada');

  const loadConferences = async () => {
    setIsLoading(true);
    try {
      const data = await conferenceService.getAdminConferences();
      setConferences(data);
    } catch {
      setConferences([]);
      onShowFeedback('Error al cargar la lista de conferencias.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConferences();
  }, []);

  const formatForDatetimeLocal = (isoString?: string): string => {
    if (!isoString) {
      const d = new Date();
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      return d.toISOString().slice(0, 16);
    }
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  const handleOpenCreateModal = () => {
    setEditingConference(null);
    setFormTitulo('');
    setFormPonente('');
    setFormEditorial('FAMURP ALFIN');
    const now = new Date();
    setFormInicio(formatForDatetimeLocal(now.toISOString()));
    const twoHoursLater = new Date(now.getTime() + 7200000);
    setFormFin(formatForDatetimeLocal(twoHoursLater.toISOString()));
    setFormModalidad('Virtual');
    setFormEnlace('https://teams.microsoft.com/l/meetup-join/famurp-alfin');
    setFormAutoPurge(true);
    setFormEstado('Programada');
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (conf: ConferenceSummary) => {
    setEditingConference(conf);
    setFormTitulo(conf.tituloEvento);
    setFormPonente(conf.expositorPonente);
    setFormEditorial(conf.entidadEditorial);
    setFormInicio(formatForDatetimeLocal(conf.fechaHoraInicio));
    setFormFin(formatForDatetimeLocal(conf.fechaHoraFin));
    setFormModalidad(conf.modalidad === 'Presencial' ? 'Presencial' : 'Virtual');
    setFormEnlace(conf.enlaceVirtual || '');
    setFormAutoPurge(conf.autoPurgar30Dias);
    setFormEstado(conf.estadoEvento);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleSaveConference = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!formTitulo.trim() || !formPonente.trim()) {
      setModalError('El título del evento y el expositor son obligatorios.');
      return;
    }

    if (!formInicio || !formFin) {
      setModalError('Debe definir fecha y hora de inicio y finalización.');
      return;
    }

    const startDate = new Date(formInicio);
    const endDate = new Date(formFin);
    if (endDate <= startDate) {
      setModalError('La fecha de fin debe ser posterior a la fecha de inicio.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingConference) {
        const updatePayload: UpdateConferenceRequest = {
          tituloEvento: formTitulo.trim(),
          expositorPonente: formPonente.trim(),
          entidadEditorial: formEditorial.trim() || 'FAMURP ALFIN',
          fechaHoraInicio: startDate.toISOString(),
          fechaHoraFin: endDate.toISOString(),
          modalidad: formModalidad,
          enlaceVirtual: formEnlace.trim() || null,
          estadoEvento: formEstado,
          autoPurgar30Dias: formAutoPurge
        };
        await conferenceService.updateConference(editingConference.idConferencia, updatePayload);
        onShowFeedback('Conferencia actualizada exitosamente.');
      } else {
        const createPayload: CreateConferenceRequest = {
          tituloEvento: formTitulo.trim(),
          expositorPonente: formPonente.trim(),
          entidadEditorial: formEditorial.trim() || 'FAMURP ALFIN',
          fechaHoraInicio: startDate.toISOString(),
          fechaHoraFin: endDate.toISOString(),
          modalidad: formModalidad,
          enlaceVirtual: formEnlace.trim() || null,
          autoPurgar30Dias: formAutoPurge
        };
        await conferenceService.createConference(createPayload);
        onShowFeedback('Conferencia creada y publicada exitosamente.');
      }
      setIsModalOpen(false);
      await loadConferences();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setModalError(err.message);
      } else {
        setModalError('Error al guardar la conferencia.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAttendance = async (conf: ConferenceSummary) => {
    try {
      const res = await conferenceService.toggleAttendance(conf.idConferencia);
      onShowFeedback(res.message);
      if (res.asistenciaAbierta) {
        const directAttendanceLink = `${window.location.origin}${window.location.pathname}#conferencias?asistencia=${conf.idConferencia}`;
        navigator.clipboard.writeText(directAttendanceLink);
        onShowFeedback('Asistencia Habilitada y Enlace Copiado al Portapapeles para Teams.');
      }
      await loadConferences();
    } catch (err: unknown) {
      if (err instanceof Error) {
        onShowFeedback(err.message);
      }
    }
  };

  const handleTogglePurge = async (conf: ConferenceSummary) => {
    try {
      const res = await conferenceService.togglePurge(conf.idConferencia);
      onShowFeedback(res.message);
      await loadConferences();
    } catch (err: unknown) {
      if (err instanceof Error) {
        onShowFeedback(err.message);
      }
    }
  };

  const handleDelete = async (conf: ConferenceSummary) => {
    const confirmDelete = window.confirm(`¿Estás seguro de eliminar la conferencia "${conf.tituloEvento}"? Esta acción eliminará también sus listas de inscripciones y asistencias.`);
    if (!confirmDelete) return;

    try {
      await conferenceService.deleteConference(conf.idConferencia);
      onShowFeedback('Conferencia eliminada correctamente.');
      await loadConferences();
    } catch (err: unknown) {
      if (err instanceof Error) {
        onShowFeedback(err.message);
      }
    }
  };

  const handleCopyLink = (id: number, type: 'reg' | 'att') => {
    const url = `${window.location.origin}${window.location.pathname}#conferencias?${type === 'reg' ? 'inscripcion' : 'asistencia'}=${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink({ id, type });
      setTimeout(() => setCopiedLink(null), 2500);
      onShowFeedback(type === 'reg' ? 'Enlace de Pre-inscripción copiado.' : 'Enlace de Marcación en Vivo copiado.');
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-[10px] font-black tracking-wider uppercase text-[#008744] block">
            Jefatura ALFIN &amp; Eventos Médicos
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-black text-slate-900">
            Gestión de Conferencias y Capacitaciones
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Administra convocatorias, activa asistencia en tiempo real y gestiona políticas de retención.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#008744] hover:bg-[#006b35] text-white font-bold text-xs sm:text-sm shadow-urp-brutal-green tactile-btn-green transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Conferencia ALFIN</span>
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#008744] animate-spin" />
          <p className="text-xs font-bold text-slate-600">Cargando catálogo de conferencias...</p>
        </div>
      ) : conferences.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-xs text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#008744] flex items-center justify-center mx-auto border border-emerald-300">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No hay conferencias registradas</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Comienza publicando la primera capacitación ALFIN para habilitar pre-inscripciones y marcación de asistencia en Teams.
          </p>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="py-2.5 px-5 rounded-xl bg-[#008744] text-white font-bold text-xs shadow-urp-brutal-sm tactile-btn cursor-pointer"
          >
            Crear Primera Conferencia
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {conferences.map((conf) => {
            const startDate = new Date(conf.fechaHoraInicio);
            const endDate = new Date(conf.fechaHoraFin);
            const isCopiedReg = copiedLink?.id === conf.idConferencia && copiedLink?.type === 'reg';
            const isCopiedAtt = copiedLink?.id === conf.idConferencia && copiedLink?.type === 'att';

            return (
              <div 
                key={conf.idConferencia}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col lg:flex-row"
              >
                <div className={`p-6 min-w-[140px] flex flex-col justify-between items-center text-center font-display border-b lg:border-b-0 lg:border-r border-slate-200 ${
                  conf.asistenciaAbierta 
                    ? 'bg-emerald-600 text-white' 
                    : conf.estadoEvento === 'Cancelada' 
                      ? 'bg-red-700 text-white' 
                      : 'bg-slate-900 text-white'
                }`}>
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
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20">
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
                        onClick={() => handleCopyLink(conf.idConferencia, 'reg')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                        title="Copiar enlace de pre-inscripción para alumnos"
                      >
                        {isCopiedReg ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Link className="w-3.5 h-3.5 text-slate-500" />}
                        <span>{isCopiedReg ? 'Enlace Copiado' : 'Link Inscripción'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyLink(conf.idConferencia, 'att')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                        title="Copiar enlace directo de asistencia para Teams"
                      >
                        {isCopiedAtt ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Link className="w-3.5 h-3.5 text-slate-500" />}
                        <span>{isCopiedAtt ? 'Enlace Copiado' : 'Link Asistencia'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTogglePurge(conf)}
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
                      <button
                        type="button"
                        onClick={() => handleToggleAttendance(conf)}
                        className={`py-2 px-3.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                          conf.asistenciaAbierta
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-[#008744] hover:bg-[#006b35] text-white'
                        }`}
                      >
                        <Radio className={`w-3.5 h-3.5 ${conf.asistenciaAbierta ? 'animate-pulse' : ''}`} />
                        <span>{conf.asistenciaAbierta ? 'Cerrar Asistencia' : 'Habilitar Asistencia'}</span>
                      </button>

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
                        onClick={() => handleOpenEditModal(conf)}
                        className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Editar conferencia"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(conf)}
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
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col z-10 max-h-[92vh]">
            <div className="bg-[#008744] text-white px-6 py-5 flex items-center justify-between border-b border-emerald-700">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-display font-black leading-tight text-white">
                    {editingConference ? 'Editar Conferencia ALFIN' : 'Nueva Conferencia Médica'}
                  </h2>
                  <p className="text-[10px] text-emerald-100">
                    Facultad de Medicina Humana URP
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveConference} className="p-6 overflow-y-auto space-y-4">
              {modalError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">
                  Título del Evento o Capacitación:
                </label>
                <input
                  type="text"
                  value={formTitulo}
                  onChange={(e) => setFormTitulo(e.target.value)}
                  placeholder="Ej. Búsqueda Avanzada en bases biomédicas para Revisiones Sistemáticas"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#008744]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1">
                    Expositor / Ponente:
                  </label>
                  <input
                    type="text"
                    value={formPonente}
                    onChange={(e) => setFormPonente(e.target.value)}
                    placeholder="Ej. Dra. Patricia Valenzuela"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#008744]"
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1">
                    Entidad / Editorial Patrocinadora:
                  </label>
                  <input
                    type="text"
                    value={formEditorial}
                    onChange={(e) => setFormEditorial(e.target.value)}
                    placeholder="Ej. Elsevier Clinical Solutions / URP"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#008744]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1">
                    Fecha y Hora de Inicio:
                  </label>
                  <input
                    type="datetime-local"
                    value={formInicio}
                    onChange={(e) => setFormInicio(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008744]"
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1">
                    Fecha y Hora de Finalización:
                  </label>
                  <input
                    type="datetime-local"
                    value={formFin}
                    onChange={(e) => setFormFin(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008744]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1">
                    Modalidad:
                  </label>
                  <select
                    value={formModalidad}
                    onChange={(e) => setFormModalidad(e.target.value as 'Virtual' | 'Presencial')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008744]"
                  >
                    <option value="Virtual">Virtual (Microsoft Teams / Zoom)</option>
                    <option value="Presencial">Presencial (Campus URP)</option>
                  </select>
                </div>
                {editingConference && (
                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">
                      Estado del Evento:
                    </label>
                    <select
                      value={formEstado}
                      onChange={(e) => setFormEstado(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008744]"
                    >
                      <option value="Programada">Programada</option>
                      <option value="En Curso">En Curso</option>
                      <option value="Finalizada">Finalizada</option>
                      <option value="Cancelada">Cancelada</option>
                    </select>
                  </div>
                )}
              </div>

              {formModalidad === 'Virtual' && (
                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1">
                    Enlace de la Sala Virtual (Teams / Zoom):
                  </label>
                  <input
                    type="url"
                    value={formEnlace}
                    onChange={(e) => setFormEnlace(e.target.value)}
                    placeholder="https://teams.microsoft.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#008744]"
                  />
                </div>
              )}

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Purga Automática de Participantes a 30 días
                  </span>
                  <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                    Elimina datos de pre-inscripción y asistencia 30 días después del evento según Ley 29733. Desactivar para retención permanente.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formAutoPurge}
                  onChange={(e) => setFormAutoPurge(e.target.checked)}
                  className="w-5 h-5 rounded text-[#008744] focus:ring-[#008744] cursor-pointer"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-2.5 px-6 rounded-xl bg-[#008744] hover:bg-[#006b35] text-white font-bold text-xs shadow-urp-brutal-sm tactile-btn transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingConference ? 'Guardar Cambios' : 'Publicar Conferencia'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
