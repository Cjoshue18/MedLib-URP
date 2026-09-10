import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { DirectoryPage } from './pages/DirectoryPage';
import { ConferencesPage } from './pages/ConferencesPage';
import { LostFoundPage } from './pages/LostFoundPage';

export type AppView = 'home' | 'directory' | 'conferences' | 'lost-found';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');

  // Sync with window.location.hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#directorio' || hash === '#catalogo') {
        setCurrentView('directory');
      } else if (hash === '#conferencias' || hash === '#alfin') {
        setCurrentView('conferences');
      } else if (hash === '#objetos-perdidos' || hash === '#comunidad') {
        setCurrentView('lost-found');
      } else {
        setCurrentView('home');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Initial check
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view: AppView) => {
    setCurrentView(view);
    if (view === 'home') window.location.hash = '#inicio';
    else if (view === 'directory') window.location.hash = '#directorio';
    else if (view === 'conferences') window.location.hash = '#conferencias';
    else if (view === 'lost-found') window.location.hash = '#objetos-perdidos';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-background font-body-md antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Top Navbar matching Stitch */}
      <Navbar currentView={currentView} onNavigate={navigateTo} />

      {/* Dynamic View rendering adhering to Stitch multi-page architecture */}
      <div className="flex-grow">
        {currentView === 'home' && <HomePage onNavigate={navigateTo} />}
        {currentView === 'directory' && <DirectoryPage />}
        {currentView === 'conferences' && <ConferencesPage />}
        {currentView === 'lost-found' && <LostFoundPage />}
      </div>

      {/* Institutional Footer matching Stitch */}
      <Footer />
    </div>
  );
};

export default App;
