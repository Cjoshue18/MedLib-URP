export { DatabaseSearchBar } from './components/DatabaseSearchBar';
export { AdminMetricsGrid } from './components/admin/AdminMetricsGrid';
export { AdminResourceTable } from './components/admin/AdminResourceTable';
export { AdminResourceModal } from './components/admin/AdminResourceModal';
export type { ResourceFormData } from './components/admin/AdminResourceModal';

export { resourceService } from './services/resourceService';
export { getDatabaseLogoUrl } from './data/databasesData';
export type { MedicalDatabase } from './data/databasesData';

export type {
  ResourceApiDto,
  CreateResourceApiRequest,
  UpdateResourceApiRequest,
} from './types/resourceApiTypes';

export { mapApiResourceToMedicalDatabase } from './utils/resourceAdapter';
