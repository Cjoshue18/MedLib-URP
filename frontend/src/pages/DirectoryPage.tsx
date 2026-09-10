import React, { useState } from 'react';
import { DATABASES_DATA, BiomedicalDatabase, getDatabaseLogoUrl } from '../features/guides/data/databasesData';

export const DirectoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'TODAS' | 'ESPECIALIZADA' | 'CLINICAS' | 'REVISTAS'>('TODAS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDb, setSelectedDb] = useState<BiomedicalDatabase>(DATABASES_DATA[0]);

  const filteredDbs = DATABASES_DATA.filter((db) => {
    const matchesSearch = 
      db.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      db.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      db.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (activeTab === 'ESPECIALIZADA') return matchesSearch && db.category === 'Especializada';
    if (activeTab === 'CLINICAS') return matchesSearch && db.category === 'Herramientas Clínicas';
    if (activeTab === 'REVISTAS') return matchesSearch && db.category === 'Revistas y Libros';
    return matchesSearch;
  });

  const selectedLogoSrc = getDatabaseLogoUrl(selectedDb.logoFile);

  return (
    <main className="flex-grow w-full max-w-[1280px] mx-auto px-6 py-8 flex flex-col gap-6">
      <div className="border-b border-border-subtle">
        <nav aria-label="Tabs" className="flex gap-8 overflow-x-auto pb-3">
          <button
            onClick={() => setActiveTab('TODAS')}
            className={`font-label-md text-label-md whitespace-nowrap py-1 cursor-pointer transition-colors ${
              activeTab === 'TODAS'
                ? 'text-primary border-b-2 border-primary font-bold'
                : 'text-text-slate hover:text-primary font-medium'
            }`}
          >
            TODAS LAS GUÍAS ({DATABASES_DATA.length})
          </button>
          <button
            onClick={() => setActiveTab('ESPECIALIZADA')}
            className={`font-label-md text-label-md whitespace-nowrap py-1 cursor-pointer transition-colors ${
              activeTab === 'ESPECIALIZADA'
                ? 'text-primary border-b-2 border-primary font-bold'
                : 'text-text-slate hover:text-primary font-medium'
            }`}
          >
            ESPECIALIZADAS MEDICINA
          </button>
          <button
            onClick={() => setActiveTab('CLINICAS')}
            className={`font-label-md text-label-md whitespace-nowrap py-1 cursor-pointer transition-colors ${
              activeTab === 'CLINICAS'
                ? 'text-primary border-b-2 border-primary font-bold'
                : 'text-text-slate hover:text-primary font-medium'
            }`}
          >
            POINT-OF-CARE &amp; CLÍNICAS
          </button>
          <button
            onClick={() => setActiveTab('REVISTAS')}
            className={`font-label-md text-label-md whitespace-nowrap py-1 cursor-pointer transition-colors ${
              activeTab === 'REVISTAS'
                ? 'text-primary border-b-2 border-primary font-bold'
                : 'text-text-slate hover:text-primary font-medium'
            }`}
          >
            REVISTAS Y LIBROS
          </button>
        </nav>
      </div>

      <div className="relative w-full max-w-3xl mx-auto my-2">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-slate-400 text-2xl">search</span>
        </div>
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar recurso por materia o nombre (ej. ClinicalKey, Scopus, Anatomía)..."
          className="w-full pl-12 pr-32 py-3 rounded-full border border-border-subtle focus:border-primary-container focus:ring-1 focus:ring-primary-container bg-white font-body-md text-slate-800 shadow-sm placeholder:text-slate-400 transition-all duration-200 outline-none text-sm md:text-base"
        />
        <button 
          onClick={() => {}}
          className="absolute inset-y-1.5 right-1.5 px-8 bg-primary-container text-white rounded-full font-label-md hover:bg-surface-tint transition-colors cursor-pointer font-semibold shadow-sm flex items-center justify-center"
        >
          Buscar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-surface-card p-6 rounded-xl shadow-sm border border-border-subtle">
        <aside className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-container-low border-2 border-primary-container rounded-lg p-4 flex justify-between items-center transition-all duration-200">
            <span className="font-label-md text-primary-container font-semibold truncate mr-2 text-base">
              {selectedDb.title}
            </span>
            <span className="bg-primary-container text-white font-caption text-xs font-semibold px-2.5 py-1 rounded-full text-center shrink-0">
              {selectedDb.accessType === 'Suscripción URP' ? '🔐 URP' : '🌐 OPEN'}
            </span>
          </div>

          <div className="bg-white border border-border-subtle rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <div className="border-b border-border-subtle pb-3">
              <span className="font-title-lg text-slate-800 font-semibold">
                Ficha Técnica del Recurso
              </span>
            </div>

            <div className="flex justify-center items-center h-20 p-3 bg-slate-50 border border-slate-100 rounded-lg">
              <img 
                src={selectedLogoSrc} 
                alt={selectedDb.title} 
                className="max-h-14 max-w-full object-contain"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {selectedDb.tags.map((tag, idx) => (
                <span 
                  key={idx}
                  className="bg-primary-container/10 text-primary-container px-2.5 py-1 rounded-full text-xs font-semibold border border-primary-container/20 uppercase tracking-wide"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="font-body-md text-slate-700 text-sm leading-relaxed">
              {selectedDb.description}
            </p>

            <ul className="list-disc list-inside text-xs text-slate-600 flex flex-col gap-1.5">
              <li>Modalidad de Acceso: <strong className="text-slate-800">{selectedDb.accessType}</strong></li>
              <li>Categoría Temática: <strong className="text-slate-800">{selectedDb.category}</strong></li>
              <li>Soporte Institucional URP Facultad de Medicina</li>
            </ul>

            <a
              href={selectedDb.accessUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-primary-container text-white px-6 py-3 rounded-lg font-label-md hover:bg-primary transition-colors duration-200 mt-2 w-full flex justify-center items-center gap-2 shadow-sm cursor-pointer font-semibold"
            >
              <span>{selectedDb.accessType === 'Suscripción URP' ? 'Acceder vía Intranet URP' : 'Ir a la base de datos'}</span>
              <span className="material-symbols-outlined text-lg">open_in_new</span>
            </a>
          </div>

          <div className="bg-white border border-border-subtle rounded-xl overflow-hidden shadow-sm">
            <div 
              className="bg-cover bg-center w-full h-44 relative"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80')`
              }}
            >
              <div 
                onClick={() => alert(`Guía de uso para ${selectedDb.title}: Ingresa con tus credenciales URP en https://test.urp.edu.pe/Intranet/.`)}
                className="absolute inset-0 bg-black/20 flex items-center justify-center group cursor-pointer hover:bg-black/30 transition-colors"
              >
                <span className="material-symbols-outlined text-white text-[48px] group-hover:scale-110 transition-transform">
                  play_circle
                </span>
              </div>
              <span className="absolute bottom-2 right-2 bg-black/70 text-white font-caption text-xs px-2 py-0.5 rounded">
                2:15
              </span>
            </div>
            <div className="p-3.5 flex justify-between items-start bg-[#2d3133] text-white">
              <div>
                <h4 className="font-label-md text-sm font-semibold">Tutorial de Acceso Remoto URP</h4>
                <span className="font-caption text-xs text-white/70">Video guía para estudiantes</span>
              </div>
              <span className="material-symbols-outlined text-white/70 text-xl">more_vert</span>
            </div>
          </div>
        </aside>

        <section className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-border-subtle pb-3">
            <span className="font-title-lg text-slate-800 font-semibold">
              Mostrando {filteredDbs.length} recurso(s)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 content-start max-h-[780px] overflow-y-auto pr-1">
            {filteredDbs.map((db) => {
              const isSelected = selectedDb.id === db.id;
              return (
                <button
                  key={db.id}
                  onClick={() => setSelectedDb(db)}
                  className={`border rounded-lg p-3.5 flex justify-between items-center transition-all duration-200 text-left cursor-pointer ${
                    isSelected 
                      ? 'bg-surface-container-low border-2 border-primary-container shadow-sm'
                      : 'bg-white border-border-subtle hover:border-primary-container hover:shadow-md'
                  }`}
                >
                  <span className={`font-body-md text-sm truncate pr-2 ${
                    isSelected ? 'font-bold text-primary' : 'text-slate-800 font-medium'
                  }`}>
                    {db.title}
                  </span>
                  <span className={`font-caption text-xs px-2.5 py-0.5 rounded-full min-w-[28px] text-center font-semibold shrink-0 ${
                    isSelected 
                      ? 'bg-primary-container text-white' 
                      : 'bg-surface-dim text-slate-700'
                  }`}>
                    {db.accessType === 'Suscripción URP' ? '🔐 URP' : '🌐 OPEN'}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
};
