import React, { useState, useEffect } from 'react';
import { Clock, ArrowRight, Loader2 } from 'lucide-react';
import { conferenceService, ConferenceSummary } from '../../conferences';

interface HomeUpcomingActivitiesProps {
  onNavigate: (view: 'conferences', query?: string) => void;
}

export const HomeUpcomingActivities: React.FC<HomeUpcomingActivitiesProps> = ({ onNavigate }) => {
  const [conferences, setConferences] = useState<ConferenceSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await conferenceService.getConferences();
        if (isMounted) {
          setConferences(data || []);
        }
      } catch {
        if (isMounted) {
          setConferences([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const displayedActivities = conferences.slice(0, 3);

  const handleConferenceClick = (idConferencia: number) => {
    onNavigate('conferences', `inscripcion=${idConferencia}`);
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-urp-brutal p-6 sm:p-7 flex flex-col justify-between">
      <div>
        <h3 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 mb-1">
          Próximas Actividades
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Conferencias y capacitaciones ALFIN programadas.
        </p>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-7 h-7 text-[#008744] animate-spin" />
            <p className="text-xs font-semibold text-slate-500">Cargando actividades...</p>
          </div>
        ) : displayedActivities.length === 0 ? (
          <div className="py-10 text-center flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-1">
              <Clock className="w-6 h-6" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-600">
              No hay conferencias próximas por ahora
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedActivities.map((act, idx) => {
              const startDate = new Date(act.fechaHoraInicio);
              const endDate = new Date(act.fechaHoraFin);
              const dayStr = isNaN(startDate.getTime()) ? '15' : startDate.getDate().toString().padStart(2, '0');
              const monthStr = isNaN(startDate.getTime()) 
                ? 'NOV' 
                : startDate.toLocaleDateString('es-PE', { month: 'short' }).toUpperCase().replace('.', '');
              const timeStr = `${startDate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`;

              return (
                <React.Fragment key={act.idConferencia}>
                  {idx > 0 && <div className="w-4/5 mx-auto border-t border-slate-200/60"></div>}
                  <div
                    onClick={() => handleConferenceClick(act.idConferencia)}
                    className="flex items-center gap-4 cursor-pointer group py-1"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 aspect-square rounded-2xl bg-[#008744] text-white flex flex-col items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      <span className="text-xl sm:text-2xl font-display font-black leading-none">{dayStr}</span>
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mt-0.5">{monthStr}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug group-hover:text-[#008744] transition-colors line-clamp-2">
                        {act.tituloEvento}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{timeStr}</span>
                      </p>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>

      <div className="pt-6 mt-4">
        <button
          type="button"
          onClick={() => onNavigate('conferences')}
          className="w-full py-3 px-4 rounded-full border-2 border-slate-900 hover:bg-slate-50 font-bold text-xs text-slate-900 shadow-urp-brutal-sm tactile-btn flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Ver Calendario Completo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
