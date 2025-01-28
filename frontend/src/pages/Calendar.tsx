import { useState, useEffect, useCallback } from "react";
import TaskCalendar from "@/components/tasks/TaskCalendar";
import { Task } from "@task-app/shared";
import { useTasks } from "@/hooks/useTasks";
import { ErrorModal } from "@/components/common/ErrorModal";
import { AxiosError } from "axios";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { TaskModal } from "@/components/common/TaskModal";

export default function CalendarPage() {
  const { tasks: data = [], isLoading, error, updateTask } = useTasks();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [modalType, setModalType] = useState<
    "edit" | "delete" | "create" | null
  >(null);
  const [unsavedChanges, setUnsavedChanges] = useState<Task | undefined>();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

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

  useEffect(() => {
    setTasks(data);
  }, [data]);

  const handleSelectTask = useCallback((task: Task) => {
    setSelectedTask(task);
    setModalType("edit");
  }, []);

  const handleModalClose = useCallback((taskWithChanges?: Task) => {
    if (taskWithChanges) {
      setUnsavedChanges(taskWithChanges);
      setIsConfirmationOpen(true);
    } else {
      setModalType(null);
      setSelectedTask(undefined);
    }
  }, []);

  const handleConfirmationCancel = useCallback(() => {
    setIsConfirmationOpen(false);
    setModalType("edit");
    setSelectedTask(unsavedChanges);
    setUnsavedChanges(undefined);
  }, [unsavedChanges]);

  const handleConfirmationDiscard = useCallback(() => {
    setIsConfirmationOpen(false);
    setModalType(null);
    setSelectedTask(undefined);
    setUnsavedChanges(undefined);
  }, []);

  const handleEditTask = useCallback(
    (taskToUpdate?: Task) => {
      if (taskToUpdate) {
        updateTask({ ...taskToUpdate, updatedAt: new Date() });
        setModalType(null);
        setSelectedTask(undefined);
      }
    },
    [updateTask]
  );

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
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Task Calendar</h1>
        <TaskCalendar tasks={tasks} onSelectTask={handleSelectTask} />
      </div>
      <TaskModal
        open={!!modalType}
        onClose={handleModalClose}
        mode={modalType === "create" ? "edit" : modalType || "edit"}
        task={selectedTask}
        onConfirm={handleEditTask}
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
