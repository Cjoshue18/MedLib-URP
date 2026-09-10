import React, { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  Video, 
  Send, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  GraduationCap,
  CalendarDays,
  CheckCircle2
} from 'lucide-react';

export const ConferencesPage: React.FC = () => {
  const [admissionsTab, setAdmissionsTab] = useState<'pregrado' | 'posgrado' | 'residentado'>('pregrado');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const conferences = [
    {
      id: 'conf-01',
      day: '15',
      month: 'NOV',
      time: '10:00 AM - 12:00 PM',
      location: 'Auditorio Principal FAMURP',
      locationType: 'onsite',
      title: 'Búsqueda Sistémica Avanzada',
      description: 'Estrategias de búsqueda estructurada en bases de datos biomédicas (PubMed, Scopus, Web of Science) para revisiones sistemáticas y metaanálisis.',
      tag: 'Investigación Biomédica',
      tagColor: 'bg-emerald-50 text-[#008744] border-emerald-200',
    },
    {
      id: 'conf-02',
      day: '22',
      month: 'NOV',
      time: '03:00 PM - 05:00 PM',
      location: 'Sala Virtual (Microsoft Teams)',
      locationType: 'virtual',
      title: 'Gestores Bibliográficos: Mendeley & Zotero',
      description: 'Taller práctico sobre la organización, citación y creación automatizada de referencias bibliográficas utilizando normas Vancouver y APA 7ma edición.',
      tag: 'Herramientas Digitales',
      tagColor: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    {
      id: 'conf-03',
      day: '28',
      month: 'NOV',
      time: '11:00 AM - 12:30 PM',
      location: 'Laboratorio de Cómputo B',
      locationType: 'onsite',
      title: 'Uso Avanzado de Scopus & Métricas Científicas',
      description: 'Análisis de cuartiles Scimago, métricas CiteScore, perfiles de autor Orcid/Scopus y seguimiento de citas para potenciar la visibilidad académica institucional.',
      tag: 'Bases de Datos',
      tagColor: 'bg-purple-50 text-purple-700 border-purple-200',
    }
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 4000);
    setEmail('');
  };

  return (
    <div className="w-full pb-20">
      <section className="bg-slate-50 border-b-2 border-slate-900 py-10 sm:py-12">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#008744] text-white text-xs font-extrabold uppercase tracking-wider shadow-sm mb-3">
            <GraduationCap className="w-3.5 h-3.5 text-white" />
            <span>Colección y Formación Médica ALFIN</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            Programa ALFIN &amp; Conferencias
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl mt-2 leading-relaxed">
            Alfabetización Informacional: Talleres presenciales y virtuales diseñados para fortalecer las competencias de investigación clínica y bibliográfica de la Facultad de Medicina Humana.
          </p>
        </div>
      </section>

      <main className="max-w-[1280px] mx-auto px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                  Próximas Actividades
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Capacitaciones programadas con certificación y horas académicas
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {conferences.map((conf) => (
                <div 
                  key={conf.id}
                  className="bg-white rounded-2xl border-2 border-slate-900 shadow-urp-brutal-sm hover:translate-x-0.5 hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col sm:flex-row group"
                >
                  <div className="bg-[#008744] text-white flex flex-col items-center justify-center p-6 min-w-[120px] shrink-0 font-display font-black shadow-inner">
                    <span className="text-3xl sm:text-4xl leading-none">{conf.day}</span>
                    <span className="text-xs uppercase tracking-widest font-extrabold mt-1">{conf.month}</span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-semibold mb-2">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#008744]" />
                          {conf.time}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1.5">
                          {conf.locationType === 'virtual' ? (
                            <Video className="w-3.5 h-3.5 text-[#008744]" />
                          ) : (
                            <MapPin className="w-3.5 h-3.5 text-[#008744]" />
                          )}
                          {conf.location}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-display font-extrabold text-slate-900 mb-2 group-hover:text-[#008744] transition-colors">
                        {conf.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                        {conf.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                      <span className={`text-xs px-3 py-1 rounded-full font-bold border ${conf.tagColor}`}>
                        {conf.tag}
                      </span>
                      <button 
                        onClick={() => alert(`Pre-inscripción confirmada para "${conf.title}". Se enviará enlace y recordatorio a tu correo institucional.`)}
                        className="py-2 px-5 rounded-full border-2 border-slate-900 font-bold text-xs text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-urp-brutal-sm tactile-btn cursor-pointer"
                      >
                        Inscribirme
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-urp-brutal p-6">
              <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-[#008744]" />
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                    Noviembre 2026
                  </h3>
                </div>
                <div className="flex gap-1">
                  <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 text-slate-700 cursor-pointer transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 text-slate-700 cursor-pointer transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d, i) => (
                  <div key={i} className="text-[11px] font-bold text-slate-500 py-1">
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold">
                <div className="py-2 text-slate-300">28</div>
                <div className="py-2 text-slate-300">29</div>
                <div className="py-2 text-slate-300">30</div>
                <div className="py-2 text-slate-300">31</div>
                <div className="py-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">1</div>
                <div className="py-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">2</div>
                <div className="py-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">3</div>
                <div className="py-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">4</div>
                <div className="py-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">5</div>
                <div className="py-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">6</div>
                <div className="py-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">7</div>
                <div className="py-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">8</div>
                <div className="py-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">9</div>
                <div className="py-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">10</div>
                <div className="py-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">11</div>
                <div className="py-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">12</div>
                <div className="py-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">13</div>
                <div className="py-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">14</div>
                <div className="py-2 bg-[#008744] text-white rounded-lg font-black shadow-sm cursor-pointer hover:bg-[#006b35] transition-colors">15</div>
                <div className="py-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">16</div>
                <div className="py-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">17</div>
                <div className="py-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">18</div>
                <div className="py-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">19</div>
                <div className="py-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">20</div>
                <div className="py-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors border border-[#008744] text-[#008744] font-bold">21</div>
                <div className="py-2 bg-[#008744] text-white rounded-lg font-black shadow-sm cursor-pointer hover:bg-[#006b35] transition-colors">22</div>
                <div className="py-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">23</div>
                <div className="py-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">24</div>
                <div className="py-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">25</div>
                <div className="py-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">26</div>
                <div className="py-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">27</div>
                <div className="py-2 bg-[#008744] text-white rounded-lg font-black shadow-sm cursor-pointer hover:bg-[#006b35] transition-colors">28</div>
                <div className="py-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">29</div>
                <div className="py-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">30</div>
                <div className="py-2 text-slate-300">1</div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-urp-brutal p-6">
              <div className="border-b border-slate-200 pb-3 mb-4">
                <span className="text-[10px] font-bold text-[#008744] uppercase tracking-wider block">
                  COMUNIDAD FAMURP
                </span>
                <h3 className="text-base sm:text-lg font-display font-extrabold text-slate-900">
                  Suscríbete al Boletín ALFIN
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Recibe notificaciones sobre nuevas capacitaciones y recursos bibliográficos.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-1.5">
                    Modalidad académica:
                  </span>
                  <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setAdmissionsTab('pregrado')}
                      className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                        admissionsTab === 'pregrado' 
                          ? 'bg-[#008744] text-white shadow-xs' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Pregrado
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdmissionsTab('posgrado')}
                      className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                        admissionsTab === 'posgrado' 
                          ? 'bg-[#008744] text-white shadow-xs' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Posgrado
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdmissionsTab('residentado')}
                      className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                        admissionsTab === 'residentado' 
                          ? 'bg-[#008744] text-white shadow-xs' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Residentado
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Correo institucional:
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu.correo@urp.edu.pe"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#008744]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#008744] hover:bg-[#006b35] text-white font-bold text-xs sm:text-sm shadow-urp-brutal-green tactile-btn-green transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {subscribed ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>¡Suscrito como {admissionsTab.toUpperCase()}!</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Registrarme al Boletín</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <ShieldCheck className="w-4 h-4 text-[#008744] shrink-0 mt-0.5" />
                  <span className="text-slate-600 leading-snug">
                    Notificaciones exclusivas de horas ALFIN para acreditación médica SUNEDU.
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};
