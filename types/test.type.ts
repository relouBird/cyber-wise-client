export type UserDescription = {
  id: number;
  name: string;
  description: string;
  created_at: string; // ou `Date` si tu veux le convertir plus tard
  image ?: string;
};
