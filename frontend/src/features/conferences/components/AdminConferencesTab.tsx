import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Loader2 } from 'lucide-react';
import { ConferenceSummary } from '../types';
import { conferenceService } from '../services/conferenceService';
import { AdminConferenceModal } from './AdminConferenceModal';
import { AdminConferenceCard } from './AdminConferenceCard';

interface AdminConferencesTabProps {
  onNavigateToStats: (conferenceId: number) => void;
  onShowFeedback: (msg: string) => void;
}

export const AdminConferencesTab: React.FC<AdminConferencesTabProps> = ({
  onNavigateToStats,
  onShowFeedback,
}) => {
  const [conferences, setConferences] = useState<ConferenceSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConference, setEditingConference] = useState<ConferenceSummary | null>(null);
  const [copiedLink, setCopiedLink] = useState<{ id: number; type: 'reg' | 'att' } | null>(null);

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

  const handleOpenCreateModal = () => {
    setEditingConference(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (conf: ConferenceSummary) => {
    setEditingConference(conf);
    setIsModalOpen(true);
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
    const confirmDelete = window.confirm(
      `¿Estás seguro de eliminar la conferencia "${conf.tituloEvento}"? Esta acción eliminará también sus listas de inscripciones y asistencias.`
    );
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
          {conferences.map((conf) => (
            <AdminConferenceCard
              key={conf.idConferencia}
              conf={conf}
              copiedLink={copiedLink}
              onCopyLink={handleCopyLink}
              onTogglePurge={handleTogglePurge}
              onToggleAttendance={handleToggleAttendance}
              onNavigateToStats={onNavigateToStats}
              onEdit={handleOpenEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <AdminConferenceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveSuccess={loadConferences}
        editingConference={editingConference}
        onShowFeedback={onShowFeedback}
      />
    </div>
  );
};
