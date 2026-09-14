import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { resourceService } from '../../services/resourceService';
import {
  ResourceApiDto,
  CreateResourceApiRequest,
  UpdateResourceApiRequest,
} from '../../types/resourceApiTypes';
import { AdminMetricsGrid } from './AdminMetricsGrid';
import { DatabaseSearchBar } from '../DatabaseSearchBar';
import { AdminResourceTable } from './AdminResourceTable';
import { AdminResourceModal, ResourceFormData } from './AdminResourceModal';
import { HexagonMatrixModal } from './HexagonMatrixModal';

interface AdminDatabasesTabProps {
  onShowFeedback: (message: string) => void;
  isMatrixModalOpen: boolean;
  onOpenMatrixModal: () => void;
  onCloseMatrixModal: () => void;
  onHexagonCountChange?: (count: number) => void;
}

export const AdminDatabasesTab: React.FC<AdminDatabasesTabProps> = ({
  onShowFeedback,
  isMatrixModalOpen,
  onOpenMatrixModal,
  onCloseMatrixModal,
  onHexagonCountChange,
}) => {
  const [resources, setResources] = useState<ResourceApiDto[]>([]);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [licenseFilter, setLicenseFilter] = useState<'all' | 'subscription' | 'open'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResourceData, setEditingResourceData] = useState<ResourceFormData | null>(null);

  const loadResources = async () => {
    setIsLoadingResources(true);
    try {
      const data = await resourceService.getAdminResources();
      setResources(data);
    } catch {
      setResources([]);
    } finally {
      setIsLoadingResources(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  useEffect(() => {
    const hexagonCount = resources.filter((r) => r.mostrarEnHexagonos).length;
    onHexagonCountChange?.(hexagonCount);
  }, [resources, onHexagonCountChange]);

  const handleOpenCreateModal = () => {
    setEditingResourceData(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (res: ResourceApiDto) => {
    setEditingResourceData({
      id: res.id,
      name: res.name,
      logoUrl: res.logoUrl || '',
      clinicalDescription: res.clinicalDescription || '',
      isSubscription: res.isSubscription,
      hasMobileApp: res.hasMobileApp,
      externalUrl: res.externalUrl || '',
      isActive: res.isActive,
      mostrarEnHexagonos: res.mostrarEnHexagonos,
      subjectsStr: (res.subjects || []).join(', '),
      youtubeVideoId: res.tutorial?.youtubeVideoId || '',
      videoTitle: res.tutorial?.videoTitle || '',
      guidePdfUrl: res.tutorial?.guidePdfUrl || '',
    });
    setIsModalOpen(true);
  };

  const totalCount = resources.length;
  const subscriptionCount = resources.filter((r) => r.isSubscription).length;
  const openAccessCount = resources.filter((r) => !r.isSubscription).length;
  const activeCount = resources.filter((r) => r.isActive).length;

  const handleSaveResource = async (formData: ResourceFormData) => {
    const parsedSubjects = formData.subjectsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (formData.id) {
      const existing = resources.find((r) => r.id === formData.id);
      if (existing?.mostrarEnHexagonos && !formData.isActive) {
        onShowFeedback(
          `No se puede inactivar "${formData.name}": forma parte de la matriz hexagonal. Reemplázala en la matriz antes de inactivarla.`
        );
        return;
      }

      if (existing?.isActive && !formData.isActive && activeCount <= 15) {
        onShowFeedback(
          'No se puede inactivar: deben mantenerse al menos 15 bases de datos activas en el catálogo.'
        );
        return;
      }

      const updateReq: UpdateResourceApiRequest = {
        name: formData.name.trim(),
        logoUrl: formData.logoUrl.trim() || null,
        clinicalDescription: formData.clinicalDescription.trim() || null,
        isSubscription: formData.isSubscription,
        hasMobileApp: formData.hasMobileApp,
        externalUrl: formData.externalUrl.trim() || null,
        isActive: formData.isActive,
        mostrarEnHexagonos: existing ? existing.mostrarEnHexagonos : false,
        subjects: parsedSubjects,
        youtubeVideoId: formData.youtubeVideoId.trim() || null,
        videoTitle: formData.videoTitle.trim() || null,
        guidePdfUrl: formData.guidePdfUrl.trim() || null,
      };
      await resourceService.updateResource(formData.id, updateReq);
      onShowFeedback(`Recurso "${formData.name}" actualizado con éxito.`);
    } else {
      const createReq: CreateResourceApiRequest = {
        name: formData.name.trim(),
        logoUrl: formData.logoUrl.trim() || null,
        clinicalDescription: formData.clinicalDescription.trim() || null,
        isSubscription: formData.isSubscription,
        hasMobileApp: formData.hasMobileApp,
        externalUrl: formData.externalUrl.trim() || null,
        mostrarEnHexagonos: false,
        subjects: parsedSubjects,
        youtubeVideoId: formData.youtubeVideoId.trim() || null,
        videoTitle: formData.videoTitle.trim() || null,
        guidePdfUrl: formData.guidePdfUrl.trim() || null,
      };
      await resourceService.createResource(createReq);
      onShowFeedback(`Recurso "${formData.name}" registrado correctamente.`);
    }

    await loadResources();
  };

  const handleDeleteResource = async (res: ResourceApiDto) => {
    if (res.mostrarEnHexagonos) {
      onShowFeedback(`No se puede eliminar "${res.name}": está asignada a la matriz hexagonal de inicio.`);
      return;
    }

    if (resources.length <= 15) {
      onShowFeedback('No se puede eliminar: el sistema debe mantener un mínimo de 15 bases de datos registradas.');
      return;
    }

    const confirmed = window.confirm(
      `¿Confirmas que deseas eliminar la base de datos "${res.name}"? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    try {
      await resourceService.deleteResource(res.id);
      setResources((prev) => prev.filter((r) => r.id !== res.id));
      onShowFeedback(`Base de datos "${res.name}" eliminada correctamente.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar la base de datos.';
      onShowFeedback(msg);
    }
  };

  const handleSaveHexagonMatrix = async (selectedIds: number[]) => {
    if (selectedIds.length !== 15) {
      onShowFeedback('Error: Se deben seleccionar exactamente 15 bases de datos para la matriz.');
      return;
    }

    try {
      const updatedList = await resourceService.setHexagonMatrix(selectedIds);
      setResources(updatedList);
      onCloseMatrixModal();
      onShowFeedback('Matriz hexagonal sincronizada con éxito (15 bases asignadas a portada).');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar la matriz hexagonal.';
      onShowFeedback(msg);
    }
  };

  const filteredResources = resources.filter((res) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      res.name.toLowerCase().includes(q) ||
      (res.clinicalDescription && res.clinicalDescription.toLowerCase().includes(q)) ||
      (res.subjects && res.subjects.some((s) => s.toLowerCase().includes(q)));

    const matchesLicense =
      licenseFilter === 'all' ||
      (licenseFilter === 'subscription' && res.isSubscription) ||
      (licenseFilter === 'open' && !res.isSubscription);

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && res.isActive) ||
      (statusFilter === 'inactive' && !res.isActive);

    return matchesSearch && matchesLicense && matchesStatus;
  });

  return (
    <>
      <AdminMetricsGrid
        totalCount={totalCount}
        subscriptionCount={subscriptionCount}
        openAccessCount={openAccessCount}
        activeCount={activeCount}
      />

      <DatabaseSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Buscar base de datos, materia, editorial..."
        licenseFilter={licenseFilter}
        onLicenseFilterChange={setLicenseFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        actionsRight={
          <>
            <button
              type="button"
              onClick={loadResources}
              disabled={isLoadingResources}
              className="p-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Refrescar catálogo"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingResources ? 'animate-spin' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-display font-bold text-xs text-white bg-[#008744] hover:bg-[#00572B] transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Base de Datos</span>
            </button>
          </>
        }
      />

      <AdminResourceTable
        resources={filteredResources}
        totalResourcesCount={resources.length}
        totalHexagonCount={resources.filter((r) => r.mostrarEnHexagonos).length}
        isLoading={isLoadingResources}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteResource}
        onOpenMatrixModal={onOpenMatrixModal}
      />

      <AdminResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveResource}
        initialData={editingResourceData}
        activeResourcesCount={activeCount}
        existingSubjects={Array.from(new Set(resources.flatMap((r) => r.subjects || [])))}
      />

      <HexagonMatrixModal
        isOpen={isMatrixModalOpen}
        onClose={onCloseMatrixModal}
        resources={resources}
        onSave={handleSaveHexagonMatrix}
      />
    </>
  );
};
