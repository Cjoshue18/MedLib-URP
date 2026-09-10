import React, { useState } from 'react';

export const ConferencesPage: React.FC = () => {
  const [studentCode, setStudentCode] = useState('');
  const [searchStatus, setSearchStatus] = useState<string | null>(null);

  const conferences = [
    {
      id: 'conf-01',
      day: '15',
      month: 'NOV',
      time: '10:00 AM - 12:00 PM',
      location: 'Auditorio Principal',
      locationIcon: 'location_on',
      title: 'Búsqueda Sistémica Avanzada',
      description: 'Estrategias de búsqueda estructurada en bases de datos biomédicas (PubMed, Scopus, Web of Science) para revisiones sistemáticas.',
      tag: 'Investigación',
      tagColor: 'bg-[#0284c7]/10 text-[#0284c7]',
    },
    {
      id: 'conf-02',
      day: '22',
      month: 'NOV',
      time: '03:00 PM - 05:00 PM',
      location: 'Sala Virtual (Teams)',
      locationIcon: 'videocam',
      title: 'Gestores Bibliográficos: Mendeley & Zotero',
      description: 'Taller práctico sobre la organización, citación y creación de referencias bibliográficas utilizando normas Vancouver y APA.',
      tag: 'Herramientas',
      tagColor: 'bg-[#0284c7]/10 text-[#0284c7]',
    },
    {
      id: 'conf-03',
      day: '28',
      month: 'NOV',
      time: '11:00 AM - 12:30 PM',
      location: 'Laboratorio de Cómputo B',
      locationIcon: 'location_on',
      title: 'Uso Avanzado de Scopus',
      description: 'Análisis de métricas, perfiles de autor, y seguimiento de citas en la base de datos Scopus para potenciar la visibilidad académica.',
      tag: 'Bases de Datos',
      tagColor: 'bg-[#0284c7]/10 text-[#0284c7]',
    }
  ];

  const handleCheckAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentCode.trim()) return;
    setSearchStatus(`Estudiante con código ${studentCode}: Registra 18 conferencias validadas formalmente para trámite de egresados.`);
  };

  return (
    <div className="w-full">
      {/* Page Header matching Stitch */}
      <section className="bg-surface-container-low border-b border-border-subtle py-8">
        <div className="max-w-[1280px] mx-auto px-6">
          <h1 className="font-headline-lg text-text-slate mb-2">
            Programa ALFIN
          </h1>
          <p className="font-body-lg text-secondary max-w-3xl">
            Alfabetización Informacional: Talleres y capacitaciones diseñadas para fortalecer las competencias de investigación en ciencias de la salud.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Events List (Left Column) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="font-title-lg text-text-slate font-semibold">
                Próximas Actividades
              </h2>
              <div className="flex gap-2">
                <span className="inline-flex items-center gap-1.5 font-label-md bg-white border border-border-subtle rounded-full px-4 py-1.5 text-secondary shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">filter_list</span> Filtrar
                </span>
              </div>
            </div>

            {/* Event Cards */}
            {conferences.map((conf) => (
              <div 
                key={conf.id}
                className="bg-surface-card border border-border-subtle rounded-xl p-0 flex flex-col sm:flex-row overflow-hidden hover:shadow-[0_4px_20px_rgba(30,41,59,0.12)] hover:border-primary-container transition-all duration-300"
              >
                <div className="bg-primary-container text-white flex flex-col items-center justify-center p-6 min-w-[120px] flex-shrink-0">
                  <span className="font-headline-md text-3xl font-bold">{conf.day}</span>
                  <span className="font-label-md uppercase tracking-wider text-sm font-semibold">{conf.month}</span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-secondary font-caption text-xs mb-2">
                      <span className="material-symbols-outlined text-[16px]">schedule</span> {conf.time}
                      <span className="text-border-subtle">|</span>
                      <span className="material-symbols-outlined text-[16px]">{conf.locationIcon}</span> {conf.location}
                    </div>
                    <h3 className="font-title-lg text-text-slate mb-2 font-semibold">
                      {conf.title}
                    </h3>
                    <p className="font-body-md text-secondary text-sm mb-4 line-clamp-2 leading-relaxed">
                      {conf.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <span className={`${conf.tagColor} font-label-md text-xs px-3 py-1 rounded-full font-semibold`}>
                      {conf.tag}
                    </span>
                    <button 
                      onClick={() => alert(`Pre-inscripción confirmada para "${conf.title}". Se enviará recordatorio a tu correo institucional.`)}
                      className="font-label-md text-primary-container border border-primary-container hover:bg-primary-container hover:text-white rounded-full px-6 py-2 transition-colors min-h-[40px] cursor-pointer font-semibold shadow-sm"
                    >
                      Inscribirme
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar (Right Column) */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            {/* Calendar Widget matching Stitch */}
            <div className="bg-surface-card border border-border-subtle rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-title-lg text-text-slate font-semibold">Noviembre 2026</h3>
                <div className="flex gap-2">
                  <button className="text-secondary hover:text-primary-container cursor-pointer p-1">
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                  </button>
                  <button className="text-secondary hover:text-primary-container cursor-pointer p-1">
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                <div className="font-caption text-secondary py-1 font-semibold text-xs">L</div>
                <div className="font-caption text-secondary py-1 font-semibold text-xs">M</div>
                <div className="font-caption text-secondary py-1 font-semibold text-xs">X</div>
                <div className="font-caption text-secondary py-1 font-semibold text-xs">J</div>
                <div className="font-caption text-secondary py-1 font-semibold text-xs">V</div>
                <div className="font-caption text-secondary py-1 font-semibold text-xs">S</div>
                <div className="font-caption text-secondary py-1 font-semibold text-xs">D</div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center font-body-md text-sm">
                <div className="py-2 text-slate-300">28</div>
                <div className="py-2 text-slate-300">29</div>
                <div className="py-2 text-slate-300">30</div>
                <div className="py-2 text-slate-300">31</div>
                <div className="py-2 hover:bg-slate-100 rounded-full cursor-pointer transition-colors">1</div>
                <div className="py-2 hover:bg-slate-100 rounded-full cursor-pointer transition-colors">2</div>
                <div className="py-2 hover:bg-slate-100 rounded-full cursor-pointer transition-colors">3</div>
                <div className="py-2 hover:bg-slate-100 rounded-full cursor-pointer transition-colors">4</div>
                <div className="py-2 hover:bg-slate-100 rounded-full cursor-pointer transition-colors">5</div>
                <div className="py-2 hover:bg-slate-100 rounded-full cursor-pointer transition-colors">6</div>
                <div className="py-2 hover:bg-slate-100 rounded-full cursor-pointer transition-colors">7</div>
                <div className="py-2 hover:bg-slate-100 rounded-full cursor-pointer transition-colors">8</div>
                <div className="py-2 hover:bg-slate-100 rounded-full cursor-pointer transition-colors">9</div>
                <div className="py-2 hover:bg-slate-100 rounded-full cursor-pointer transition-colors">10</div>
                <div className="py-2 hover:bg-slate-100 rounded-full cursor-pointer transition-colors">11</div>
                <div className="py-2 hover:bg-slate-100 rounded-full cursor-pointer transition-colors">12</div>
                <div className="py-2 hover:bg-slate-100 rounded-full cursor-pointer transition-colors">13</div>
                <div className="py-2 hover:bg-slate-100 rounded-full cursor-pointer transition-colors">14</div>
                <div className="py-2 bg-primary-container text-white rounded-full font-bold shadow-sm cursor-pointer hover:bg-primary transition-colors">15</div>
                <div className="py-2 hover:bg-slate-100 rounded-full cursor-pointer transition-colors">16</div>
                <div className="py-2 hover:bg-slate-100 rounded-full cursor-pointer transition-colors">17</div>
                <div className="py-2 hover:bg-slate-100 rounded-full cursor-pointer transition-colors">18</div>
                <div className="py-2 hover:bg-slate-100 rounded-full cursor-pointer transition-colors">19</div>
                <div className="py-2 hover:bg-slate-100 rounded-full cursor-pointer transition-colors">20</div>
                <div className="py-2 hover:bg-slate-100 rounded-full cursor-pointer transition-colors border border-primary-container text-primary-container font-semibold">21</div>
                <div className="py-2 bg-primary-container text-white rounded-full font-bold shadow-sm cursor-pointer hover:bg-primary transition-colors">22</div>
                <div className="py-2 hover:bg-slate-100 rounded-full cursor-pointer transition-colors">23</div>
                <div className="py-2 hover:bg-slate-100 rounded-full cursor-pointer transition-colors">24</div>
                <div className="py-2 hover:bg-slate-100 rounded-full cursor-pointer transition-colors">25</div>
                <div className="py-2 hover:bg-slate-100 rounded-full cursor-pointer transition-colors">26</div>
                <div className="py-2 hover:bg-slate-100 rounded-full cursor-pointer transition-colors">27</div>
                <div className="py-2 bg-primary-container text-white rounded-full font-bold shadow-sm cursor-pointer hover:bg-primary transition-colors">28</div>
                <div className="py-2 hover:bg-slate-100 rounded-full cursor-pointer transition-colors">29</div>
                <div className="py-2 hover:bg-slate-100 rounded-full cursor-pointer transition-colors">30</div>
                <div className="py-2 text-slate-300">1</div>
              </div>
            </div>

            {/* Newsletter Subscription Card matching Stitch */}
            <div className="bg-surface-card border border-border-subtle rounded-xl p-6 shadow-sm overflow-hidden relative">
              <div className="absolute inset-0 bg-primary-container/5 pointer-events-none"></div>
              <h3 className="font-title-lg text-text-slate mb-1 relative z-10 font-semibold">
                Suscríbete al boletín
              </h3>
              <p className="font-body-md text-secondary text-sm mb-4 relative z-10 leading-relaxed">
                Recibe notificaciones sobre nuevas capacitaciones y recursos bibliográficos.
              </p>
              <form onSubmit={(e) => { e.preventDefault(); alert('¡Suscrito al boletín de conferencias!'); }} className="flex flex-col gap-3 relative z-10">
                <input 
                  type="email"
                  required
                  placeholder="Correo institucional (@urp.edu.pe)"
                  className="w-full font-body-md text-sm border border-border-subtle rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all outline-none bg-white"
                />
                <button 
                  type="submit"
                  className="w-full bg-primary-container text-white font-label-md rounded-full py-2.5 hover:bg-primary transition-colors min-h-[44px] cursor-pointer font-semibold shadow-sm"
                >
                  Suscribirse
                </button>
              </form>
            </div>

            {/* Attendance Check Box */}
            <div className="bg-surface-card border border-border-subtle rounded-xl p-6 shadow-sm space-y-3">
              <h3 className="font-title-lg text-text-slate font-semibold">
                Consultar Mis Asistencias
              </h3>
              <p className="font-caption text-secondary text-xs leading-relaxed">
                Verifica tu cómputo de conferencias para el trámite de egreso (acreditación SUNEDU).
              </p>
              <form onSubmit={handleCheckAttendance} className="space-y-3">
                <input 
                  type="text"
                  value={studentCode}
                  onChange={(e) => setStudentCode(e.target.value)}
                  placeholder="Código URP (ej. 20241012)"
                  maxLength={10}
                  className="w-full px-3 py-2.5 border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-primary-container bg-white"
                />
                <button
                  type="submit"
                  className="w-full bg-primary-container text-white py-2.5 rounded-full font-label-md hover:bg-primary transition-colors cursor-pointer font-semibold shadow-sm"
                >
                  Consultar Estado
                </button>
              </form>

              {searchStatus && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-urp-800 font-medium">
                  {searchStatus}
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};
