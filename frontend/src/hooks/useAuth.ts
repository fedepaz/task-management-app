import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { AuthUser } from "@task-app/shared";
import { useState } from "react";

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setUser(data.user);
    },
    onError: (error: Error) => {
      setUser(null);
      return error;
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setUser(data.user);
    },
    onError: (error: Error) => {
      setUser(null);
      return error;
    },
  });

  const logout = () => {
    setUser(null);
  };

  return {
    user,
    Error,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoading: loginMutation.isPending || registerMutation.isPending,
  };
};
