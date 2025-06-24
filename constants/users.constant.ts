import type { RoleType, UserProps } from "~/types/constant.type";

export const usersPrototype: UserProps[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    role: "Manager",
    phone: "+33 1 23 45 67 89",
    status: "Actif",
    lastLogin: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    role: "Manager",
    phone: "+33 1 23 45 67 90",
    status: "Actif",
    lastLogin: "2024-01-14T14:20:00Z",
  },
  {
    id: 3,
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob.johnson@example.com",
    role: "Employé",
    phone: "+33 1 23 45 67 91",
    status: "Inactif",
    lastLogin: "2024-01-10T09:15:00Z",
  },
];

export const usersRole: RoleType[] = ["Employé", "Manager", "Invité"];
