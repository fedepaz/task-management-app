import { useEffect, useState } from "react";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { ErrorModal } from "@/components/common/ErrorModal";
import { TaskModal } from "@/components/common/TaskModal";
import { Task } from "@task-app/shared";
import { useTasks } from "../../hooks/useTasks";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { AxiosError } from "axios";
import { useAuth } from "@/hooks/useAuth";

const priorityColors = {
  LOW: "bg-blue-100 text-blue-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-red-100 text-red-800",
};

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

  const { user: sessionUser } = useAuth();

  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [modalType, setModalType] = useState<
    "edit" | "delete" | "create" | null
  >(null);
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
          error instanceof AxiosError
            ? error.response?.data
            : "An unexpected error occurred while fetching tasks",
      });
    }
  }, [error]);

  const handleCreateTask = (newTask?: Task) => {
    if (newTask) {
      const taskWithUser = {
        ...newTask,
        user: { user: sessionUser?.id },
        createdAt: new Date(),
        updatetAt: new Date(),
      };
      createTask(taskWithUser);
    }
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
      <h1 className="text-center text-lg">
        {sessionUser?.name.toLowerCase()}'s Tasks
      </h1>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => setModalType("create")}
          className="whitespace-nowrap"
          disabled={isCreating}
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          {isCreating ? "Adding..." : "Add Task"}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(tasks) && tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white p-4 rounded-lg shadow-sm border flex flex-col ${
                task.status === "COMPLETED" ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    priorityColors[task.priority as keyof typeof priorityColors]
                  }`}
                >
                  {task.priority}
                </span>
                <div className="flex gap-2">
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

              <h3
                className={`text-lg font-semibold mb-2 ${
                  task.status === "COMPLETED"
                    ? "line-through text-gray-500"
                    : ""
                }`}
              >
                {task.title}
              </h3>

              <div className="flex-grow space-y-2 text-sm text-gray-600">
                {task.description && <p>{task.description}</p>}
                {task.dueDate && (
                  <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                )}
                {task.tags && task.tags.length > 0 && (
                  <p>Tags: {task.tags.join(", ")}</p>
                )}
                {task.assignedTo && <p>Assigned to: {task.assignedTo}</p>}
              </div>

              <div className="mt-4 flex items-center">
                <Checkbox
                  checked={task.status === "COMPLETED"}
                  onCheckedChange={() => handleStatusChange(task)}
                  disabled={isUpdating}
                />
                <span className="ml-2 text-sm text-gray-600">
                  {task.status === "COMPLETED"
                    ? "Completed"
                    : "Mark as complete"}
                </span>
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
        mode={modalType === "create" ? "edit" : modalType || "edit"}
        task={
          modalType === "create"
            ? ({
                title: "",
                status: "TODO",
                priority: "MEDIUM",
                user: { user: sessionUser?.id },
              } as Task)
            : selectedTask
        }
        onConfirm={
          modalType === "delete"
            ? handleDeleteTask
            : modalType === "create"
              ? handleCreateTask
              : handleEditTask
        }
      />
    </div>
  );
}
