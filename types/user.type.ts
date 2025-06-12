export type LoginCredentialType = {
  identifier: string;
  password: string | null;
  remember?: boolean;
  guard: string;
};

export type RegisterCredentialType = {
  email: string;
  password: string;
  password_confirmation: string;
};
