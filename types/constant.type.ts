export interface ConfigurationInterface {
  title: string;
  option: string;
  image?: string;
}

export interface MenuItem {
  title: string;
  icon: string;
  to?: string;
  badge?: {
    text: string;
    color: string;
  };
  children?: MenuItem[]; // Ajout pour les sous-menus
  expanded?: boolean; // Pour gérer l'état d'expansion
}

export type RoleType = "Manager" | "Employé" | "Invité";

export interface UserProps {
  id?: number;
  org_id: string | number;
  firstName: string;
  lastName: string;
  email: string;
  role: RoleType;
  phone: string;
  status: "Actif" | "Inactif";
  lastLogin?: string;
  avatar?: string;
}

export interface UserResponseProps {
  message: string;
  data: UserProps;
}

export interface UsersResponseProps {
  message: string;
  data: UserProps[];
}
