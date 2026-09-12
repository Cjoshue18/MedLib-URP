import React, { useState, useEffect } from 'react';
import {
  Lock,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  Search,
  Plus,
  Edit,
  ExternalLink,
  CheckCircle2,
  XCircle,
  RefreshCw,
  LogOut,
  Globe,
  Database,
  Smartphone,
  Video,
  X,
  ArrowLeft
} from 'lucide-react';
import { authService } from '../features/auth/services/authService';
import { resourceService } from '../features/guides/services/resourceService';
import {
  ResourceApiDto,
  CreateResourceApiRequest,
  UpdateResourceApiRequest,
} from '../features/guides/types/resourceApiTypes';
import { getDatabaseLogoUrl } from '../features/guides/data/databasesData';

interface AdminPageProps {
  onNavigate: (view: 'home' | 'directory' | 'conferences' | 'lost-found' | 'admin') => void;
}

interface ResourceFormData {
  id?: number;
  name: string;
  logoUrl: string;
  clinicalDescription: string;
  isSubscription: boolean;
  hasMobileApp: boolean;
  externalUrl: string;
  isActive: boolean;
  subjectsStr: string;
  youtubeVideoId: string;
  videoTitle: string;
  guidePdfUrl: string;
}

const initialFormData: ResourceFormData = {
  name: '',
  logoUrl: '',
  clinicalDescription: '',
  isSubscription: true,
  hasMobileApp: false,
  externalUrl: 'https://test.urp.edu.pe/Intranet/',
  isActive: true,
  subjectsStr: 'Medicina Humana, Ciencias Básicas',
  youtubeVideoId: '',
  videoTitle: '',
  guidePdfUrl: '',
};

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());
  const [username, setUsername] = useState('admin_famurp');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [resources, setResources] = useState<ResourceApiDto[]>([]);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [licenseFilter, setLicenseFilter] = useState<'all' | 'subscription' | 'open'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<ResourceFormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');

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

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!username.trim() || !password.trim()) {
      setLoginError('Por favor ingrese su usuario y contraseña institucional.');
      return;
    }

    setIsLoggingIn(true);
    try {
      await authService.login({ username: username.trim(), password: password.trim() });
      setIsAuthenticated(true);
      setPassword('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Credenciales inválidas.';
      setLoginError(msg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setResources([]);
  };

  const handleOpenCreateModal = () => {
    setFormData(initialFormData);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (res: ResourceApiDto) => {
    setFormData({
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
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('El nombre del recurso es obligatorio.');
      return;
    }

    setIsSaving(true);
    const parsedSubjects = formData.subjectsStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    try {
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
      setIsModalOpen(false);
      await loadResources();
      setTimeout(() => setStatusFeedback(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al procesar la operación.';
      setFormError(msg);
    } finally {
      setIsSaving(false);
    }
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
      setResources(prev =>
        prev.map(r => (r.id === res.id ? { ...r, isActive: !r.isActive } : r))
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

  const filteredResources = resources.filter(res => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      res.name.toLowerCase().includes(q) ||
      (res.clinicalDescription && res.clinicalDescription.toLowerCase().includes(q)) ||
      (res.subjects && res.subjects.some(s => s.toLowerCase().includes(q)));

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
  const subscriptionCount = resources.filter(r => r.isSubscription).length;
  const openAccessCount = resources.filter(r => !r.isSubscription).length;
  const activeCount = resources.filter(r => r.isActive).length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 rounded-full bg-[#008744]/15 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 rounded-full bg-[#00572B]/20 blur-3xl pointer-events-none"></div>

        <header className="relative z-10 flex items-center justify-between max-w-5xl mx-auto w-full">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Volver a la Biblioteca Virtual</span>
          </button>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Acceso Seguro ALFIN URP</span>
          </div>
        </header>

        <main className="relative z-10 flex-1 flex items-center justify-center py-12">
          <div className="w-full max-w-md bg-white rounded-3xl border-2 border-slate-900 shadow-urp-brutal overflow-hidden">
            <div className="bg-gradient-to-r from-[#00572B] via-[#008744] to-[#00A859] p-6 text-white text-center relative">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-xl font-black font-display tracking-tight uppercase">
                Gestión Bibliotecaria FAMURP
              </h1>
              <p className="text-xs text-emerald-100 font-medium mt-1">
                Facultad de Medicina Humana &bull; Universidad Ricardo Palma
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="p-6 sm:p-8 space-y-5">
              {loginError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-shake">
                  <XCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Usuario Institucional
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Ej. admin_famurp"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#008744] focus:ring-2 focus:ring-[#008744]/20 text-slate-900 text-sm font-medium outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Contraseña de Seguridad
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:border-[#008744] focus:ring-2 focus:ring-[#008744]/20 text-slate-900 text-sm font-medium outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 px-4 rounded-xl font-display font-bold text-sm text-white bg-[#008744] hover:bg-[#00572B] active:translate-y-0.5 border-2 border-slate-900 shadow-urp-brutal-green transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verificando credenciales...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Ingresar al Panel de Gestión</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <p className="text-[11px] text-slate-500 font-medium">
                  Autorización protegida por tokens criptográficos y cifrado BCrypt. Acceso auditado bajo normativa SUNEDU.
                </p>
              </div>
            </form>
          </div>
        </main>

        <footer className="relative z-10 text-center text-xs text-slate-500 max-w-5xl mx-auto w-full">
          Facultad de Medicina Humana &bull; Biblioteca Especializada URP &bull; Sistema de Gestión v1.0
        </footer>
      </div>
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
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold font-display text-slate-900 tracking-tight">
                  Panel de Gestión &bull; FAMURP
                </h1>
              </div>
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Recursos</p>
              <p className="text-2xl font-black font-display text-slate-900 mt-0.5">{totalCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <Database className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Suscripción URP</p>
              <p className="text-2xl font-black font-display text-[#008744] mt-0.5">{subscriptionCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#008744] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Acceso Abierto</p>
              <p className="text-2xl font-black font-display text-sky-600 mt-0.5">{openAccessCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Activos en Portal</p>
              <p className="text-2xl font-black font-display text-emerald-700 mt-0.5">{activeCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar base de datos, materia, editorial..."
                className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-[#008744] focus:ring-1 focus:ring-[#008744] outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={licenseFilter}
                onChange={e => setLicenseFilter(e.target.value as 'all' | 'subscription' | 'open')}
                className="py-2 px-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white focus:border-[#008744] outline-none"
              >
                <option value="all">Todas las licencias</option>
                <option value="subscription">Suscripción URP</option>
                <option value="open">Acceso Abierto</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                className="py-2 px-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white focus:border-[#008744] outline-none"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Solo Activos</option>
                <option value="inactive">Solo Inactivos</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
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
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold font-display text-slate-900">
                Catálogo de Bases de Datos Biomédicas
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Mostrando {filteredResources.length} de {resources.length} recursos administrados
              </p>
            </div>
          </div>

          {isLoadingResources ? (
            <div className="p-12 text-center space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin text-[#008744] mx-auto" />
              <p className="text-sm font-semibold text-slate-700">Cargando registros desde Neon PostgreSQL...</p>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <Database className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-800">No se encontraron bases de datos</p>
              <p className="text-xs text-slate-500">Pruebe ajustando los filtros de búsqueda o registre una nueva base.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <th className="py-3 px-4 w-14">Logo</th>
                    <th className="py-3 px-4">Recurso</th>
                    <th className="py-3 px-4">Licencia</th>
                    <th className="py-3 px-4">Materias</th>
                    <th className="py-3 px-4 text-center">App</th>
                    <th className="py-3 px-4 text-center">Tutorial</th>
                    <th className="py-3 px-4 text-center">Estado</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredResources.map(res => {
                    const logoSrc = getDatabaseLogoUrl(res.logoUrl || undefined);
                    return (
                      <tr key={res.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="w-9 h-9 rounded-lg border border-slate-200 bg-white p-1 flex items-center justify-center overflow-hidden">
                            {logoSrc ? (
                              <img
                                src={logoSrc}
                                alt={res.name}
                                className="max-w-full max-h-full object-contain"
                                onError={e => {
                                  const target = e.currentTarget;
                                  target.style.display = 'none';
                                  if (target.parentElement) {
                                    target.parentElement.innerHTML = '<span class="text-[9px] font-bold text-slate-400">MED</span>';
                                  }
                                }}
                              />
                            ) : (
                              <span className="text-[9px] font-bold text-slate-400">MED</span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 text-sm leading-snug">{res.name}</div>
                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {res.clinicalDescription || 'Sin descripción clínica registrada.'}
                          </div>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          {res.isSubscription ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <ShieldCheck className="w-3 h-3" />
                              Suscripción URP
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                              <Globe className="w-3 h-3" />
                              Acceso Abierto
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 max-w-xs">
                          <div className="flex flex-wrap gap-1">
                            {(res.subjects || []).slice(0, 3).map((sub, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200"
                              >
                                {sub}
                              </span>
                            ))}
                            {(res.subjects || []).length > 3 && (
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-bold">
                                +{res.subjects.length - 3}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          {res.hasMobileApp ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold text-[10px] border border-purple-200">
                              <Smartphone className="w-2.5 h-2.5" />
                              Sí
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">&mdash;</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          {res.tutorial?.youtubeVideoId ? (
                            <a
                              href={`https://www.youtube.com/watch?v=${res.tutorial.youtubeVideoId}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 text-red-700 hover:bg-red-100 font-bold text-[10px] border border-red-200 transition-colors"
                            >
                              <Video className="w-2.5 h-2.5" />
                              {res.tutorial.youtubeVideoId}
                            </a>
                          ) : (
                            <span className="text-slate-400 text-[11px]">&mdash;</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <button
                            type="button"
                            disabled={togglingId === res.id}
                            onClick={() => handleToggleActive(res)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors cursor-pointer ${
                              res.isActive
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                res.isActive ? 'bg-emerald-600' : 'bg-slate-400'
                              }`}
                            ></span>
                            <span>{res.isActive ? 'Activo' : 'Inactivo'}</span>
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(res)}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-[#008744] hover:border-[#008744] hover:bg-emerald-50 transition-colors cursor-pointer"
                              title="Editar base de datos"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
            <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-3xl">
              <div>
                <h3 className="text-base font-bold font-display text-slate-900">
                  {formData.id ? 'Editar Base de Datos Biomédica' : 'Registrar Nueva Base de Datos'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Los cambios se sincronizarán directamente con Neon PostgreSQL
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResource} className="p-5 sm:p-6 space-y-4 flex-1">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                  <XCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nombre del Recurso *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej. ClinicalKey, PubMed, DynaMedex"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-[#008744] focus:ring-1 focus:ring-[#008744] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Descripción Clínica
                </label>
                <textarea
                  rows={3}
                  value={formData.clinicalDescription}
                  onChange={e => setFormData({ ...formData, clinicalDescription: e.target.value })}
                  placeholder="Resumen del contenido y propósito para estudiantes y docentes..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-[#008744] focus:ring-1 focus:ring-[#008744] outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tipo de Licencia
                  </label>
                  <select
                    value={formData.isSubscription ? 'sub' : 'open'}
                    onChange={e => setFormData({ ...formData, isSubscription: e.target.value === 'sub' })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-[#008744] outline-none bg-white font-medium"
                  >
                    <option value="sub">Suscripción URP (Vía Intranet)</option>
                    <option value="open">Acceso Abierto (Open Access)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    URL de Logotipo
                  </label>
                  <input
                    type="text"
                    value={formData.logoUrl}
                    onChange={e => setFormData({ ...formData, logoUrl: e.target.value })}
                    placeholder="https://... o nombre de archivo .png/.webp"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-[#008744] focus:ring-1 focus:ring-[#008744] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Enlace Externo de Acceso
                </label>
                <input
                  type="url"
                  value={formData.externalUrl}
                  onChange={e => setFormData({ ...formData, externalUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-[#008744] focus:ring-1 focus:ring-[#008744] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Materias Asociadas (Separadas por comas)
                </label>
                <input
                  type="text"
                  value={formData.subjectsStr}
                  onChange={e => setFormData({ ...formData, subjectsStr: e.target.value })}
                  placeholder="Medicina General, Farmacología, Anatomía, Fisiología"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-[#008744] focus:ring-1 focus:ring-[#008744] outline-none"
                />
              </div>

              <div className="border-t border-slate-200 pt-3">
                <p className="text-xs font-bold font-display text-slate-900 mb-2">Video Tutorial Oficial (Opcional)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      YouTube Video ID o URL
                    </label>
                    <input
                      type="text"
                      value={formData.youtubeVideoId}
                      onChange={e => setFormData({ ...formData, youtubeVideoId: e.target.value })}
                      placeholder="dQw4w9WgXcQ"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:border-[#008744] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Título del Tutorial
                    </label>
                    <input
                      type="text"
                      value={formData.videoTitle}
                      onChange={e => setFormData({ ...formData, videoTitle: e.target.value })}
                      placeholder="Guía de búsqueda clínica..."
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:border-[#008744] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 border-t border-slate-200 pt-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.hasMobileApp}
                    onChange={e => setFormData({ ...formData, hasMobileApp: e.target.checked })}
                    className="w-4 h-4 rounded text-[#008744] focus:ring-[#008744]"
                  />
                  <span>Dispone de App Móvil</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-[#008744] focus:ring-[#008744]"
                  />
                  <span>Visible y Activo en el Portal</span>
                </label>
              </div>

              <div className="border-t border-slate-200 pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl font-display font-bold text-xs text-white bg-[#008744] hover:bg-[#00572B] transition-colors shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <span>Guardar Base de Datos</span>
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
