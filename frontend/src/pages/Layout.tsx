import { Outlet } from "react-router-dom";
import Sidebar from "@/components/ui/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { cn, getRoleColor } from "@/lib/utils";

export default function Layout() {
  const { user: sessionUser } = useAuth();
  const BASE_COLORS = sessionUser
    ? getRoleColor(sessionUser.role)
    : getRoleColor("USER");

  const roleColors = {
    bg: BASE_COLORS.bg,
    text: BASE_COLORS.text,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-full">
        <Sidebar />
        <main
          className={cn(
            "flex-1 overflow-auto p-4",
            roleColors.bg,
            "bg-opacity-50"
          )}
        >
          <header className="lg:hidden mb-6 pt-14">
            <h1 className={cn("text-xl font-bold", roleColors.text)}>
              Task App
            </h1>
          </header>

          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
