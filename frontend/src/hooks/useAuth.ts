import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { AuthUser } from "@task-app/shared";
import { useState } from "react";
import { AxiosError } from "axios";

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setUser(data.user);
      setError(null);
    },
    onError: (error) => {
      setUser(null);
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message
          : "Ocurrió un error inesperado";
      setError(errorMessage);
      return errorMessage;
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setUser(data.user);
      setError(null);
    },
    onError: (error) => {
      setUser(null);
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message
          : "Ocurrió un error inesperado";
      setError(errorMessage);
      return errorMessage;
    },
  });

  const logout = () => {
    setUser(null);
    setError(null);
  };

  return {
    user,
    error,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoading: loginMutation.isPending || registerMutation.isPending,
  };
};
