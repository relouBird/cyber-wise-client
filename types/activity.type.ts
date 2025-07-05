export interface ActivityType {
  id?: number;
  org_id: string;
  activity_id: string;
  type: string;
  title: string;
  message: string;
  created_at?: string;
}

export interface ActivitiesResponse {
  message: string;
  data: ActivityType[];
}
