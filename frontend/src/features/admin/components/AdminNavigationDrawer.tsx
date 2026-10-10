import React from 'react';
import { X, Database, Video, Mail, BarChart3 } from 'lucide-react';
import { InstagramIcon } from '../../../components/common/InstagramIcon';
import { AdminTab } from '../types';
import { ADMIN_NAVIGATION_ITEMS } from '../constants/adminNavigation';

interface AdminNavigationDrawerProps {
  isOpen: boolean;
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onClose: () => void;
}

const renderTabIcon = (tabId: AdminTab) => {
  switch (tabId) {
    case 'databases':
      return <Database className="w-4 h-4 text-emerald-700" />;
    case 'lost-found':
      return <InstagramIcon className="w-4 h-4 text-pink-600" />;
    case 'conferences':
      return <Video className="w-4 h-4 text-emerald-700" />;
    case 'newsletter':
      return <Mail className="w-4 h-4 text-emerald-700" />;
    case 'statistics':
      return <BarChart3 className="w-4 h-4 text-emerald-700" />;
  }
};

export const AdminNavigationDrawer: React.FC<AdminNavigationDrawerProps> = ({
  isOpen,
  activeTab,
  onSelectTab,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 border-r border-slate-200">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold font-display text-slate-900">Módulos de Gestión</h2>
            <p className="text-[10px] text-slate-500">Facultad de Medicina URP</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2 flex-1">
          {ADMIN_NAVIGATION_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectTab(item.id);
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === item.id
                  ? 'bg-emerald-50 text-[#00572B] border-2 border-emerald-600 shadow-xs'
                  : 'text-slate-700 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              {renderTabIcon(item.id)}
              <div className="text-left flex-1">
                <p className="leading-tight font-bold">{item.sublabel}</p>
                <p className="text-[10px] font-normal text-slate-500 mt-0.5">{item.description}</p>
              </div>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};
