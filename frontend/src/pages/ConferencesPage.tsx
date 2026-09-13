import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  Video, 
  Send, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  CalendarDays,
  CheckCircle2,
  Radio, 
  Share2, 
  Check,
  Loader2 
} from 'lucide-react';
import { 
  conferenceService, 
  ConferenceSummary, 
  ConferenceRegistrationView, 
  AttendanceLiveView 
} from '../features/conferences';

export const ConferencesPage: React.FC = () => {
  const [admissionsTab, setAdmissionsTab] = useState<'pregrado' | 'posgrado' | 'residentado'>('pregrado');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const [conferences, setConferences] = useState<ConferenceSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedConferenceForReg, setSelectedConferenceForReg] = useState<ConferenceSummary | null>(null);
  const [selectedConferenceForAttendance, setSelectedConferenceForAttendance] = useState<ConferenceSummary | null>(null);

  const [copiedId, setCopiedId] = useState<number | null>(null);

  const loadConferences = async () => {
    setIsLoading(true);
    try {
      const data = await conferenceService.getConferences();
      setConferences(data || []);
    } catch {
      setConferences([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConferences();
  }, []);

  const handleUrlHash = () => {
    const hash = window.location.hash;
    if (hash.includes('asistencia=')) {
      const idStr = hash.split('asistencia=')[1]?.split('&')[0];
      const id = parseInt(idStr, 10);
      if (id && conferences.length > 0) {
        const match = conferences.find(c => c.idConferencia === id);
        if (match) {
          setSelectedConferenceForReg(null);
          setSelectedConferenceForAttendance(match);
        }
      }
    } else if (hash.includes('inscripcion=')) {
      const idStr = hash.split('inscripcion=')[1]?.split('&')[0];
      const id = parseInt(idStr, 10);
      if (id && conferences.length > 0) {
        const match = conferences.find(c => c.idConferencia === id);
        if (match) {
          setSelectedConferenceForAttendance(null);
          setSelectedConferenceForReg(match);
        }
      }
    } else {
      setSelectedConferenceForReg(null);
      setSelectedConferenceForAttendance(null);
    }
  };

  useEffect(() => {
    if (conferences.length > 0) {
      handleUrlHash();
    }
  }, [conferences]);

  useEffect(() => {
    window.addEventListener('hashchange', handleUrlHash);
    return () => window.removeEventListener('hashchange', handleUrlHash);
  }, [conferences]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 4000);
    setEmail('');
  };

  const handleOpenRegistration = (conf: ConferenceSummary) => {
    setSelectedConferenceForAttendance(null);
    setSelectedConferenceForReg(conf);
    window.location.hash = `#conferencias?inscripcion=${conf.idConferencia}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCalendar = () => {
    setSelectedConferenceForReg(null);
    setSelectedConferenceForAttendance(null);
    window.location.hash = '#conferencias';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadConferences();
  };

  const handleOpenAttendance = (conf: ConferenceSummary) => {
    setSelectedConferenceForReg(null);
    setSelectedConferenceForAttendance(conf);
    window.location.hash = `#conferencias?asistencia=${conf.idConferencia}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyShareLink = (conf: ConferenceSummary) => {
    const url = `${window.location.origin}${window.location.pathname}#conferencias?inscripcion=${conf.idConferencia}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(conf.idConferencia);
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  if (selectedConferenceForAttendance) {
    return (
      <div className="w-full pb-20 pt-6">
        <AttendanceLiveView
          conference={selectedConferenceForAttendance}
          onBackToCalendar={handleBackToCalendar}
        />
      </div>
    );
  }

  if (selectedConferenceForReg) {
    return (
      <div className="w-full pb-20 pt-6">
        <ConferenceRegistrationView
          conference={selectedConferenceForReg}
          onBackToCalendar={handleBackToCalendar}
        />
      </div>
    );
  }

  return (
    <div className="w-full pb-20">
      <main className="max-w-[1280px] mx-auto px-6 pt-6 sm:pt-8">
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

            {isLoading ? (
              <div className="p-12 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-xs gap-3">
                <Loader2 className="w-8 h-8 text-[#008744] animate-spin" />
                <p className="text-xs font-bold text-slate-600">Cargando agenda oficial ALFIN...</p>
              </div>
            ) : conferences.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <CalendarDays className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No hay conferencias programadas</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  En este momento no hay capacitaciones en cartelera. Revisa periódicamente o suscríbete al boletín para recibir avisos de nuevas fechas.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {conferences.map((conf) => {
                  const startDate = new Date(conf.fechaHoraInicio);
                  const endDate = new Date(conf.fechaHoraFin);
                  const dayStr = isNaN(startDate.getTime()) ? '15' : startDate.getDate().toString().padStart(2, '0');
                  const monthStr = isNaN(startDate.getTime()) 
                    ? 'NOV' 
                    : startDate.toLocaleDateString('es-PE', { month: 'short' }).toUpperCase();
                  const timeStr = `${startDate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`;

                  return (
                    <div 
                      key={conf.idConferencia}
                      className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all overflow-hidden flex flex-col sm:flex-row group"
                    >
                      <div className="bg-[#008744] text-white flex flex-col items-center justify-center p-6 min-w-[120px] shrink-0 font-display font-black shadow-inner">
                        <span className="text-3xl sm:text-4xl leading-none">{dayStr}</span>
                        <span className="text-xs uppercase tracking-widest font-extrabold mt-1">{monthStr}</span>
                        <span className="text-[10px] font-medium text-emerald-200 mt-1">
                          {conf.modalidad}
                        </span>
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-semibold">
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-[#008744]" />
                                {timeStr}
                              </span>
                              <span className="text-slate-300">•</span>
                              <span className="flex items-center gap-1.5">
                                {conf.modalidad === 'Virtual' ? (
                                  <Video className="w-3.5 h-3.5 text-[#008744]" />
                                ) : (
                                  <MapPin className="w-3.5 h-3.5 text-[#008744]" />
                                )}
                                {conf.modalidad === 'Virtual' ? 'Microsoft Teams URP' : 'Auditorio Principal FAMURP'}
                              </span>
                            </div>

                            {conf.asistenciaAbierta && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300 animate-pulse">
                                <Radio className="w-3 h-3 text-emerald-600" />
                                Asistencia Abierta
                              </span>
                            )}
                          </div>

                          <h3 className="text-base sm:text-lg font-display font-extrabold text-slate-900 mb-2 group-hover:text-[#008744] transition-colors">
                            {conf.tituloEvento}
                          </h3>

                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                            Ponente: <strong>{conf.expositorPonente}</strong> | Patrocinado por: <em>{conf.entidadEditorial}</em>
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleCopyShareLink(conf)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer text-xs font-semibold"
                              title="Copiar enlace de invitación"
                            >
                              {copiedId === conf.idConferencia ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-700 font-bold">Enlace copiado</span>
                                </>
                              ) : (
                                <>
                                  <Share2 className="w-3.5 h-3.5" />
                                  <span>Compartir</span>
                                </>
                              )}
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            {conf.asistenciaAbierta && (
                              <button 
                                onClick={() => handleOpenAttendance(conf)}
                                className="py-2 px-4 rounded-full border-2 border-emerald-700 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-urp-brutal-sm tactile-btn cursor-pointer flex items-center gap-1.5"
                              >
                                <Radio className="w-3.5 h-3.5" />
                                <span>Marcar Asistencia</span>
                              </button>
                            )}
                            <button 
                              onClick={() => handleOpenRegistration(conf)}
                              className="py-2 px-5 rounded-full border-2 border-slate-900 font-bold text-xs text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-urp-brutal-sm tactile-btn cursor-pointer"
                            >
                              Inscribirme
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <aside className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
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

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
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
