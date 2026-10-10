import React from 'react';
import { ConferenceSummary } from '../../types';
import { MONTH_NAMES_ES, formatShortDate } from '../../../../utils/dateFormatter';

interface ConferenceReportFilterBarProps {
  selectedMonth: number;
  onMonthChange: (m: number) => void;
  selectedYear: number;
  onYearChange: (y: number) => void;
  availableYears: number[];
  selectedConferenceId: number | null;
  onConferenceIdChange: (id: number) => void;
  filteredConferences: ConferenceSummary[];
  isLoadingConferences: boolean;
}

export const ConferenceReportFilterBar: React.FC<ConferenceReportFilterBarProps> = ({
  selectedMonth,
  onMonthChange,
  selectedYear,
  onYearChange,
  availableYears,
  selectedConferenceId,
  onConferenceIdChange,
  filteredConferences,
  isLoadingConferences,
}) => {
  return (
    <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 flex-1">
        <div>
          <label className="text-xs font-extrabold text-slate-700 block mb-1.5">
            Mes:
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(parseInt(e.target.value, 10))}
            disabled={isLoadingConferences}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#008744] cursor-pointer"
          >
            {MONTH_NAMES_ES.map((name, idx) => (
              <option key={idx} value={idx}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-extrabold text-slate-700 block mb-1.5">
            Año:
          </label>
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(parseInt(e.target.value, 10))}
            disabled={isLoadingConferences}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#008744] cursor-pointer"
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-extrabold text-slate-700 block mb-1.5">
            Seleccionar Conferencia Médica a Auditar:
          </label>
          <select
            value={selectedConferenceId || ''}
            onChange={(e) => onConferenceIdChange(parseInt(e.target.value, 10))}
            disabled={isLoadingConferences || filteredConferences.length === 0}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#008744] cursor-pointer disabled:opacity-50"
          >
            {filteredConferences.length === 0 ? (
              <option value="">
                Sin conferencias en este mes ({MONTH_NAMES_ES[selectedMonth]} {selectedYear})
              </option>
            ) : (
              filteredConferences.map((c) => (
                <option key={c.idConferencia} value={c.idConferencia}>
                  {formatShortDate(c.fechaHoraInicio)} - {c.tituloEvento} ({c.entidadEditorial})
                </option>
              ))
            )}
          </select>
        </div>
      </div>
    </div>
  );
};
