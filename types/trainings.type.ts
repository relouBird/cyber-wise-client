// Types
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
  id: number;
  title: string;
  content: string;
  image?: string;
  order: number;
}

export interface Formation {
  id?: number;
  creator_id?: string;
  categorie: string;
  color?: string;
  title: string;
  description: string;
  domainId: number;
  image?: File | string;
  active: boolean;
  courses?: Course[];
  created_at?: Date;
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

export interface TrainingsResponse {
  message: string;
  data: Formation[];
}

export interface TrainingResponse {
  message: string;
  data: Formation;
}
