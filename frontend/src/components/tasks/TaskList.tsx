import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ErrorModal } from "@/components/common/ErrorModal";
import { TaskModal } from "@/components/common/TaskModal";
import { Task } from "@task-app/shared";
import { useTasks } from "../../hooks/useTasks";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import { AxiosError } from "axios";
import { TaskCard } from "./TaskCard";
import { ConfirmationDialog } from "../common/ConfirmationDialog";
import { getRoleColor } from "@/lib/utils";

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
  const [unsavedChanges, setUnsavedChanges] = useState<Task | undefined>();

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

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const roleColors = sessionUser
    ? getRoleColor(sessionUser.role)
    : getRoleColor("USER");

  const handleModalClose = (taskWithChanges?: Task) => {
    if (taskWithChanges) {
      setUnsavedChanges(taskWithChanges);
      setIsConfirmationOpen(true);
    } else {
      setModalType(null);
      setSelectedTask(undefined);
    }
  };

  const handleConfirmationCancel = () => {
    setIsConfirmationOpen(false);
    setModalType("edit");
    setSelectedTask(unsavedChanges);
    setUnsavedChanges(undefined);
  };

  const handleConfirmationDiscard = () => {
    setIsConfirmationOpen(false);
    setModalType(null);
    setSelectedTask(undefined);
    setUnsavedChanges(undefined);
  };

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
    return () => setErrorModal({ show: false });
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
      <h1 className={`text-center text-2xl font-bold ${roleColors.text}`}>
        {sessionUser?.name}'s Tasks
      </h1>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => setModalType("create")}
          className={`whitespace-nowrap ${roleColors.buttonBg} text-white`}
          disabled={isCreating}
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          {isCreating ? "Adding..." : "Add Task"}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(tasks) && tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={(task) => {
                setSelectedTask(task);
                setModalType("edit");
              }}
              onDelete={(task) => {
                setSelectedTask(task);
                setModalType("delete");
              }}
              onStatusChange={handleStatusChange}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
            />
          ))
        ) : (
          <div
            id="noTaskAvailableId"
            key={"noTaskAvailableKey"}
            className={`${roleColors.bg} p-4 rounded-lg shadow-sm border flex items-center gap-4 flex-wrap sm:flex-nowrap`}
          >
            No tasks available
          </div>
        )}

        {tasks.length === 0 && !isLoading && (
          <div
            id="noTaskYetId"
            key={"noTaskYetKey"}
            className={`text-center p-8 ${roleColors.text}`}
          >
            No tasks yet. Add your first task above!
          </div>
        )}
      </div>
      <TaskModal
        open={!!modalType}
        onClose={handleModalClose}
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
      {isConfirmationOpen && (
        <ConfirmationDialog
          isOpen={isConfirmationOpen}
          onCancel={handleConfirmationCancel}
          onConfirm={handleConfirmationDiscard}
          title="Discard Changes"
          description="Are you sure you want to discard the changes you've made?"
          confirmText="Discard"
          cancelText="Cancel"
        />
      )}
    </div>
  );
}
