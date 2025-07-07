// types/sensibilisations

export interface Campaign {
  id: string;
  name: string;
  description: string;
  image: string | File | undefined;
  status: "draft" | "active" | "paused" | "completed";
  createdAt: Date;
  updatedAt: Date;
  startDate: Date;
  endDate?: Date;
  targetUsers: string[]; // IDs des utilisateurs ciblés
  formations: string[]; // IDs des formations incluses
  createdBy: string; // ID de l'admin créateur
  stats: {
    totalUsers: number;
    completedUsers: number;
    inProgressUsers: number;
    notStartedUsers: number;
    completionRate: number;
  };
}

export interface CampaignUser {
  id: string;
  avatar: string;
  firstName: string;
  lastName: string;
  campaignId: string;
  userId: string;
  status: "not_started" | "in_progress" | "completed";
  startedAt?: Date;
  completedAt?: Date;
  progress: number; // Pourcentage de completion
  currentFormationId?: string;
  completedFormations: string[];
  incidents: Incident[];
}

export interface Incident {
  id: string;
  campaignId: string;
  userId: string;
  type:
    | "phishing_clicked"
    | "password_weak"
    | "download_malware"
    | "social_engineering";
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  reportedAt: Date;
  resolved: boolean;
  resolvedAt?: Date;
  notes?: string;
}

export interface CampaignFormation {
  id: string;
  campaignId: string;
  formationId: string;
  order: number;
  required: boolean;
  completionRate: number;
}

export interface CampaignStats {
  totalCampaigns: number;
  activeCampaigns: number;
  completedCampaigns: number;
  totalParticipants: number;
  averageCompletionRate: number;
  totalIncidents: number;
  recentIncidents: Incident[];
}

export interface CreateCampaignData {
  name: string;
  description: string;
  image: File | string | undefined;
  org_id?: string;
  createdBy?: string;
  startDate: Date;
  endDate?: Date;
  targetUsers: string[];
  formations: string[];
}

export interface UpdateCampaignData extends Partial<CreateCampaignData> {
  id: string;
  status?: Campaign["status"];
}

export interface Formation {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string; // e.g. "2h30"
  status: "Active" | "Inactive" | "Archived";
  mandatory: boolean;
  creationDate: string; // or Date
  updateDate: string; // or Date
  creator: string; // ID or name of creator
  categories: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  resources: {
    type: "PDF" | "Video" | "Quiz" | "Link";
    title: string;
    url: string;
  }[];
  averageProgress?: number; // Average completion percentage
  totalParticipants?: number;
  completedParticipants?: number;
}


export interface CampaignResponse {
  message: string;
  data: Campaign;
}

export interface CampaignsResponse {
  message: string;
  data: Campaign[];
}