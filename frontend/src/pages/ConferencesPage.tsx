import React, { useState, useEffect } from 'react';
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
  CheckCircle2,
  Radio, 
  Share2, 
  Check,
  Loader2 
} from 'lucide-react';
import { 
  conferenceService, 
  ConferenceSummary, 
  ConferenceRegistrationModal, 
  AttendanceLiveModal 
} from '../features/conferences';

export const ConferencesPage: React.FC = () => {
  const [admissionsTab, setAdmissionsTab] = useState<'pregrado' | 'posgrado' | 'residentado'>('pregrado');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const [conferences, setConferences] = useState<ConferenceSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedConferenceForReg, setSelectedConferenceForReg] = useState<ConferenceSummary | null>(null);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);

  const [selectedConferenceForAttendance, setSelectedConferenceForAttendance] = useState<ConferenceSummary | null>(null);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);

  const [copiedId, setCopiedId] = useState<number | null>(null);

  const fallbackConferences: ConferenceSummary[] = [
    {
      idConferencia: 1,
      tituloEvento: 'Búsqueda Sistémica Avanzada en PubMed & Scopus',
      expositorPonente: 'Dra. Patricia Valenzuela (Elsevier Training)',
      entidadEditorial: 'Elsevier Clinical Solutions',
      fechaHoraInicio: new Date(Date.now() + 86400000 * 2).toISOString(),
      fechaHoraFin: new Date(Date.now() + 86400000 * 2 + 7200000).toISOString(),
      modalidad: 'Virtual',
      enlaceVirtual: 'https://teams.microsoft.com/l/meetup-join/famurp-alfin',
      asistenciaAbierta: true,
      estadoEvento: 'En Curso',
      autoPurgar30Dias: true,
      fechaCaducidadPurge: null,
      totalInscritos: 42,
      totalAsistentes: 38
    },
    {
      idConferencia: 2,
      tituloEvento: 'Gestores Bibliográficos: Mendeley & Zotero para Tesis Médica',
      expositorPonente: 'Lic. Francisca Valero',
      entidadEditorial: 'Biblioteca Central URP',
      fechaHoraInicio: new Date(Date.now() + 86400000 * 7).toISOString(),
      fechaHoraFin: new Date(Date.now() + 86400000 * 7 + 7200000).toISOString(),
      modalidad: 'Virtual',
      enlaceVirtual: 'https://teams.microsoft.com/l/meetup-join/famurp-alfin',
      asistenciaAbierta: false,
      estadoEvento: 'Programada',
      autoPurgar30Dias: true,
      fechaCaducidadPurge: null,
      totalInscritos: 29,
      totalAsistentes: 0
    },
    {
      idConferencia: 3,
      tituloEvento: 'Uso Clínico de DynaMedex y AccessMedicina en el Residentado',
      expositorPonente: 'Dr. Alberto Guzmán',
      entidadEditorial: 'McGraw-Hill Medical & EBSCO',
      fechaHoraInicio: new Date(Date.now() + 86400000 * 14).toISOString(),
      fechaHoraFin: new Date(Date.now() + 86400000 * 14 + 5400000).toISOString(),
      modalidad: 'Presencial',
      enlaceVirtual: null,
      asistenciaAbierta: false,
      estadoEvento: 'Programada',
      autoPurgar30Dias: true,
      fechaCaducidadPurge: null,
      totalInscritos: 18,
      totalAsistentes: 0
    }
  ];

  const loadConferences = async () => {
    setIsLoading(true);
    try {
      const data = await conferenceService.getConferences();
      if (data && data.length > 0) {
        setConferences(data);
      } else {
        setConferences(fallbackConferences);
      }
    } catch {
      setConferences(fallbackConferences);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConferences();
  }, []);

  useEffect(() => {
    const handleUrlHash = () => {
      const hash = window.location.hash;
      if (hash.includes('asistencia=')) {
        const idStr = hash.split('asistencia=')[1]?.split('&')[0];
        const id = parseInt(idStr, 10);
        if (id && conferences.length > 0) {
          const match = conferences.find(c => c.idConferencia === id);
          if (match) {
            setSelectedConferenceForAttendance(match);
            setIsAttendanceModalOpen(true);
          }
        }
      } else if (hash.includes('inscripcion=')) {
        const idStr = hash.split('inscripcion=')[1]?.split('&')[0];
        const id = parseInt(idStr, 10);
        if (id && conferences.length > 0) {
          const match = conferences.find(c => c.idConferencia === id);
          if (match) {
            setSelectedConferenceForReg(match);
            setIsRegModalOpen(true);
          }
        }
      }
    };

    if (conferences.length > 0) {
      handleUrlHash();
    }
  }, [conferences]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 4000);
    setEmail('');
  };

  const handleOpenRegistration = (conf: ConferenceSummary) => {
    setSelectedConferenceForReg(conf);
    setIsRegModalOpen(true);
  };

  const handleOpenAttendance = (conf: ConferenceSummary) => {
    setSelectedConferenceForAttendance(conf);
    setIsAttendanceModalOpen(true);
  };

  const handleCopyShareLink = (conf: ConferenceSummary) => {
    const url = `${window.location.origin}${window.location.pathname}#conferencias?inscripcion=${conf.idConferencia}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(conf.idConferencia);
      setTimeout(() => setCopiedId(null), 2500);
    });
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

            {isLoading ? (
              <div className="p-12 flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-slate-900 shadow-urp-brutal-sm gap-3">
                <Loader2 className="w-8 h-8 text-[#008744] animate-spin" />
                <p className="text-xs font-bold text-slate-600">Cargando agenda oficial ALFIN...</p>
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
                      className="bg-white rounded-2xl border-2 border-slate-900 shadow-urp-brutal-sm hover:translate-x-0.5 hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col sm:flex-row group"
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
                            <span className="text-xs px-3 py-1 rounded-full font-bold border bg-emerald-50 text-[#008744] border-emerald-200">
                              {conf.totalInscritos} {conf.totalInscritos === 1 ? 'Inscrito' : 'Inscritos'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyShareLink(conf)}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                              title="Copiar enlace de invitación"
                            >
                              {copiedId === conf.idConferencia ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Share2 className="w-3.5 h-3.5" />
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

      <ConferenceRegistrationModal
        conference={selectedConferenceForReg}
        isOpen={isRegModalOpen}
        onClose={() => setIsRegModalOpen(false)}
        onSuccess={() => loadConferences()}
      />

      <AttendanceLiveModal
        conference={selectedConferenceForAttendance}
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        onSuccess={() => loadConferences()}
      />
    </div>
  );
};
