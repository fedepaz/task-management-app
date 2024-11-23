import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./pages/Layout";
import TaskList from "./components/tasks/TaskList";
import Calendar from "./pages/Calendar";
import Profile from "./pages/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <TaskList /> },
      { path: "/calendar", element: <Calendar /> },
      { path: "/profile", element: <Profile /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
