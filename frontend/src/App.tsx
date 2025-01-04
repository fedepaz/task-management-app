import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import Layout from "./pages/Layout";
import TaskList from "./components/tasks/TaskList";
import Calendar from "./pages/Calendar";
import Profile from "./pages/Profile";
import AuthPage from "./pages/Auth";
import { useAuth } from "./hooks/useAuth";
import { LoadingSpinner } from "./components/common/LoadingSpinner";
import { useEffect } from "react";

function ProtectedRoute() {
  const { user, isLoading, checkAuth, isAuthChecking } = useAuth();

  useEffect(() => {
    const checkSession = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };

    checkSession();
  }, []);

  if (isAuthChecking || isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <Navigate to="/auth" replace state={{ from: window.location.pathname }} />
    );
  }

  return <Outlet />;
}

function AuthRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (user) {
    const from = window.location.origin || "/";
    return <Navigate to={from} replace />;
  }

  return <AuthPage />;
}

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthRoute />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { index: true, element: <TaskList /> },
          { path: "calendar", element: <Calendar /> },
          { path: "profile", element: <Profile /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
