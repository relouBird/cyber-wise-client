// Types
export type LevelType = "beginner" | "intermediate" | "advanced";

export interface Domain {
  id?: number;
  creator_id?: string;
  categorie: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface Course {
  id?: number;
  formation_id: number;
  level?: string;
  creator_id?: string;
  title: string;
  content: string;
  image?: string | File;
  order: number;
}

export interface Formation {
  id?: number;
  creator_id?: string;
  categorie: string;
  color?: string;
  level: LevelType;
  title: string;
  description: string;
  domainId: number;
  image?: File | string;
  active: boolean;
  courses?: Course[];
  created_at?: Date;
}

export interface FormationSub {
  id?: number;
  sub?: number;
  title: string;
  description: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: number;
  enrolledCount: number;
  progress: number;
  active: boolean;
  image?: string;
}

export interface IconOption {
  title: string;
  value: string;
}

export interface ColorOption {
  title: string;
  value: string;
}

export interface DomainsResponse {
  message: string;
  data: Domain[];
}

export interface DomainResponse {
  message: string;
  data: Domain;
}

export interface DomainDeleteResponse {
  message: string;
  data: Domain;
  formationListDeleted: Formation[];
}

export interface TrainingDeleteResponse {
  message: string;
  data: Formation;
  coursesListDeleted: Formation[];
}

export interface TrainingsResponse {
  message: string;
  data: Formation[];
}

export interface SubTrainingsResponse {
  message: string;
  data: FormationSub[];
}

export interface TrainingResponse {
  message: string;
  data: Formation;
}

export interface SubTrainingResponse {
  message: string;
  data: FormationSub;
}
