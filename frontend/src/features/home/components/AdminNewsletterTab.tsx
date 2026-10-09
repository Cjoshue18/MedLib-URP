import React, { useState, useEffect, useMemo } from 'react';
import { Mail, RefreshCw, Copy, Download } from 'lucide-react';
import {
  newsletterService,
  SubscriberItem,
  NewsletterStats,
} from '../services/newsletterService';
import { exportToCsv } from '../../../utils/csvExport';
import { formatDate } from '../../../utils/dateFormatter';
import { AcademicLevelFilter } from '../../../types/academicLevel';
import { AdminNewsletterStats } from './AdminNewsletterStats';
import { AdminNewsletterTable } from './AdminNewsletterTable';

interface AdminNewsletterTabProps {
  onShowFeedback: (message: string) => void;
}

export const AdminNewsletterTab: React.FC<AdminNewsletterTabProps> = ({ onShowFeedback }) => {
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>([]);
  const [stats, setStats] = useState<NewsletterStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<AcademicLevelFilter>('todos');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [subsData, statsData] = await Promise.all([
        newsletterService.getSubscribers(),
        newsletterService.getStats(),
      ]);
      setSubscribers(subsData);
      setStats(statsData);
    } catch {
      onShowFeedback('Error al cargar la lista de suscriptores del boletín.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSyncConferences = async () => {
    setIsSyncing(true);
    try {
      const res = await newsletterService.syncFromConferences();
      onShowFeedback(res.message);
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al sincronizar correos de conferencias.';
      onShowFeedback(msg);
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((sub) => {
      const matchesSearch = sub.correoInstitucional.toLowerCase().includes(searchTerm.trim().toLowerCase());
      const matchesLevel = selectedLevel === 'todos' || sub.nivelAcademico === selectedLevel;
      return matchesSearch && matchesLevel;
    });
  }, [subscribers, searchTerm, selectedLevel]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLevel]);

  const totalPages = Math.ceil(filteredSubscribers.length / ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filteredSubscribers.length, totalPages, currentPage]);

  const paginatedSubscribers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSubscribers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSubscribers, currentPage]);

  const handleCopySingleEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(email);
      setTimeout(() => setCopiedEmail(null), 2500);
      onShowFeedback(`Copiado al portapapeles: ${email}`);
    } catch {
      onShowFeedback('No se pudo copiar el correo al portapapeles.');
    }
  };

  const handleCopyAllEmails = async () => {
    if (filteredSubscribers.length === 0) return;
    const emailsString = filteredSubscribers.map((s) => s.correoInstitucional).join('; ');
    try {
      await navigator.clipboard.writeText(emailsString);
      onShowFeedback(`Se copiaron ${filteredSubscribers.length} correos al portapapeles.`);
    } catch {
      onShowFeedback('Error al copiar correos al portapapeles.');
    }
  };

  const handleExportCsv = () => {
    if (filteredSubscribers.length === 0) return;

    const headers = ['ID', 'Correo Institucional', 'Nivel Académico', 'Fecha Registro', 'Estado'];
    const rows = filteredSubscribers.map((sub) => [
      sub.idSuscriptor,
      sub.correoInstitucional,
      sub.nivelAcademico,
      formatDate(sub.fechaSuscripcion),
      sub.estadoActivo ? 'Activo' : 'Inactivo',
    ]);

    exportToCsv(`suscriptores_boletin_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
    onShowFeedback('Archivo CSV exportado exitosamente.');
  };

  const handleDeleteSubscriber = async (idSuscriptor: number, email: string) => {
    const confirmed = window.confirm(`¿Confirmas que deseas eliminar de la lista de suscripción a "${email}"?`);
    if (!confirmed) return;

    setIsDeleting(idSuscriptor);
    try {
      await newsletterService.deleteSubscriber(idSuscriptor);
      onShowFeedback(`Suscriptor ${email} retirado correctamente.`);
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar suscriptor.';
      onShowFeedback(msg);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-50 text-[#008744] border border-emerald-200">
              <Mail className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-display font-black text-slate-900 tracking-tight">
                Suscriptores del Boletín
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Audiencia médica registrada para boletines, novedades y alertas bibliográficas
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleSyncConferences}
            disabled={isLoading || isSyncing}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
            title="Importar y sincronizar correos de inscripciones y asistencias de conferencias"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Conferencias'}</span>
          </button>

          <button
            type="button"
            onClick={loadData}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
            title="Recargar suscriptores"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Actualizar</span>
          </button>

          <button
            type="button"
            onClick={handleCopyAllEmails}
            disabled={filteredSubscribers.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
            title="Copiar todos los correos filtrados para enviar correos masivos"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copiar Correos ({filteredSubscribers.length})</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            disabled={filteredSubscribers.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#008744] hover:bg-[#006b35] text-white text-xs font-bold transition-all cursor-pointer shadow-urp-brutal-green tactile-btn-green disabled:opacity-50"
            title="Descargar lista en formato CSV para Excel"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      <AdminNewsletterStats stats={stats} subscribers={subscribers} />

      <AdminNewsletterTable
        subscribers={subscribers}
        filteredSubscribers={filteredSubscribers}
        paginatedSubscribers={paginatedSubscribers}
        isLoading={isLoading}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        selectedLevel={selectedLevel}
        onSelectedLevelChange={setSelectedLevel}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
        copiedEmail={copiedEmail}
        isDeleting={isDeleting}
        onCopySingleEmail={handleCopySingleEmail}
        onDeleteSubscriber={handleDeleteSubscriber}
      />
    </div>
  );
};
