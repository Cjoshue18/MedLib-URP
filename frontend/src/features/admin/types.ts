export type AdminTab = 'databases' | 'lost-found' | 'conferences' | 'statistics' | 'newsletter';

export interface AdminNavigationItem {
  id: AdminTab;
  label: string;
  sublabel: string;
  description: string;
}
