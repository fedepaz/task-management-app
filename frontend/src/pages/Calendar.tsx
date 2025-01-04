import { useState, useEffect } from "react";
import TaskCalendar from "@/components/tasks/TaskCalendar";
import { Task } from "@task-app/shared";

// Mock function to fetch tasks
const fetchTasks = async (): Promise<Task[]> => {
  // In a real application, this would be an API call
  return [
    {
      id: "1",
      title: "Complete project proposal",
      description: "Finish the draft and send for review",
      priority: "HIGH",
      dueDate: new Date(2025, 5, 15),
      status: "TODO",
      createdAt: new Date(2025, 5, 1),
      updatedAt: new Date(2025, 5, 1),
      user: {},
    },
    {
      id: "2",
      title: "Team meeting",
      priority: "MEDIUM",
      dueDate: new Date(2025, 5, 10),
      status: "TODO",
      createdAt: new Date(2025, 5, 2),
      updatedAt: new Date(2025, 5, 2),
      user: {},
    },
  ];
};

export default function CalendarPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loadTasks = async () => {
      const fetchedTasks = await fetchTasks();
      setTasks(fetchedTasks);
    };
    loadTasks();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Task Calendar</h1>
      <TaskCalendar tasks={tasks} />
    </div>
  );
}
