import { Outlet } from "react-router-dom";
import Sidebar from "@/components/ui/Sidebar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-full">
        <Sidebar />

        <main className="flex-1 p-4 lg:p-8 w-full min-h-screen">
          <header className="lg:hidden mb-6 pt-14">
            <h1 className="text-xl font-bold">Task App</h1>
          </header>

          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
