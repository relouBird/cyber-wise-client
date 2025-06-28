export interface Stats {
  users: number;
  formations: number;
  sensibilisations: number;
  incidents: number;
}

export interface Statistics {
  title: string;
  number: number;
  icon: string;
  color: string;
}

export interface Actions {
  title: string;
  color: string;
  to: string;
  icon: string;
}

export interface Activity {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  time: string;
}
