import React from 'react';
import { RefreshCw, Database, ShieldCheck, Globe, Smartphone, Video, Edit, Hexagon, Trash2 } from 'lucide-react';
import { ResourceApiDto } from '../../types/resourceApiTypes';
import { getDatabaseLogoUrl } from '../../data/databasesData';

interface AdminResourceTableProps {
  resources: ResourceApiDto[];
  totalResourcesCount: number;
  totalHexagonCount: number;
  isLoading: boolean;
  onEdit: (res: ResourceApiDto) => void;
  onDelete?: (res: ResourceApiDto) => void;
  onOpenMatrixModal?: () => void;
}

export const AdminResourceTable: React.FC<AdminResourceTableProps> = ({
  resources,
  totalResourcesCount,
  totalHexagonCount,
  isLoading,
  onEdit,
  onDelete,
  onOpenMatrixModal,
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

      {totalHexagonCount < 15 && (
        <div className="bg-amber-50 border-b border-amber-200 px-5 py-3 text-xs text-amber-900 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Hexagon className="w-4 h-4 fill-amber-400 text-amber-600 shrink-0" />
            <span>
              <strong>Configuración de Portada Incompleta:</strong> Se requieren exactamente <strong>15 bases de datos</strong> para la red molecular 3D de la portada. Actualmente hay <strong>{totalHexagonCount} de 15</strong> seleccionadas.
            </span>
          </div>
          {onOpenMatrixModal && (
            <button
              type="button"
              onClick={onOpenMatrixModal}
              className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs"
            >
              Configurar Matriz
            </button>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="p-12 text-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-[#008744] mx-auto" />
          <p className="text-sm font-semibold text-slate-700">Cargando catálogo de recursos...</p>
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
                <th className="py-3 px-4 text-center">Hexágonos Inicio</th>
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
                      {res.mostrarEnHexagonos ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300 select-none">
                          <Hexagon className="w-3 h-3 fill-amber-400 text-amber-600" />
                          <span>En Portada</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-50 text-slate-400 border border-slate-200 select-none">
                          <Hexagon className="w-3 h-3 text-slate-300" />
                          <span>Oculto</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {res.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 select-none">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          <span>Activo</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-300 select-none">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          <span>Inactivo</span>
                        </span>
                      )}
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
                        {onDelete && (
                          <button
                            type="button"
                            disabled={res.mostrarEnHexagonos || totalResourcesCount <= 15}
                            onClick={() => onDelete(res)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              res.mostrarEnHexagonos || totalResourcesCount <= 15
                                ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                                : 'border-slate-200 text-slate-600 hover:text-red-700 hover:border-red-300 hover:bg-red-50 cursor-pointer'
                            }`}
                            title={
                              res.mostrarEnHexagonos
                                ? 'No se puede eliminar: esta base de datos está asignada a la matriz hexagonal de inicio'
                                : totalResourcesCount <= 15
                                ? 'No se puede eliminar: se requiere un mínimo de 15 bases de datos en el sistema'
                                : 'Eliminar base de datos'
                            }
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
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
