import { useEffect, useState } from "react";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/Checkbox";
import { ErrorModal } from "@/components/common/ErrorModal";
import { TaskModal } from "@/components/common/TaskModal";
import { Task } from "@task-app/shared";
import { useTasks } from "../../hooks/useTasks";
import { LoadingSpinner } from "../common/LoadingSpinner";

export default function TaskList() {
  const {
    tasks = [],
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    isCreating,
    isUpdating,
    isDeleting,
  } = useTasks();

  const [newTask, setNewTask] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [modalType, setModalType] = useState<"edit" | "delete" | null>(null);
  const [errorModal, setErrorModal] = useState<{
    show: boolean;
    message?: string;
  }>({
    show: false,
  });

  useEffect(() => {
    if (error) {
      setErrorModal({
        show: true,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while fetching tasks",
      });
    }
  }, [error]);

  const handleAddTask = () => {
    if (!newTask.trim()) return;

    createTask({
      title: newTask.trim(),
      status: "TODO",
      priority: "MEDIUM",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setNewTask("");
  };

  const handleEditTask = (taskToUpdate?: Task) => {
    if (taskToUpdate) {
      updateTask({
        ...taskToUpdate,
        updatedAt: new Date(),
      });
      setModalType(null);
      setSelectedTask(undefined);
    }
  };

  const handleDeleteTask = (taskToDelete?: Task) => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
      setModalType(null);
      setSelectedTask(undefined);
    }
  };

  const handleStatusChange = (task: Task) => {
    updateTask({
      ...task,
      status: task.status === "COMPLETED" ? "TODO" : "COMPLETED",
      updatedAt: new Date(),
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <ErrorModal
        open={errorModal.show}
        onClose={() => setErrorModal({ show: false })}
        error={errorModal.message}
      />

      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-grow"
          disabled={isCreating}
        />
        <Button
          onClick={handleAddTask}
          className="whitespace-nowrap"
          disabled={isCreating}
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          {isCreating ? "Adding..." : "Add Task"}
        </Button>
      </div>

      <div className="grid gap-4">
        {Array.isArray(tasks) ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white p-4 rounded-lg shadow-sm border flex items-center gap-4 flex-wrap sm:flex-nowrap"
            >
              <Checkbox
                checked={task.status === "COMPLETED"}
                onCheckedChange={() => handleStatusChange(task)}
                disabled={isUpdating}
              />

              <div className="flex-grow min-w-[200px]">
                <p
                  className={
                    task.status === "COMPLETED"
                      ? "line-through text-gray-500"
                      : ""
                  }
                >
                  {task.title}
                </p>
                <div className="flex gap-2 mt-2 text-sm text-gray-500">
                  <span className="capitalize">
                    {task.priority.toLowerCase()}
                  </span>
                  {task.dueDate && (
                    <span>
                      · Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  {task.description && <span>· {task.description}</span>}
                  {task.tags && task.tags.length > 0 && (
                    <span>· Tags: {task.tags.join(", ")}</span>
                  )}
                  {task.assignedTo && (
                    <span>· Assigned to: {task.assignedTo}</span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 ml-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedTask(task);
                    setModalType("edit");
                  }}
                  disabled={isUpdating}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedTask(task);
                    setModalType("delete");
                  }}
                  disabled={isDeleting}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center gap-4 flex-wrap sm:flex-nowrap">
            No tasks available
          </div>
        )}

        {tasks.length === 0 && !isLoading && (
          <div className="text-center p-8 text-gray-500">
            No tasks yet. Add your first task above!
          </div>
        )}
      </div>

      <TaskModal
        open={!!modalType}
        onClose={() => {
          setModalType(null);
          setSelectedTask(undefined);
        }}
        mode={modalType || "edit"}
        task={selectedTask}
        onConfirm={modalType === "delete" ? handleDeleteTask : handleEditTask}
      />
    </div>
  );
}
