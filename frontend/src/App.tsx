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
      const isAuthenticated = await checkAuth();
      // Navigation is handled by the router based on the user state
    };
    checkSession();
  }, []);

  if (isAuthChecking || isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}

function AuthRoute() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
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

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
