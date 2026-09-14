import React from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { ConferenceSummary } from '../../types';


interface ConferenceMonthlyCalendarProps {
  viewDate: Date;
  conferences: ConferenceSummary[];
  canGoPrev: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export const ConferenceMonthlyCalendar: React.FC<ConferenceMonthlyCalendarProps> = ({
  viewDate,
  conferences,
  canGoPrev,
  onPrevMonth,
  onNextMonth,
}) => {
  const today = new Date();
  const calYear = viewDate.getFullYear();
  const calMonth = viewDate.getMonth();
  const calMonthName = viewDate.toLocaleDateString('es-PE', { month: 'long' }).toUpperCase();
  const calendarTitle = `${calMonthName} ${calYear}`;

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();
  const firstDayOffset = (firstDayOfWeek + 6) % 7;

  const prevMonthDaysCount = new Date(calYear, calMonth, 0).getDate();
  const prevDays: number[] = [];
  for (let i = firstDayOffset - 1; i >= 0; i--) {
    prevDays.push(prevMonthDaysCount - i);
  }

  const currentMonthDays: number[] = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const totalCells = prevDays.length + currentMonthDays.length;
  const nextDaysCount = (7 - (totalCells % 7)) % 7;
  const nextDays: number[] = Array.from({ length: nextDaysCount }, (_, i) => i + 1);

  const daysWithConferences = new Set<number>();
  conferences.forEach((c) => {
    const confDate = new Date(c.fechaHoraInicio);
    if (confDate.getFullYear() === calYear && confDate.getMonth() === calMonth) {
      daysWithConferences.add(confDate.getDate());
    }
  });

  const isCurrentCalendarMonth = today.getFullYear() === calYear && today.getMonth() === calMonth;
  const todayDayNumber = isCurrentCalendarMonth ? today.getDate() : -1;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
      <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-[#008744]" />
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
            {calendarTitle}
          </h3>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onPrevMonth}
            disabled={!canGoPrev}
            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 text-slate-700 cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title={canGoPrev ? 'Mes anterior' : 'Límite: máximo 1 mes atrás'}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 text-slate-700 cursor-pointer transition-colors"
            title="Mes siguiente"
          >
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
        {prevDays.map((d) => (
          <div key={`prev-${d}`} className="py-2 text-slate-300 select-none flex items-center justify-center">
            {d}
          </div>
        ))}
        {currentMonthDays.map((d) => {
          const hasConf = daysWithConferences.has(d);
          const isToday = d === todayDayNumber;

          let styleClasses =
            'py-2 rounded-lg text-xs font-semibold flex items-center justify-center cursor-default transition-colors';
          if (hasConf) {
            styleClasses += ' bg-[#008744] text-white font-black shadow-sm';
          } else if (isToday) {
            styleClasses += ' border border-[#008744] text-[#008744] font-bold';
          } else {
            styleClasses += ' text-slate-700 hover:bg-slate-100/60';
          }

          return (
            <div key={`cur-${d}`} className={styleClasses}>
              {d}
            </div>
          );
        })}
        {nextDays.map((d) => (
          <div key={`next-${d}`} className="py-2 text-slate-300 select-none flex items-center justify-center">
            {d}
          </div>
        ))}
      </div>
    </div>
  );
};
