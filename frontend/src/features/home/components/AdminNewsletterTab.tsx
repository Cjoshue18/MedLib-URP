import React, { useState, useEffect, useMemo } from 'react';
import {
  Mail,
  RefreshCw,
  Search,
  Copy,
  Download,
  Trash2,
  Users,
  GraduationCap,
  BookOpen,
  Stethoscope,
  Award,
  Check,
  AlertCircle,
} from 'lucide-react';
import {
  newsletterService,
  SubscriberItem,
  NewsletterStats,
} from '../services/newsletterService';

interface AdminNewsletterTabProps {
  onShowFeedback: (message: string) => void;
}

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const AdminNewsletterTab: React.FC<AdminNewsletterTabProps> = ({ onShowFeedback }) => {
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>([]);
  const [stats, setStats] = useState<NewsletterStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'todos' | 'Pregrado' | 'Posgrado' | 'Residentado' | 'Docente' | 'Otro'>('todos');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

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
      `"${sub.correoInstitucional}"`,
      `"${sub.nivelAcademico}"`,
      `"${formatDate(sub.fechaSuscripcion)}"`,
      sub.estadoActivo ? 'Activo' : 'Inactivo',
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `suscriptores_boletin_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

  const getBadgeStyle = (level: string) => {
    switch (level) {
      case 'Pregrado':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Posgrado':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'Residentado':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Docente':
        return 'bg-purple-50 text-purple-800 border-purple-300';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-[#008744] border border-emerald-200">
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

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total</span>
            <Users className="w-4 h-4 text-[#008744]" />
          </div>
          <p className="text-2xl font-display font-black text-slate-900 mt-2">
            {stats ? stats.totalSuscriptores : subscribers.length}
          </p>
          <span className="text-[10px] text-slate-400 font-medium">Correos activos</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Pregrado</span>
            <BookOpen className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-display font-black text-emerald-800 mt-2">
            {stats ? stats.pregrado : subscribers.filter((s) => s.nivelAcademico === 'Pregrado').length}
          </p>
          <span className="text-[10px] text-slate-400 font-medium">Estudiantes pregrado</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Posgrado</span>
            <GraduationCap className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-display font-black text-blue-800 mt-2">
            {stats ? stats.posgrado : subscribers.filter((s) => s.nivelAcademico === 'Posgrado').length}
          </p>
          <span className="text-[10px] text-slate-400 font-medium">Maestrías/Doctorados</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Residentado</span>
            <Stethoscope className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-display font-black text-amber-800 mt-2">
            {stats ? stats.residentado : subscribers.filter((s) => s.nivelAcademico === 'Residentado').length}
          </p>
          <span className="text-[10px] text-slate-400 font-medium">Especialidades</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Docentes</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-display font-black text-purple-800 mt-2">
            {stats ? stats.docente : subscribers.filter((s) => s.nivelAcademico === 'Docente').length}
          </p>
          <span className="text-[10px] text-slate-400 font-medium">Cuerpo docente</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Otros</span>
            <Users className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-2xl font-display font-black text-slate-800 mt-2">
            {stats ? stats.otro : subscribers.filter((s) => s.nivelAcademico === 'Otro').length}
          </p>
          <span className="text-[10px] text-slate-400 font-medium">Otros estamentos</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por correo institucional..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#008744]"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {(['todos', 'Pregrado', 'Posgrado', 'Residentado', 'Docente', 'Otro'] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setSelectedLevel(level)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedLevel === level
                    ? 'bg-[#008744] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {level === 'todos' ? 'Todos' : level}
                <span className="ml-1.5 opacity-75">
                  (
                  {level === 'todos'
                    ? subscribers.length
                    : subscribers.filter((s) => s.nivelAcademico === level).length}
                  )
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Correo Institucional</th>
                <th className="py-3 px-4">Nivel Académico</th>
                <th className="py-3 px-4">Fecha Suscripción</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#008744] mb-2" />
                    <span>Cargando suscriptores del boletín...</span>
                  </td>
                </tr>
              ) : filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-slate-700">No se encontraron suscriptores</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {searchTerm
                        ? 'Ningún correo coincide con los términos de búsqueda.'
                        : 'Aún no hay correos registrados en esta categoría.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((sub, index) => (
                  <tr key={sub.idSuscriptor} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-center font-bold text-slate-400">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold flex items-center justify-center text-[10px] shrink-0">
                          {sub.correoInstitucional.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-900 select-all">
                          {sub.correoInstitucional}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${getBadgeStyle(
                          sub.nivelAcademico
                        )}`}
                      >
                        {sub.nivelAcademico}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-medium">
                      {formatDate(sub.fechaSuscripcion)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Activo
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleCopySingleEmail(sub.correoInstitucional)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#008744] hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Copiar correo"
                        >
                          {copiedEmail === sub.correoInstitucional ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSubscriber(sub.idSuscriptor, sub.correoInstitucional)}
                          disabled={isDeleting === sub.idSuscriptor}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                          title="Eliminar de la lista"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
