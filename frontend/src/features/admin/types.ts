export type AdminTab = 'databases' | 'conferences' | 'statistics';

export interface AdminNavigationItem {
  id: AdminTab;
  label: string;
  sublabel: string;
  description: string;
}
