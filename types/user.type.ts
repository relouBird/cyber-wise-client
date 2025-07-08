import type { RoleType } from "./constant.type";

export type LoginCredentialType = {
  email: string;
  password: string | null;
  remember?: boolean;
  guard: string;
};

export type RegisterCredentialType = {
  email: string;
  password: string;
  password_confirmation: string;
};

type UserIdentity = {
  identity_id: string;
  id: string;
  user_id: string;
  identity_data: {
    email: string;
    email_verified: boolean;
    phone_verified: boolean;
    sub: string;
  };
  provider: string;
  last_sign_in_at: string;
  created_at: string;
  updated_at: string;
  email: string;
};

type AppMetadata = {
  provider: string;
  providers: string[];
};

type UserMetaData = {
  email_verified: boolean;
  firstName: string;
  lastName: string;
  org_id?: string;
  role?: string;
  phone?: string;
  status: "Actif" | "Inactif";
  [key: string]: any; // Index signature pour permettre des propriétés supplémentaires
};

export type User = {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  phone: string;
  last_sign_in_at: string;
  app_metadata: AppMetadata;
  user_metadata: UserMetaData;
  identities: UserIdentity[];
  created_at: string;
  updated_at: string;
};

type Session = {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  refresh_token: string;
  user: User;
};

export type UserData = {
  user: User;
  session: Session;
};

export type UserType = RoleType | "enterprise";

export type UserResponse = {
  message: string;
  data: UserData;
  type: UserType;
};
