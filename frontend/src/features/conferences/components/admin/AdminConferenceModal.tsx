import React, { useState, useEffect } from 'react';
import { Calendar, X, ShieldAlert, Loader2, Save } from 'lucide-react';
import { ConferenceSummary, CreateConferenceRequest, UpdateConferenceRequest } from '../../types';
import { conferenceService } from '../../services/conferenceService';


interface AdminConferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
  editingConference: ConferenceSummary | null;
  onShowFeedback: (msg: string) => void;
}

export const AdminConferenceModal: React.FC<AdminConferenceModalProps> = ({
  isOpen,
  onClose,
  onSaveSuccess,
  editingConference,
  onShowFeedback,
}) => {
  const [formTitulo, setFormTitulo] = useState('');
  const [formPonente, setFormPonente] = useState('');
  const [formEditorial, setFormEditorial] = useState('');
  const [formInicio, setFormInicio] = useState('');
  const [formFin, setFormFin] = useState('');
  const [formModalidad, setFormModalidad] = useState<'Virtual' | 'Presencial'>('Virtual');
  const [formEnlace, setFormEnlace] = useState('');
  const [formAutoPurge, setFormAutoPurge] = useState(true);
  const [formEstado, setFormEstado] = useState('Programada');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

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

  useEffect(() => {
    if (isOpen) {
      setModalError(null);
      if (editingConference) {
        setFormTitulo(editingConference.tituloEvento);
        setFormPonente(editingConference.expositorPonente);
        setFormEditorial(editingConference.entidadEditorial);
        setFormInicio(formatForDatetimeLocal(editingConference.fechaHoraInicio));
        setFormFin(formatForDatetimeLocal(editingConference.fechaHoraFin));
        setFormModalidad(editingConference.modalidad === 'Presencial' ? 'Presencial' : 'Virtual');
        setFormEnlace(editingConference.enlaceVirtual || '');
        setFormAutoPurge(editingConference.autoPurgar30Dias);
        setFormEstado(editingConference.estadoEvento);
      } else {
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
      }
    }
  }, [isOpen, editingConference]);

  if (!isOpen) return null;

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
          autoPurgar30Dias: formAutoPurge,
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
          autoPurgar30Dias: formAutoPurge,
        };
        await conferenceService.createConference(createPayload);
        onShowFeedback('Conferencia creada y publicada exitosamente.');
      }
      onSaveSuccess();
      onClose();
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => !isSubmitting && onClose()}
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
            onClick={onClose}
            disabled={isSubmitting}
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
              onClick={onClose}
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
  );
};
