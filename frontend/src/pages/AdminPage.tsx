import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  LogOut,
  CheckCircle2,
  Hexagon,
  Menu,
  X,
  Database,
  Video,
  BarChart3,
} from 'lucide-react';
import { InstagramIcon } from '../components/common/InstagramIcon';
import { authService, AdminLoginForm } from '../features/auth';
import { AdminDatabasesTab } from '../features/guides';
import { AdminLostFoundTab } from '../features/community';
import {
  AdminConferencesTab,
  AdminStatisticsTab,
} from '../features/conferences';

interface AdminPageProps {
  onNavigate: (view: 'home' | 'directory' | 'conferences' | 'lost-found' | 'admin') => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());
  const [activeAdminTab, setActiveAdminTab] = useState<'databases' | 'lost-found' | 'conferences' | 'statistics'>('databases');
  const [selectedConferenceIdForStats, setSelectedConferenceIdForStats] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMatrixModalOpen, setIsMatrixModalOpen] = useState(false);
  const [hexagonCount, setHexagonCount] = useState(15);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      if (!authService.isAuthenticated()) {
        setIsAuthenticated(false);
        return;
      }
      authService.verifyProfile().then((profile) => {
        if (!profile) {
          setIsAuthenticated(false);
        }
      });
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  const triggerFeedback = (msg: string) => {
    setStatusFeedback(msg);
    setTimeout(() => setStatusFeedback(null), 4000);
  };

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
                  {hexagonCount}/15
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
                onClick={() => {
                  setActiveAdminTab('databases');
                  setIsDrawerOpen(false);
                }}
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
                onClick={() => {
                  setActiveAdminTab('lost-found');
                  setIsDrawerOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeAdminTab === 'lost-found'
                    ? 'bg-emerald-50 text-[#00572B] border-2 border-emerald-600 shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50 border border-slate-100'
                }`}
              >
                <InstagramIcon className="w-4 h-4 text-pink-600" />
                <div className="text-left flex-1">
                  <p className="leading-tight font-bold">Publicaciones de Instagram</p>
                  <p className="text-[10px] font-normal text-slate-500 mt-0.5">Objetos perdidos y avisos de sala</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveAdminTab('conferences');
                  setIsDrawerOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeAdminTab === 'conferences'
                    ? 'bg-emerald-50 text-[#00572B] border-2 border-emerald-600 shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50 border border-slate-100'
                }`}
              >
                <Video className="w-4 h-4 text-emerald-700" />
                <div className="text-left flex-1">
                  <p className="leading-tight font-bold">Conferencias &amp; ALFIN</p>
                  <p className="text-[10px] font-normal text-slate-500 mt-0.5">Talleres, eventos y control de asistencia</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveAdminTab('statistics');
                  setIsDrawerOpen(false);
                }}
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
          <AdminDatabasesTab
            onShowFeedback={triggerFeedback}
            isMatrixModalOpen={isMatrixModalOpen}
            onOpenMatrixModal={() => setIsMatrixModalOpen(true)}
            onCloseMatrixModal={() => setIsMatrixModalOpen(false)}
            onHexagonCountChange={setHexagonCount}
          />
        ) : activeAdminTab === 'lost-found' ? (
          <AdminLostFoundTab onShowFeedback={triggerFeedback} />
        ) : activeAdminTab === 'conferences' ? (
          <AdminConferencesTab
            onNavigateToStats={(confId) => {
              setSelectedConferenceIdForStats(confId);
              setActiveAdminTab('statistics');
            }}
            onShowFeedback={triggerFeedback}
          />
        ) : (
          <AdminStatisticsTab
            initialConferenceId={selectedConferenceIdForStats}
            onShowFeedback={triggerFeedback}
          />
        )}
      </main>
    </div>
  );
};
