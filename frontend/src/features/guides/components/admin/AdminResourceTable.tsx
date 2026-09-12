import React from 'react';
import { RefreshCw, Database, ShieldCheck, Globe, Smartphone, Video, Edit } from 'lucide-react';
import { ResourceApiDto } from '../../types/resourceApiTypes';
import { getDatabaseLogoUrl } from '../../data/databasesData';

interface AdminResourceTableProps {
  resources: ResourceApiDto[];
  totalResourcesCount: number;
  isLoading: boolean;
  togglingId: number | null;
  onEdit: (res: ResourceApiDto) => void;
  onToggleActive: (res: ResourceApiDto) => void;
}

export const AdminResourceTable: React.FC<AdminResourceTableProps> = ({
  resources,
  totalResourcesCount,
  isLoading,
  togglingId,
  onEdit,
  onToggleActive,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold font-display text-slate-900">
            Catálogo de Bases de Datos Biomédicas
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mostrando {resources.length} de {totalResourcesCount} recursos administrados
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-[#008744] mx-auto" />
          <p className="text-sm font-semibold text-slate-700">Cargando registros desde Neon PostgreSQL...</p>
        </div>
      ) : resources.length === 0 ? (
        <div className="p-12 text-center text-slate-500 space-y-2">
          <Database className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-bold text-slate-800">No se encontraron bases de datos</p>
          <p className="text-xs text-slate-500">Pruebe ajustando los filtros de búsqueda o registre una nueva base.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4 w-14">Logo</th>
                <th className="py-3 px-4">Recurso</th>
                <th className="py-3 px-4">Licencia</th>
                <th className="py-3 px-4">Materias</th>
                <th className="py-3 px-4 text-center">App</th>
                <th className="py-3 px-4 text-center">Tutorial</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {resources.map((res) => {
                const logoSrc = getDatabaseLogoUrl(res.logoUrl || undefined);
                return (
                  <tr key={res.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-9 h-9 rounded-lg border border-slate-200 bg-white p-1 flex items-center justify-center overflow-hidden">
                        {logoSrc ? (
                          <img
                            src={logoSrc}
                            alt={res.name}
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.style.display = 'none';
                              if (target.parentElement) {
                                target.parentElement.innerHTML = '<span class="text-[9px] font-bold text-slate-400">MED</span>';
                              }
                            }}
                          />
                        ) : (
                          <span className="text-[9px] font-bold text-slate-400">MED</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 text-sm leading-snug">{res.name}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {res.clinicalDescription || 'Sin descripción clínica registrada.'}
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {res.isSubscription ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <ShieldCheck className="w-3 h-3" />
                          Suscripción URP
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                          <Globe className="w-3 h-3" />
                          Acceso Abierto
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {(res.subjects || []).slice(0, 3).map((sub, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200"
                          >
                            {sub}
                          </span>
                        ))}
                        {(res.subjects || []).length > 3 && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-bold">
                            +{res.subjects.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {res.hasMobileApp ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold text-[10px] border border-purple-200">
                          <Smartphone className="w-2.5 h-2.5" />
                          Sí
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">&mdash;</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {res.tutorial?.youtubeVideoId ? (
                        <a
                          href={`https://www.youtube.com/watch?v=${res.tutorial.youtubeVideoId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 text-red-700 hover:bg-red-100 font-bold text-[10px] border border-red-200 transition-colors"
                        >
                          <Video className="w-2.5 h-2.5" />
                          {res.tutorial.youtubeVideoId}
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[11px]">&mdash;</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        disabled={togglingId === res.id}
                        onClick={() => onToggleActive(res)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors cursor-pointer ${
                          res.isActive
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            res.isActive ? 'bg-emerald-600' : 'bg-slate-400'
                          }`}
                        ></span>
                        <span>{res.isActive ? 'Activo' : 'Inactivo'}</span>
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEdit(res)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-[#008744] hover:border-[#008744] hover:bg-emerald-50 transition-colors cursor-pointer"
                          title="Editar base de datos"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
