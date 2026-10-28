import React, { useState, useEffect } from 'react';
import {
  LIBRARY_SCHEDULE_DAYS,
  getLibraryStatus,
} from '../utils/libraryScheduleUtils';

interface BentoScheduleCardProps {
  className?: string;
}

export const BentoScheduleCard: React.FC<BentoScheduleCardProps> = ({ className = '' }) => {
  const [status, setStatus] = useState(() => getLibraryStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getLibraryStatus());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`col-span-1 md:col-span-1 lg:col-span-2 lg:row-span-1 lg:col-start-1 lg:row-start-3 rounded-lg bg-[#008744] overflow-hidden shadow-sm flex flex-col justify-between transition-colors duration-300 min-h-[280px] lg:min-h-[310px] ${className}`}
    >
      {status.isOpen ? (
        <div className="w-full px-5 py-3 bg-[#8CF9A9] text-[#0F172A] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#008744] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#008744]"></span>
            </span>
            <span className="font-display text-xs font-black uppercase tracking-wider text-[#0F172A]">
              Horario de Atención
            </span>
          </div>
          <span className="text-[11px] font-black px-2.5 py-0.5 rounded-none bg-white text-[#0F172A] shadow-xs">
            ABIERTO
          </span>
        </div>
      ) : (
        <div className="w-full px-5 py-3 bg-slate-950 text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
            <span className="font-display text-xs font-black uppercase tracking-wider text-slate-300">
              Horario de Atención
            </span>
          </div>
          <span className="text-[11px] font-black px-2.5 py-0.5 rounded-none bg-slate-800 text-slate-300 shadow-xs border border-[#0F172A]">
            CERRADO
          </span>
        </div>
      )}

      <div className="p-4 sm:p-5 space-y-1.5 text-xs">
        {LIBRARY_SCHEDULE_DAYS.map((schedule, index) => {
          const isToday = index === status.currentDayIndex;

          if (isToday) {
            return (
              <div
                key={schedule.dayName}
                className="flex items-center justify-between py-1.5 px-3 rounded-none bg-[#00A859] text-white"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white">{schedule.dayName}</span>
                  <span className="text-[#8CF9A9] text-[10px] font-black uppercase">
                    (Hoy)
                  </span>
                </div>
                <span className="font-extrabold text-[#8CF9A9]">
                  {schedule.isSunday ? 'CERRADO' : schedule.hours}
                </span>
              </div>
            );
          }

          if (schedule.isSunday) {
            return (
              <div
                key={schedule.dayName}
                className="flex items-center justify-between py-1.5 px-3 rounded-none bg-[#020617]/20 text-white/50"
              >
                <span className="font-medium">{schedule.dayName}</span>
                <span className="font-bold text-white/60 uppercase text-[10px]">
                  CERRADO
                </span>
              </div>
            );
          }

          return (
            <div
              key={schedule.dayName}
              className="flex items-center justify-between py-1.5 px-3 rounded-none bg-white/10 text-white"
            >
              <span className="font-medium text-white/90">{schedule.dayName}</span>
              <span className="font-extrabold text-white">{schedule.hours}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
