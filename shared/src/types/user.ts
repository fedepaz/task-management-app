export interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "USER" | "MANAGER";
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}
