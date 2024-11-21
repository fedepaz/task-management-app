export interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "USER" | "GUEST";
  createdAt: Date;
  updatedAt: Date;
}
