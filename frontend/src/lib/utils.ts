import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const getRoleColor = (role: string) => {
  switch (role.toUpperCase()) {
    case "ADMIN":
      return {
        bg: "bg-indigo-50",
        text: "text-indigo-800",
        border: "border-indigo-300",
        cardBg: "bg-gradient-to-br from-indigo-100 to-white",
        buttonBg:
          "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700",
      };
    case "MANAGER":
      return {
        bg: "bg-emerald-50",
        text: "text-emerald-800",
        border: "border-emerald-300",
        cardBg: "bg-gradient-to-br from-emerald-100 to-white",
        buttonBg:
          "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700",
      };
    case "USER":
    default:
      return {
        bg: "bg-sky-50",
        text: "text-sky-800",
        border: "border-sky-300",
        cardBg: "bg-gradient-to-br from-sky-100 to-white",
        buttonBg:
          "bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700",
      };
  }
};

export const getInitials = (name: string) => {
  const parts = name.split(" ");
  if (parts.length === 1) {
    return name.slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
