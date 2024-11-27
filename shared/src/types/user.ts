export interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "USER" | "GUEST";
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}
