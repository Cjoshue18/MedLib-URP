export interface TutorialApiDto {
  id: number;
  youtubeVideoId: string;
  guidePdfUrl?: string | null;
}

export interface ResourceApiDto {
  id: number;
  name: string;
  logoUrl?: string | null;
  clinicalDescription?: string | null;
  isSubscription: boolean;
  hasMobileApp: boolean;
  externalUrl?: string | null;
  isActive: boolean;
  mostrarEnHexagonos: boolean;
  subjects: string[];
  tutorial?: TutorialApiDto | null;
}

export interface SubjectApiDto {
  id: number;
  name: string;
}

export interface CreateResourceApiRequest {
  name: string;
  logoUrl?: string | null;
  clinicalDescription?: string | null;
  isSubscription: boolean;
  hasMobileApp: boolean;
  externalUrl?: string | null;
  mostrarEnHexagonos?: boolean;
  subjects: string[];
  youtubeVideoId?: string | null;
  guidePdfUrl?: string | null;
}

export interface UpdateResourceApiRequest {
  name: string;
  logoUrl?: string | null;
  clinicalDescription?: string | null;
  isSubscription: boolean;
  hasMobileApp: boolean;
  externalUrl?: string | null;
  isActive: boolean;
  mostrarEnHexagonos?: boolean;
  subjects: string[];
  youtubeVideoId?: string | null;
  guidePdfUrl?: string | null;
}
