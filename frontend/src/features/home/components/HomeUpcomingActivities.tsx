import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';

interface HomeUpcomingActivitiesProps {
  onNavigate: (view: 'conferences') => void;
}

const activities = [
  {
    day: '15',
    month: 'NOV',
    title: 'Capacitación: Uso avanzado de ClinicalKey',
    time: '10:00 AM - 12:00 PM',
  },
  {
    day: '22',
    month: 'NOV',
    title: 'Taller: Búsqueda bibliográfica en Scopus & PubMed',
    time: '03:00 PM - 05:00 PM',
  },
  {
    day: '29',
    month: 'NOV',
    title: 'Sesión ALFIN: Gestores de Referencias Zotero & Mendeley',
    time: '11:00 AM - 01:00 PM',
  },
];

export const HomeUpcomingActivities: React.FC<HomeUpcomingActivitiesProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-urp-brutal p-6 sm:p-7 flex flex-col justify-between">
      <div>
        <h3 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 mb-1">
          Próximas Actividades
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Conferencias y capacitaciones ALFIN programadas.
        </p>

        <div className="space-y-4">
          {activities.map((act, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <div className="w-4/5 mx-auto border-t border-slate-200/60"></div>}
              <div
                onClick={() => onNavigate('conferences')}
                className="flex items-center gap-4 cursor-pointer group py-1"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 aspect-square rounded-2xl bg-[#008744] text-white flex flex-col items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <span className="text-xl sm:text-2xl font-display font-black leading-none">{act.day}</span>
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mt-0.5">{act.month}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug group-hover:text-[#008744] transition-colors line-clamp-2">
                    {act.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{act.time}</span>
                  </p>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
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
