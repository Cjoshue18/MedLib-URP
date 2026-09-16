import React from 'react';
import { Search, RefreshCw, AlertCircle, Copy, Trash2, Check } from 'lucide-react';
import { SubscriberItem } from '../services/newsletterService';
import { AcademicLevelFilter, ACADEMIC_LEVEL_FILTERS, getAcademicLevelBadgeClass } from '../../../types/academicLevel';
import { formatDate } from '../../../utils/dateFormatter';
import { Pagination } from '../../../components/common/Pagination';

interface AdminNewsletterTableProps {
  subscribers: SubscriberItem[];
  filteredSubscribers: SubscriberItem[];
  paginatedSubscribers: SubscriberItem[];
  isLoading: boolean;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  selectedLevel: AcademicLevelFilter;
  onSelectedLevelChange: (lvl: AcademicLevelFilter) => void;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  copiedEmail: string | null;
  isDeleting: number | null;
  onCopySingleEmail: (email: string) => void;
  onDeleteSubscriber: (id: number, email: string) => void;
}

export const AdminNewsletterTable: React.FC<AdminNewsletterTableProps> = ({
  subscribers,
  filteredSubscribers,
  paginatedSubscribers,
  isLoading,
  searchTerm,
  onSearchTermChange,
  selectedLevel,
  onSelectedLevelChange,
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  copiedEmail,
  isDeleting,
  onCopySingleEmail,
  onDeleteSubscriber,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            placeholder="Buscar por correo institucional..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#008744]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {ACADEMIC_LEVEL_FILTERS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => onSelectedLevelChange(level)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedLevel === level
                  ? 'bg-[#008744] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {level === 'todos' ? 'Todos' : level}
              <span className="ml-1.5 opacity-75">
                (
                {level === 'todos'
                  ? subscribers.length
                  : subscribers.filter((s) => s.nivelAcademico === level).length}
                )
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4 w-12 text-center">#</th>
              <th className="py-3 px-4">Correo Institucional</th>
              <th className="py-3 px-4">Nivel Académico</th>
              <th className="py-3 px-4">Fecha Suscripción</th>
              <th className="py-3 px-4 text-center">Estado</th>
              <th className="py-3 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#008744] mb-2" />
                  <span>Cargando suscriptores del boletín...</span>
                </td>
              </tr>
            ) : filteredSubscribers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500">
                  <AlertCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="font-bold text-slate-700">No se encontraron suscriptores</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {searchTerm
                      ? 'Ningún correo coincide con los términos de búsqueda.'
                      : 'Aún no hay correos registrados en esta categoría.'}
                  </p>
                </td>
              </tr>
            ) : (
              paginatedSubscribers.map((sub, index) => (
                <tr key={sub.idSuscriptor} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 text-center font-bold text-slate-400">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold flex items-center justify-center text-[10px] shrink-0">
                        {sub.correoInstitucional.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-bold text-slate-900 select-all">
                        {sub.correoInstitucional}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${getAcademicLevelBadgeClass(
                        sub.nivelAcademico
                      )}`}
                    >
                      {sub.nivelAcademico}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-medium">
                    {formatDate(sub.fechaSuscripcion)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Activo
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onCopySingleEmail(sub.correoInstitucional)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#008744] hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Copiar correo"
                      >
                        {copiedEmail === sub.correoInstitucional ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteSubscriber(sub.idSuscriptor, sub.correoInstitucional)}
                        disabled={isDeleting === sub.idSuscriptor}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                        title="Eliminar de la lista"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-200 bg-slate-50/40">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredSubscribers.length}
            itemsPerPage={itemsPerPage}
            itemName="correos"
            className="flex flex-col sm:flex-row items-center justify-between gap-3"
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};
