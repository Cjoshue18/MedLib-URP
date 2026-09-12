import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { DirectoryPage } from './pages/DirectoryPage';
import { ConferencesPage } from './pages/ConferencesPage';
import { LostFoundPage } from './pages/LostFoundPage';
import { AdminPage } from './pages/AdminPage';

export type AppView = 'home' | 'directory' | 'conferences' | 'lost-found' | 'admin';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#directorio' || hash === '#catalogo') {
        setCurrentView('directory');
      } else if (hash === '#conferencias' || hash === '#alfin') {
        setCurrentView('conferences');
      } else if (hash === '#objetos-perdidos' || hash === '#comunidad') {
        setCurrentView('lost-found');
      } else if (hash === '#gestion-bibliotecaria-famurp') {
        setCurrentView('admin');
      } else {
        setCurrentView('home');
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

  const navigateTo = (view: AppView) => {
    setCurrentView(view);
    if (view === 'home') window.location.hash = '#inicio';
    else if (view === 'directory') window.location.hash = '#directorio';
    else if (view === 'conferences') window.location.hash = '#conferencias';
    else if (view === 'lost-found') window.location.hash = '#objetos-perdidos';
    else if (view === 'admin') window.location.hash = '#gestion-bibliotecaria-famurp';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentView === 'admin') {
    return <AdminPage onNavigate={navigateTo} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-background font-body-md antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Navbar currentView={currentView} onNavigate={navigateTo} />

      <div className="flex-grow">
        {currentView === 'home' && <HomePage onNavigate={navigateTo} />}
        {currentView === 'directory' && <DirectoryPage />}
        {currentView === 'conferences' && <ConferencesPage />}
        {currentView === 'lost-found' && <LostFoundPage />}
      </div>

      <Footer />

      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#008744] hover:bg-[#006b35] text-white shadow-urp-brutal-green tactile-btn-green flex items-center justify-center transition-all duration-300 cursor-pointer animate-in fade-in zoom-in-95 group"
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
