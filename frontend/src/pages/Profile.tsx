import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { ErrorModal } from "@/components/common/ErrorModal";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { getInitials, getRoleColor } from "../lib/utils";

export default function Profile() {
  const { user, logout, error, isLoading } = useAuth();
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [errorModal, setErrorModal] = useState<{
    show: boolean;
    message?: string;
  }>({
    show: false,
  });

  useEffect(() => {
    if (error) {
      setErrorModal({
        show: true,
        message:
          error instanceof AxiosError
            ? error.response?.data
            : "An unexpected error occurred while fetching user data",
      });
    }
  }, [error]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <ErrorModal
          open={errorModal.show}
          onClose={() => setErrorModal({ show: false })}
          error={errorModal.message}
        />
      </div>
    );
  }

  const initials = getInitials(user.name);
  const avatarColors = getRoleColor(user.role);

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

  return (
    <div className="space-y-6 p-4 sm:p-8 md:p-12 lg:p-16">
      <ErrorModal
        open={errorModal.show}
        onClose={() => setErrorModal({ show: false })}
        error={errorModal.message}
      />
      <Card
        className={`w-full max-w-4xl mx-auto shadow-lg ${avatarColors.cardBg}`}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Profile
            </CardTitle>
            <span
              className={`text-lg sm:text-xl font-semibold ${avatarColors.text} capitalize`}
            >
              {user.role.toLowerCase()}
            </span>
          </div>
          <CardDescription className="text-lg sm:text-xl">
            Your account information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
            <div className="flex-shrink-0">
              <Avatar
                className={`w-32 h-32 sm:w-40 sm:h-40 ${avatarColors.bg} ${avatarColors.border} border-4`}
              >
                <AvatarFallback
                  className={`text-4xl sm:text-5xl font-bold ${avatarColors.text}`}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-grow space-y-4 text-center sm:text-left">
              <div>
                <h3 className="text-lg font-medium text-gray-500">Name</h3>
                <p className="text-xl sm:text-2xl font-semibold text-gray-900">
                  {user.name}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-500">Email</h3>
                <p className="text-xl sm:text-2xl font-semibold text-gray-900">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-6">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={`${avatarColors.buttonBg} text-white px-6 py-2 text-lg transition-all duration-200 ease-in-out transform hover:scale-105`}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </CardFooter>
      </Card>
      <ConfirmationDialog
        isOpen={showLogoutConfirmation}
        onCancel={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        title="Are you sure you want to logout?"
        description="You will be redirected to the login page."
        confirmText="Logout"
        cancelText="Cancel"
      />
    </div>
  );
}
