import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { DirectoryPage } from './pages/DirectoryPage';
import { ConferencesPage } from './pages/ConferencesPage';
import { LostFoundPage } from './pages/LostFoundPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { triggerSilentWarmup } from './core/services/warmupService';

import type { AppView } from './core/types/navigation';
export type { AppView };

const parseHashRoute = (): { view: AppView; query: string } => {
  if (typeof window === 'undefined') return { view: 'home', query: '' };
  const fullHash = window.location.hash;
  const [rawRoute, rawQuery] = fullHash.split('?');
  const hash = rawRoute.toLowerCase();
  const params = new URLSearchParams(rawQuery || '');
  const query = params.get('q') || '';

  if (hash === '' || hash === '#' || hash === '#inicio' || hash === '#home') {
    return { view: 'home', query: '' };
  }
  if (hash === '#directorio' || hash === '#catalogo') {
    return { view: 'directory', query };
  }
  if (hash === '#conferencias') {
    return { view: 'conferences', query: '' };
  }
  if (hash === '#objetos-perdidos' || hash === '#comunidad') {
    return { view: 'lost-found', query: '' };
  }
  if (hash === '#gestion-bibliotecaria-famurp') {
    return { view: 'admin', query: '' };
  }
  return { view: '404', query: '' };
};

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(() => parseHashRoute().view);
  const [directorySearchQuery, setDirectorySearchQuery] = useState(() => parseHashRoute().query);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    triggerSilentWarmup();
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const { view, query } = parseHashRoute();
      setCurrentView(view);
      if (view === 'directory' && query) {
        setDirectorySearchQuery(query);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const navigateTo = (view: AppView, query?: string) => {
    setCurrentView(view);
    if (view === 'home') {
      window.location.hash = '#inicio';
    } else if (view === 'directory') {
      const trimmed = query?.trim() || '';
      setDirectorySearchQuery(trimmed);
      window.location.hash = trimmed ? `#directorio?q=${encodeURIComponent(trimmed)}` : '#directorio';
    } else if (view === 'conferences') {
      const q = query ? (query.startsWith('?') ? query : `?${query}`) : '';
      window.location.hash = `#conferencias${q}`;
    } else if (view === 'lost-found') {
      window.location.hash = '#objetos-perdidos';
    } else if (view === 'admin') {
      window.location.hash = '#gestion-bibliotecaria-famurp';
    } else if (view === '404') {
      window.location.hash = '#404';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentView === 'admin') {
    return <AdminPage onNavigate={navigateTo} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#8CF9A9] selection:text-[#0F172A]">
      <Navbar currentView={currentView} onNavigate={navigateTo} />

      <div className={`flex-grow ${currentView !== 'home' ? 'pt-20' : ''}`}>
        {currentView === 'home' && <HomePage onNavigate={navigateTo} />}
        {currentView === 'directory' && <DirectoryPage initialSearchQuery={directorySearchQuery} />}
        {currentView === 'conferences' && <ConferencesPage />}
        {currentView === 'lost-found' && <LostFoundPage />}
        {currentView === '404' && <NotFoundPage onNavigate={navigateTo} />}
      </div>

      <Footer />

      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-lg bg-[#00A859] hover:bg-[#008744] text-white tactile-btn-green flex items-center justify-center transition-all duration-300 cursor-pointer animate-in fade-in zoom-in-95 group"
          title="Regresar al inicio"
          aria-label="Regresar al inicio"
        >
          <ChevronUp className="w-6 h-6 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default App;
