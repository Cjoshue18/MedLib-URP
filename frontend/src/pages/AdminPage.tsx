import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { authService, AdminLoginForm } from '../features/auth';
import { AdminDatabasesTab } from '../features/guides';
import { AdminLostFoundTab } from '../features/community';
import { AdminNewsletterTab } from '../features/home';
import {
  AdminConferencesTab,
  AdminStatisticsTab,
} from '../features/conferences';
import {
  AdminTab,
  AdminHeader,
  AdminNavigationDrawer,
} from '../features/admin';

interface AdminPageProps {
  onNavigate: (view: 'home' | 'directory' | 'conferences' | 'lost-found' | 'admin') => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('databases');
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
      <AdminHeader
        activeTab={activeAdminTab}
        onSelectTab={setActiveAdminTab}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenMatrixModal={() => setIsMatrixModalOpen(true)}
        hexagonCount={hexagonCount}
        onNavigatePublic={() => onNavigate('home')}
        onLogout={handleLogout}
      />

      <AdminNavigationDrawer
        isOpen={isDrawerOpen}
        activeTab={activeAdminTab}
        onSelectTab={setActiveAdminTab}
        onClose={() => setIsDrawerOpen(false)}
      />

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
        ) : activeAdminTab === 'newsletter' ? (
          <AdminNewsletterTab onShowFeedback={triggerFeedback} />
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
