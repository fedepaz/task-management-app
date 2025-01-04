import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { AuthUser } from "@task-app/shared";
import { useState } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const checkInitialAuth = async () => {
    try {
      setIsAuthChecking(true);
      const response = await authService.getCurrentUser();
      if (response.authenticated && response.user) {
        setUser(response.user);
        navigate("/");
        return true;
      } else {
        setUser(null);
        return false;
      }
    } catch (error) {
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
      navigate("/");
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
      navigate("/");
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
    navigate("/auth");
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
