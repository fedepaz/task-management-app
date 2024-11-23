import { useState } from "react";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/Checkbox";

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={addTask} className="whitespace-nowrap">
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white p-4 rounded-lg shadow-sm border flex items-center gap-4 flex-wrap sm:flex-nowrap"
          >
            <Checkbox
              checked={task.completed}
              onCheckedChange={() =>
                setTasks(
                  tasks.map((t) =>
                    t.id === task.id ? { ...t, completed: !t.completed } : t
                  )
                )
              }
            />

            <div className="flex-grow min-w-[200px]">
              <p
                className={`${task.completed ? "line-through text-gray-500" : ""}`}
              >
                {task.title}
              </p>
              <div className="flex gap-2 mt-2 text-sm text-gray-500">
                <span className="capitalize">{task.priority}</span>
                {task.dueDate && <span>· Due: {task.dueDate}</span>}
              </div>
            </div>

            <div className="flex gap-2 ml-auto">
              <Button variant="ghost" size="icon">
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTasks(tasks.filter((t) => t.id !== task.id))}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
