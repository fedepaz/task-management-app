import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { AuthUser } from "@task-app/shared";
import { useState } from "react";
import { AxiosError } from "axios";

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const checkInitialAuth = async () => {
    try {
      setIsAuthChecking(true);
      const response = await authService.getCurrentUser();
      console.log("Initial Auth Check - Response:", response);
      if (response.authenticated && response.user) {
        setUser(response.user);
        return true;
      } else {
        setUser(null);
        return false;
      }
    } catch (error) {
      console.log("Initial Auth Check - No User");
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message
          : "Ocurrió un error inesperado";
      setError(errorMessage);
      setUser(null);
    } finally {
      setIsAuthChecking(false);
    }
  };

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

  const logout = async () => {
    setUser(null);
    setError(null);
  };

  return {
    user,
    error,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    checkAuth: checkInitialAuth,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    isAuthChecking,
  };
};
