import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { LoginCredentials, RegisterCredentials } from "@task-app/shared";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: sessionData, isLoading: isAuthChecking } = useQuery({
    queryKey: ["session"],
    queryFn: authService.getCurrentUser,
    retry: false,
    staleTime: 45 * 60 * 1000,
  });

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      navigate("/");
      return data;
    },
    onError: (error: Error) => {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error.message
          : "Ocurrió un error inesperado";

      return errorMessage;
    },
  });

  const registerMutation = useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      authService.register(credentials),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      navigate("/");
      return data;
    },
    onError: (error: Error) => {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error.message
          : "Ocurrió un error inesperado";
      return errorMessage;
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.setQueryData(["session"], {
        authenticated: false,
        user: null,
      });
      queryClient.invalidateQueries({ queryKey: ["session"] });
      navigate("/login");
    },
  });

  return {
    user: sessionData?.authenticated ? sessionData.user : null,
    error: loginMutation.error || registerMutation.error,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    isAuthChecking,
  };
};
