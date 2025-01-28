import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckSquare, Calendar, User, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmationDialog } from "../common/ConfirmationDialog";
import { useAuth } from "@/hooks/useAuth";
import { cn, getRoleColor } from "@/lib/utils";

const navItems = [
  { path: "/", icon: CheckSquare, label: "Tasks" },
  { path: "/calendar", icon: Calendar, label: "Calendar" },
  { path: "/profile", icon: User, label: "Profile" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const location = useLocation();
  const { logout, user } = useAuth();
  const BASE_COLORS = user ? getRoleColor(user.role) : getRoleColor("USER");

  const handleLogout = () => {
    setShowLogoutConfirmation(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutConfirmation(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirmation(false);
  };

  const roleColors = {
    bg: BASE_COLORS.bg,
    hoverBg: `hover:${BASE_COLORS.bg}`,
    activeBg: `active:${BASE_COLORS.bg}`,
    text: BASE_COLORS.text,
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="hover:bg-gray-100"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-64",
          roleColors.bg,
          "border-r transform transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-8"></div>

          <nav className="space-y-2">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center p-2 rounded-lg transition-colors",
                  location.pathname === path
                    ? cn(roleColors.bg, roleColors.text, "bg-opacity-100")
                    : cn(
                        "text-gray-600 hover:bg-opacity-80",
                        roleColors.bg,
                        "bg-opacity-0 hover:bg-opacity-50"
                      )
                )}
              >
                <Icon className="w-5 h-5 mr-3" />
                {label}
              </Link>
            ))}
          </nav>
          {/* Logout Button */}
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              "text-gray-600",
              roleColors.bg,
              "bg-opacity-0 hover:bg-opacity-50"
            )}
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>
      <ConfirmationDialog
        isOpen={showLogoutConfirmation}
        onCancel={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        title="Are you sure you want to logout?"
        description="You will be redirected to the login page."
        confirmText="Logout"
        cancelText="Cancel"
      />
    </>
  );
}
