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

function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  console.log("Protected Route - User:", user);
  console.log("Protected Route - Loading:", isLoading);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    console.log("No user - Redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }

  console.log("User exists - Rendering Outlet");
  return <Outlet />;
}

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthPage />,
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
