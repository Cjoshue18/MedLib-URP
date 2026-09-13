import React, { useState, useEffect } from 'react';
import { 
  ExternalLink, 
  LogOut, 
  CheckCircle2, 
  RefreshCw, 
  Plus, 
  Hexagon, 
  Menu, 
  X, 
  Database, 
  Video, 
  Trash2, 
  Link as LinkIcon, 
  AlertCircle,
  BarChart3 
} from 'lucide-react';
import { InstagramIcon } from '../components/common/InstagramIcon';
import { authService, AdminLoginForm } from '../features/auth';
import {
  resourceService,
  DatabaseSearchBar,
  AdminMetricsGrid,
  AdminResourceTable,
  AdminResourceModal,
  HexagonMatrixModal,
  ResourceFormData,
  ResourceApiDto,
  CreateResourceApiRequest,
  UpdateResourceApiRequest,
} from '../features/guides';
import { 
  lostFoundService, 
  LostItemPost, 
  InstagramPostEmbed 
} from '../features/community';
import { 
  AdminConferencesTab, 
  AdminStatisticsTab 
} from '../features/conferences';

interface AdminPageProps {
  onNavigate: (view: 'home' | 'directory' | 'conferences' | 'lost-found' | 'admin') => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());
  const [activeAdminTab, setActiveAdminTab] = useState<'databases' | 'lost-found' | 'conferences' | 'statistics'>('databases');
  const [selectedConferenceIdForStats, setSelectedConferenceIdForStats] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [resources, setResources] = useState<ResourceApiDto[]>([]);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [licenseFilter, setLicenseFilter] = useState<'all' | 'subscription' | 'open'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMatrixModalOpen, setIsMatrixModalOpen] = useState(false);
  const [editingResourceData, setEditingResourceData] = useState<ResourceFormData | null>(null);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const [lostPosts, setLostPosts] = useState<LostItemPost[]>([]);
  const [isLoadingLostPosts, setIsLoadingLostPosts] = useState(false);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [newPostUrl, setNewPostUrl] = useState('');
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [postModalError, setPostModalError] = useState<string | null>(null);

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

  const loadLostPosts = async () => {
    setIsLoadingLostPosts(true);
    try {
      const data = await lostFoundService.getPosts();
      setLostPosts(data);
    } catch {
      setLostPosts([]);
    } finally {
      setIsLoadingLostPosts(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (!authService.isAuthenticated()) {
        setIsAuthenticated(false);
        return;
      }
      authService.verifyProfile().then((profile) => {
        if (!profile) {
          setIsAuthenticated(false);
        } else {
          loadResources();
          loadLostPosts();
        }
      });
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setResources([]);
    setLostPosts([]);
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
      mostrarEnHexagonos: res.mostrarEnHexagonos,
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
      const existing = resources.find((r) => r.id === formData.id);
      if (existing?.mostrarEnHexagonos && !formData.isActive) {
        setStatusFeedback(
          `No se puede inactivar "${formData.name}": forma parte de la matriz hexagonal. Reemplázala en la matriz antes de inactivarla.`
        );
        setTimeout(() => setStatusFeedback(null), 5000);
        return;
      }

      if (existing?.isActive && !formData.isActive && activeCount <= 15) {
        setStatusFeedback(
          'No se puede inactivar: deben mantenerse al menos 15 bases de datos activas en el catálogo.'
        );
        setTimeout(() => setStatusFeedback(null), 5000);
        return;
      }

      const updateReq: UpdateResourceApiRequest = {
        name: formData.name.trim(),
        logoUrl: formData.logoUrl.trim() || null,
        clinicalDescription: formData.clinicalDescription.trim() || null,
        isSubscription: formData.isSubscription,
        hasMobileApp: formData.hasMobileApp,
        externalUrl: formData.externalUrl.trim() || null,
        isActive: formData.isActive,
        mostrarEnHexagonos: existing ? existing.mostrarEnHexagonos : false,
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
        mostrarEnHexagonos: false,
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

  const handleDeleteResource = async (res: ResourceApiDto) => {
    if (res.mostrarEnHexagonos) {
      setStatusFeedback(`No se puede eliminar "${res.name}": está asignada a la matriz hexagonal de inicio.`);
      setTimeout(() => setStatusFeedback(null), 5000);
      return;
    }

    if (resources.length <= 15) {
      setStatusFeedback('No se puede eliminar: el sistema debe mantener un mínimo de 15 bases de datos registradas.');
      setTimeout(() => setStatusFeedback(null), 5000);
      return;
    }

    const confirmed = window.confirm(
      `¿Confirmas que deseas eliminar la base de datos "${res.name}"? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    try {
      await resourceService.deleteResource(res.id);
      setResources((prev) => prev.filter((r) => r.id !== res.id));
      setStatusFeedback(`Base de datos "${res.name}" eliminada correctamente.`);
      setTimeout(() => setStatusFeedback(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar la base de datos.';
      setStatusFeedback(msg);
      setTimeout(() => setStatusFeedback(null), 5000);
    }
  };

  const handleSaveHexagonMatrix = async (selectedIds: number[]) => {
    if (selectedIds.length !== 15) {
      setStatusFeedback('Error: Se deben seleccionar exactamente 15 bases de datos para la matriz.');
      setTimeout(() => setStatusFeedback(null), 4000);
      return;
    }

    try {
      const updatedList = await resourceService.setHexagonMatrix(selectedIds);
      setResources(updatedList);
      setIsMatrixModalOpen(false);
      setStatusFeedback('Matriz hexagonal sincronizada con éxito (15 bases asignadas a portada).');
      setTimeout(() => setStatusFeedback(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar la matriz hexagonal.';
      setStatusFeedback(msg);
      setTimeout(() => setStatusFeedback(null), 5000);
    }
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostUrl.trim()) {
      setPostModalError('Por favor ingresa la URL de la publicación de Instagram.');
      return;
    }

    setIsSubmittingPost(true);
    setPostModalError(null);

    try {
      await lostFoundService.createPost(newPostUrl.trim());
      setIsNewPostModalOpen(false);
      setNewPostUrl('');
      setStatusFeedback('Publicación agregada con éxito al catálogo de objetos perdidos.');
      setTimeout(() => setStatusFeedback(null), 4000);
      await loadLostPosts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al registrar la publicación.';
      setPostModalError(msg);
    } finally {
      setIsSubmittingPost(false);
    }
  };

  const handleDeletePost = async (id: number) => {
    const confirmed = window.confirm('¿Confirmas que deseas retirar esta publicación de la cartelera de objetos perdidos?');
    if (!confirmed) return;

    try {
      await lostFoundService.deletePost(id);
      setStatusFeedback('Publicación retirada correctamente.');
      setTimeout(() => setStatusFeedback(null), 4000);
      await loadLostPosts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar la publicación.';
      setStatusFeedback(msg);
      setTimeout(() => setStatusFeedback(null), 5000);
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
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Abrir menú de módulos"
            >
              <Menu className="w-5 h-5 text-slate-800" />
            </button>

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
            {activeAdminTab === 'databases' && (
              <button
                type="button"
                onClick={() => setIsMatrixModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-900 px-3 py-1.5 rounded-lg border border-emerald-300 hover:border-emerald-400 bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer shadow-xs"
                title="Configurar los 15 recursos de la matriz hexagonal de inicio"
              >
                <Hexagon className="w-3.5 h-3.5 fill-emerald-600 text-emerald-700" />
                <span>Matriz Hexagonal</span>
                <span className="ml-1 px-1.5 py-0.5 bg-emerald-200 text-emerald-900 rounded-full text-[10px] font-black">
                  {resources.filter((r) => r.mostrarEnHexagonos).length}/15
                </span>
              </button>
            )}

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

      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 border-r border-slate-200">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold font-display text-slate-900">Módulos de Gestión</h2>
                <p className="text-[10px] text-slate-500">Facultad de Medicina URP</p>
              </div>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="p-4 space-y-2 flex-1">
              <button
                type="button"
                onClick={() => { setActiveAdminTab('databases'); setIsDrawerOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeAdminTab === 'databases'
                    ? 'bg-emerald-50 text-[#00572B] border-2 border-emerald-600 shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50 border border-slate-100'
                }`}
              >
                <Database className="w-4 h-4 text-emerald-700" />
                <div className="text-left flex-1">
                  <p className="leading-tight font-bold">Bases de Datos Biomédicas</p>
                  <p className="text-[10px] font-normal text-slate-500 mt-0.5">Catálogo general y matriz hexagonal</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setActiveAdminTab('lost-found'); setIsDrawerOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeAdminTab === 'lost-found'
                    ? 'bg-emerald-50 text-[#00572B] border-2 border-emerald-600 shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50 border border-slate-100'
                }`}
              >
                <InstagramIcon className="w-4 h-4 text-pink-600" />
                <div className="text-left flex-1">
                  <div className="flex items-center justify-between">
                    <p className="leading-tight font-bold">Publicaciones de Instagram</p>
                    <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800 text-[10px] font-black">
                      {lostPosts.length}/6
                    </span>
                  </div>
                  <p className="text-[10px] font-normal text-slate-500 mt-0.5">Objetos perdidos y avisos de sala</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setActiveAdminTab('conferences'); setIsDrawerOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeAdminTab === 'conferences'
                    ? 'bg-emerald-50 text-[#00572B] border-2 border-emerald-600 shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50 border border-slate-100'
                }`}
              >
                <Video className="w-4 h-4 text-emerald-700" />
                <div className="text-left flex-1">
                  <p className="leading-tight font-bold">Conferencias &amp; ALFIN</p>
                  <p className="text-[10px] font-normal text-slate-500 mt-0.5">Talleres, Teams y control de asistencia</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setActiveAdminTab('statistics'); setIsDrawerOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeAdminTab === 'statistics'
                    ? 'bg-emerald-50 text-[#00572B] border-2 border-emerald-600 shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50 border border-slate-100'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-emerald-700" />
                <div className="text-left flex-1">
                  <p className="leading-tight font-bold">Estadísticas y Reportes</p>
                  <p className="text-[10px] font-normal text-slate-500 mt-0.5">Cruce de asistencias y exportación Excel</p>
                </div>
              </button>
            </nav>
          </div>
        </div>
      )}

      {statusFeedback && (
        <div className="bg-emerald-600 text-white text-xs font-bold py-2.5 px-4 text-center sticky top-16 z-20 shadow-md flex items-center justify-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusFeedback}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {activeAdminTab === 'databases' ? (
          <>
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
              totalHexagonCount={resources.filter((r) => r.mostrarEnHexagonos).length}
              isLoading={isLoadingResources}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteResource}
              onOpenMatrixModal={() => setIsMatrixModalOpen(true)}
            />
          </>
        ) : activeAdminTab === 'lost-found' ? (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                  Publicaciones de Instagram
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Gestiona hasta 6 publicaciones simultáneas que se visualizarán en el carrusel del portal de estudiantes.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
                  <span>Activas: </span>
                  <span className="text-[#008744] font-black">{lostPosts.length}</span>
                  <span> / 6</span>
                </div>

                <button
                  type="button"
                  onClick={() => { setPostModalError(null); setNewPostUrl(''); setIsNewPostModalOpen(true); }}
                  disabled={lostPosts.length >= 6}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-bold text-xs text-white shadow-xs transition-colors ${
                    lostPosts.length >= 6
                      ? 'bg-slate-400 cursor-not-allowed opacity-70'
                      : 'bg-[#008744] hover:bg-[#00572B] cursor-pointer'
                  }`}
                  title={lostPosts.length >= 6 ? 'Límite alcanzado (máximo 6 publicaciones)' : 'Registrar nueva publicación'}
                >
                  <Plus className="w-4 h-4" />
                  <span>Nueva Publicación</span>
                </button>
              </div>
            </div>

            {isLoadingLostPosts ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-96 rounded-2xl bg-slate-100 animate-pulse border border-slate-200"></div>
                ))}
              </div>
            ) : lostPosts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#008744] mx-auto flex items-center justify-center mb-3 border border-emerald-100">
                  <InstagramIcon className="w-7 h-7" />
                </div>
                <h3 className="font-display font-extrabold text-base text-slate-800">
                  No hay publicaciones registradas
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                  Copia el enlace de un post de Instagram de la cuenta oficial y regístralo para que aparezca en el carrusel público.
                </p>
                <button
                  type="button"
                  onClick={() => { setPostModalError(null); setNewPostUrl(''); setIsNewPostModalOpen(true); }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#008744] hover:bg-[#00572B] transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir Primera Publicación</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lostPosts.map((post, idx) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between"
                  >
                    <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-black text-[11px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-mono text-slate-600 truncate max-w-[180px]">
                          {post.urlInstagram}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1.5 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                        title="Eliminar publicación"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-4 flex-1 flex items-center justify-center bg-white min-h-[380px]">
                      <InstagramPostEmbed url={post.urlInstagram} captioned={false} />
                    </div>

                    <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Registrado: {new Date(post.fechaCreacion).toLocaleDateString('es-PE')}</span>
                      <a
                        href={post.urlInstagram}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-[#008744] hover:underline inline-flex items-center gap-1"
                      >
                        <span>Abrir enlace</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeAdminTab === 'conferences' ? (
          <AdminConferencesTab
            onNavigateToStats={(confId) => {
              setSelectedConferenceIdForStats(confId);
              setActiveAdminTab('statistics');
            }}
            onShowFeedback={(msg) => {
              setStatusFeedback(msg);
              setTimeout(() => setStatusFeedback(null), 4000);
            }}
          />
        ) : (
          <AdminStatisticsTab
            initialConferenceId={selectedConferenceIdForStats}
            onShowFeedback={(msg) => {
              setStatusFeedback(msg);
              setTimeout(() => setStatusFeedback(null), 4000);
            }}
          />
        )}
      </main>

      {isNewPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => !isSubmittingPost && setIsNewPostModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl z-10 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white">
                  <InstagramIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-slate-900 text-base">
                    Incrustar Publicación de Instagram
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Pega el enlace oficial del post de Instagram
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewPostModalOpen(false)}
                disabled={isSubmittingPost}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePost} className="p-6 space-y-4">
              {postModalError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{postModalError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Enlace del Post (URL)
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={newPostUrl}
                    onChange={(e) => {
                      setNewPostUrl(e.target.value);
                      if (postModalError) setPostModalError(null);
                    }}
                    placeholder="https://www.instagram.com/p/C_abc123/"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#008744] focus:border-transparent"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Ejemplo: https://www.instagram.com/p/DdHuc4YmbVI/
                </p>
              </div>

              {newPostUrl.includes('instagram.com') && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] font-bold text-slate-600 mb-2">Vista previa:</p>
                  <div className="max-h-64 overflow-y-auto flex justify-center">
                    <InstagramPostEmbed url={newPostUrl} />
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsNewPostModalOpen(false)}
                  disabled={isSubmittingPost}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-300 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingPost}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#008744] hover:bg-[#00572B] transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  {isSubmittingPost ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <span>Guardar y Publicar</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AdminResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveResource}
        initialData={editingResourceData}
        activeResourcesCount={activeCount}
      />

      <HexagonMatrixModal
        isOpen={isMatrixModalOpen}
        onClose={() => setIsMatrixModalOpen(false)}
        resources={resources}
        onSave={handleSaveHexagonMatrix}
      />
    </div>
  );
};
