import React from 'react';
import { Menu, Hexagon, ExternalLink, LogOut } from 'lucide-react';
import { AdminTab } from '../types';
import { ADMIN_NAVIGATION_ITEMS } from '../constants/adminNavigation';

interface AdminHeaderProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onOpenDrawer: () => void;
  onOpenMatrixModal: () => void;
  hexagonCount: number;
  onNavigatePublic: () => void;
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenDrawer,
  onOpenMatrixModal,
  hexagonCount,
  onNavigatePublic,
  onLogout,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenDrawer}
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

          <nav className="hidden xl:flex items-center gap-1 ml-4 pl-4 border-l border-slate-200 text-xs font-bold">
            {ADMIN_NAVIGATION_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-emerald-50 text-[#00572B] border border-emerald-300'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'databases' && (
            <button
              type="button"
              onClick={onOpenMatrixModal}
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
            onClick={onNavigatePublic}
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
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            title="Cerrar sesión"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
};
