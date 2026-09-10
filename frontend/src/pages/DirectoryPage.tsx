import React, { useState } from 'react';
import { 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  Database, 
  PlayCircle, 
  Lock, 
  Globe, 
  X,
  BookOpen,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { DATABASES_DATA, BiomedicalDatabase, getDatabaseLogoUrl } from '../features/guides/data/databasesData';

export const DirectoryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDb, setSelectedDb] = useState<BiomedicalDatabase>(DATABASES_DATA[0]);

  const filteredDbs = DATABASES_DATA.filter((db) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      db.title.toLowerCase().includes(q) ||
      db.description.toLowerCase().includes(q) ||
      db.category.toLowerCase().includes(q) ||
      db.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  const selectedLogoSrc = getDatabaseLogoUrl(selectedDb.logoFile);

  const quickKeywords = [
    'ClinicalKey',
    'UpToDate',
    'Scopus',
    'PubMed',
    'Anatomía',
    'Farmacología',
    'Elsevier'
  ];

  return (
    <div className="w-full pb-20">
      <section className="bg-slate-50 border-b-2 border-slate-900 py-10 sm:py-12">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#008744] text-white text-xs font-extrabold uppercase tracking-wider shadow-sm mb-3">
            <Database className="w-3.5 h-3.5 text-white" />
            <span>Catálogo Científico Digital</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            Directorio de Recursos Biomédicos
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl mt-2 leading-relaxed">
            Plataformas suscritas, bases de datos referenciales, point-of-care y revistas de alto impacto clínico acreditadas para la Facultad de Medicina Humana URP.
          </p>
        </div>
      </section>

      <main className="max-w-[1280px] mx-auto px-6 pt-10 flex flex-col gap-8">
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-3">
          <div className="w-full bg-white rounded-2xl border-2 border-slate-900 shadow-urp-brutal-sm p-1.5 flex items-center gap-2">
            <div className="pl-3 text-slate-400 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar recurso por nombre, materia o especialidad..."
              className="flex-1 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-transparent outline-none font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                title="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button 
              type="button"
              className="px-5 sm:px-6 py-2 rounded-xl bg-[#008744] hover:bg-[#006b35] text-white font-bold text-xs sm:text-sm shadow-urp-brutal-green tactile-btn-green transition-all cursor-pointer shrink-0"
            >
              Buscar
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#008744]" />
              Sugerencias:
            </span>
            {quickKeywords.map((kw) => (
              <button
                key={kw}
                type="button"
                onClick={() => setSearchQuery(kw)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-semibold ${
                  searchQuery.toLowerCase() === kw.toLowerCase()
                    ? 'bg-[#008744] text-white border-[#008744]'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-900 hover:text-slate-900 shadow-2xs'
                }`}
              >
                {kw}
              </button>
            ))}
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-bold hover:bg-rose-100 transition-colors cursor-pointer"
              >
                Ver todos
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <aside className="lg:col-span-5 xl:col-span-5 flex flex-col gap-6">
            <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-urp-brutal p-6 sm:p-7 flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#008744] animate-pulse"></div>
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Ficha Técnica del Recurso
                  </span>
                </div>
                <span className={`text-xs font-black px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                  selectedDb.accessType === 'Suscripción URP'
                    ? 'bg-emerald-50 text-[#008744] border-emerald-300'
                    : 'bg-sky-50 text-sky-700 border-sky-300'
                }`}>
                  {selectedDb.accessType === 'Suscripción URP' ? (
                    <>
                      <Lock className="w-3 h-3" />
                      <span>Suscripción URP</span>
                    </>
                  ) : (
                    <>
                      <Globe className="w-3 h-3" />
                      <span>Acceso Abierto</span>
                    </>
                  )}
                </span>
              </div>

              <div className="flex justify-center items-center h-28 p-4 bg-slate-50/80 border-2 border-slate-200 rounded-2xl shadow-inner">
                {selectedLogoSrc ? (
                  <img 
                    src={selectedLogoSrc} 
                    alt={selectedDb.title} 
                    className="max-h-16 max-w-full object-contain"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                    <Database className="w-6 h-6 text-[#008744]" />
                    <span>{selectedDb.title}</span>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-display font-extrabold text-xl text-slate-900 tracking-tight mb-2">
                  {selectedDb.title}
                </h3>
                <div className="flex gap-1.5 flex-wrap mb-3">
                  {selectedDb.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-md text-[11px] font-bold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {selectedDb.description}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs text-slate-700">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                  <span className="font-bold text-slate-500">Modalidad de Acceso:</span>
                  <span className="font-black text-slate-900 flex items-center gap-1">
                    {selectedDb.accessType === 'Suscripción URP' ? <Lock className="w-3 h-3 text-[#008744]" /> : <Globe className="w-3 h-3 text-sky-600" />}
                    {selectedDb.accessType}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                  <span className="font-bold text-slate-500">Categoría:</span>
                  <span className="font-black text-slate-900">{selectedDb.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-500">Afiliación:</span>
                  <span className="font-black text-[#008744] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Facultad de Medicina URP
                  </span>
                </div>
              </div>

              <a
                href={selectedDb.accessUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-6 rounded-xl bg-[#008744] hover:bg-[#006b35] text-white font-bold text-xs sm:text-sm shadow-urp-brutal-green tactile-btn-green transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{selectedDb.accessType === 'Suscripción URP' ? 'Acceder vía Intranet URP' : 'Ir a la Base de Datos'}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-urp-brutal overflow-hidden">
              <div 
                className="bg-cover bg-center w-full h-40 relative group cursor-pointer"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80')`
                }}
                onClick={() => alert(`Guía de uso para ${selectedDb.title}: Ingresa con tus credenciales URP en https://test.urp.edu.pe/Intranet/.`)}
              >
                <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/50 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 group-hover:scale-110 group-hover:bg-white transition-all flex items-center justify-center text-[#008744] shadow-md">
                    <PlayCircle className="w-8 h-8" />
                  </div>
                </div>
                <span className="absolute bottom-2.5 right-2.5 bg-slate-900/90 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-md">
                  2:15 MIN
                </span>
              </div>
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-white">Tutorial de Acceso Remoto</h4>
                  <span className="text-[10px] text-slate-400">Guía paso a paso para estudiantes y docentes</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-[#8cf9a9]" />
              </div>
            </div>
          </aside>

          <section className="lg:col-span-7 xl:col-span-7 flex flex-col gap-4">
            <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-urp-brutal p-6 sm:p-7 flex flex-col gap-4">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-slate-900">
                  Mostrando recursos
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Haz clic en cualquier plataforma para visualizar su ficha técnica completa y enlace de acceso directo.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 content-start max-h-[820px] overflow-y-auto pr-1">
                {filteredDbs.length > 0 ? (
                  filteredDbs.map((db) => {
                    const isSelected = selectedDb.id === db.id;
                    return (
                      <button
                        key={db.id}
                        type="button"
                        onClick={() => setSelectedDb(db)}
                        className={`rounded-2xl p-4 flex items-center justify-between transition-all cursor-pointer text-left border-2 ${
                          isSelected 
                            ? 'bg-emerald-50/80 border-[#008744] shadow-urp-brutal-sm scale-[1.01]' 
                            : 'bg-white border-slate-200 hover:border-slate-900 hover:shadow-urp-brutal-sm'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <h4 className={`text-xs sm:text-sm truncate font-bold ${
                            isSelected ? 'text-[#008744]' : 'text-slate-900'
                          }`}>
                            {db.title}
                          </h4>
                          <span className="text-[11px] text-slate-500 font-medium block truncate mt-0.5">
                            {db.category}
                          </span>
                        </div>
                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md shrink-0 border ${
                          db.accessType === 'Suscripción URP'
                            ? 'bg-emerald-100/70 text-[#008744] border-emerald-300'
                            : 'bg-sky-50 text-sky-700 border-sky-300'
                        }`}>
                          {db.accessType === 'Suscripción URP' ? '🔐 URP' : '🌐 OPEN'}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="col-span-2 py-12 text-center text-slate-500">
                    <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-700">No se encontraron recursos</p>
                    <p className="text-xs text-slate-500 mt-1">Prueba con otra palabra clave o limpia el campo de búsqueda.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
