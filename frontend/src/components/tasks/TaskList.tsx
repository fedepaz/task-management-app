import { useState } from "react";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Complete project proposal",
      completed: false,
      priority: "high",
      dueDate: "2023-06-30",
    },
    { id: "2", title: "Buy groceries", completed: true, priority: "low" },
    {
      id: "3",
      title: "Prepare for meeting",
      completed: false,
      priority: "medium",
      dueDate: "2023-06-25",
    },
  ]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim() !== "") {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask,
        completed: false,
        priority: "medium",
      };
      setTasks([...tasks, task]);
      setNewTask("");
    }
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Task Management</h1>
      <div className="flex flex-col sm:flex-row mb-4 gap-2">
        <Input
          type="text"
          placeholder="Add a new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={addTask} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-lg shadow"
          >
            <div className="flex items-center mb-2 sm:mb-0">
              <Checkbox
                id={`task-${task.id}`}
                checked={task.completed}
                onCheckedChange={() => toggleTask(task.id)}
              />
              <label
                htmlFor={`task-${task.id}`}
                className={`ml-2 ${
                  task.completed ? "line-through text-gray-500" : ""
                }`}
              >
                {task.title}
              </label>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-2 py-1 text-xs rounded ${
                  task.priority === "high"
                    ? "bg-red-200 text-red-800"
                    : task.priority === "medium"
                    ? "bg-yellow-200 text-yellow-800"
                    : "bg-green-200 text-green-800"
                }`}
              >
                {task.priority}
              </span>
              {task.dueDate && (
                <span className="text-sm text-gray-500">
                  Due: {task.dueDate}
                </span>
              )}
              <Button variant="outline" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => deleteTask(task.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
