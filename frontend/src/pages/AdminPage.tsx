import React, { useState, useEffect } from 'react';
import { ExternalLink, LogOut, CheckCircle2, RefreshCw, Plus } from 'lucide-react';
import { authService, AdminLoginForm } from '../features/auth';
import {
  resourceService,
  DatabaseSearchBar,
  AdminMetricsGrid,
  AdminResourceTable,
  AdminResourceModal,
  ResourceFormData,
  ResourceApiDto,
  CreateResourceApiRequest,
  UpdateResourceApiRequest,
} from '../features/guides';

interface AdminPageProps {
  onNavigate: (view: 'home' | 'directory' | 'conferences' | 'lost-found' | 'admin') => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());
  const [resources, setResources] = useState<ResourceApiDto[]>([]);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [licenseFilter, setLicenseFilter] = useState<'all' | 'subscription' | 'open'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResourceData, setEditingResourceData] = useState<ResourceFormData | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const loadResources = async () => {
    setIsLoadingResources(true);
    try {
      const data = await resourceService.getAdminResources();
      setResources(data);
    } catch {
      setResources([]);
    } finally {
      setIsLoadingResources(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadResources();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setResources([]);
  };

  const handleOpenCreateModal = () => {
    setEditingResourceData(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (res: ResourceApiDto) => {
    setEditingResourceData({
      id: res.id,
      name: res.name,
      logoUrl: res.logoUrl || '',
      clinicalDescription: res.clinicalDescription || '',
      isSubscription: res.isSubscription,
      hasMobileApp: res.hasMobileApp,
      externalUrl: res.externalUrl || '',
      isActive: res.isActive,
      subjectsStr: (res.subjects || []).join(', '),
      youtubeVideoId: res.tutorial?.youtubeVideoId || '',
      videoTitle: res.tutorial?.videoTitle || '',
      guidePdfUrl: res.tutorial?.guidePdfUrl || '',
    });
    setIsModalOpen(true);
  };

  const handleSaveResource = async (formData: ResourceFormData) => {
    const parsedSubjects = formData.subjectsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (formData.id) {
      const updateReq: UpdateResourceApiRequest = {
        name: formData.name.trim(),
        logoUrl: formData.logoUrl.trim() || null,
        clinicalDescription: formData.clinicalDescription.trim() || null,
        isSubscription: formData.isSubscription,
        hasMobileApp: formData.hasMobileApp,
        externalUrl: formData.externalUrl.trim() || null,
        isActive: formData.isActive,
        subjects: parsedSubjects,
        youtubeVideoId: formData.youtubeVideoId.trim() || null,
        videoTitle: formData.videoTitle.trim() || null,
        guidePdfUrl: formData.guidePdfUrl.trim() || null,
      };
      await resourceService.updateResource(formData.id, updateReq);
      setStatusFeedback(`Recurso "${formData.name}" actualizado con éxito.`);
    } else {
      const createReq: CreateResourceApiRequest = {
        name: formData.name.trim(),
        logoUrl: formData.logoUrl.trim() || null,
        clinicalDescription: formData.clinicalDescription.trim() || null,
        isSubscription: formData.isSubscription,
        hasMobileApp: formData.hasMobileApp,
        externalUrl: formData.externalUrl.trim() || null,
        subjects: parsedSubjects,
        youtubeVideoId: formData.youtubeVideoId.trim() || null,
        videoTitle: formData.videoTitle.trim() || null,
        guidePdfUrl: formData.guidePdfUrl.trim() || null,
      };
      await resourceService.createResource(createReq);
      setStatusFeedback(`Recurso "${formData.name}" registrado correctamente.`);
    }

    await loadResources();
    setTimeout(() => setStatusFeedback(null), 4000);
  };

  const handleToggleActive = async (res: ResourceApiDto) => {
    setTogglingId(res.id);
    try {
      const updateReq: UpdateResourceApiRequest = {
        name: res.name,
        logoUrl: res.logoUrl,
        clinicalDescription: res.clinicalDescription,
        isSubscription: res.isSubscription,
        hasMobileApp: res.hasMobileApp,
        externalUrl: res.externalUrl,
        isActive: !res.isActive,
        subjects: res.subjects || [],
        youtubeVideoId: res.tutorial?.youtubeVideoId,
        videoTitle: res.tutorial?.videoTitle,
        guidePdfUrl: res.tutorial?.guidePdfUrl,
      };
      await resourceService.updateResource(res.id, updateReq);
      setResources((prev) =>
        prev.map((r) => (r.id === res.id ? { ...r, isActive: !r.isActive } : r))
      );
      setStatusFeedback(`Estado de "${res.name}" actualizado a ${!res.isActive ? 'Activo' : 'Inactivo'}.`);
      setTimeout(() => setStatusFeedback(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cambiar estado.';
      setStatusFeedback(msg);
      setTimeout(() => setStatusFeedback(null), 4000);
    } finally {
      setTogglingId(null);
    }
  };

  const filteredResources = resources.filter((res) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      res.name.toLowerCase().includes(q) ||
      (res.clinicalDescription && res.clinicalDescription.toLowerCase().includes(q)) ||
      (res.subjects && res.subjects.some((s) => s.toLowerCase().includes(q)));

    const matchesLicense =
      licenseFilter === 'all' ||
      (licenseFilter === 'subscription' && res.isSubscription) ||
      (licenseFilter === 'open' && !res.isSubscription);

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && res.isActive) ||
      (statusFilter === 'inactive' && !res.isActive);

    return matchesSearch && matchesLicense && matchesStatus;
  });

  const totalCount = resources.length;
  const subscriptionCount = resources.filter((r) => r.isSubscription).length;
  const openAccessCount = resources.filter((r) => !r.isSubscription).length;
  const activeCount = resources.filter((r) => r.isActive).length;

  if (!isAuthenticated) {
    return (
      <AdminLoginForm
        onLoginSuccess={() => setIsAuthenticated(true)}
        onBackToHome={() => onNavigate('home')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-body-md flex flex-col antialiased">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00572B] flex items-center justify-center text-white font-black font-display text-base border border-emerald-700 shadow-xs">
              BVE
            </div>
            <div>
              <h1 className="text-base font-bold font-display text-slate-900 tracking-tight">
                Panel de Gestión &bull; FAMURP
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Biblioteca Virtual y Especializada de Medicina Humana
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#008744] px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Ver Portal Público</span>
            </button>

            <div className="h-6 w-px bg-slate-200"></div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 font-bold text-xs">
                AF
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">admin_famurp</p>
                <p className="text-[10px] font-medium text-slate-500">Jefatura ALFIN</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              title="Cerrar sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      {statusFeedback && (
        <div className="bg-emerald-600 text-white text-xs font-bold py-2.5 px-4 text-center sticky top-16 z-20 shadow-md flex items-center justify-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusFeedback}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        <AdminMetricsGrid
          totalCount={totalCount}
          subscriptionCount={subscriptionCount}
          openAccessCount={openAccessCount}
          activeCount={activeCount}
        />

        <DatabaseSearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Buscar base de datos, materia, editorial..."
          licenseFilter={licenseFilter}
          onLicenseFilterChange={setLicenseFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          actionsRight={
            <>
              <button
                type="button"
                onClick={loadResources}
                disabled={isLoadingResources}
                className="p-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                title="Refrescar catálogo"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingResources ? 'animate-spin' : ''}`} />
              </button>

              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-display font-bold text-xs text-white bg-[#008744] hover:bg-[#00572B] transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Registrar Base de Datos</span>
              </button>
            </>
          }
        />

        <AdminResourceTable
          resources={filteredResources}
          totalResourcesCount={resources.length}
          isLoading={isLoadingResources}
          togglingId={togglingId}
          onEdit={handleOpenEditModal}
          onToggleActive={handleToggleActive}
        />
      </main>

      <AdminResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveResource}
        initialData={editingResourceData}
      />
    </div>
  );
};
