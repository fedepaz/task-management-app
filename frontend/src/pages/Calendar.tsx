import { useState, useEffect } from "react";
import TaskCalendar from "@/components/tasks/TaskCalendar";
import { Task } from "@task-app/shared";
import { useTasks } from "@/hooks/useTasks";
import { ErrorModal } from "@/components/common/ErrorModal";
import { AxiosError } from "axios";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export default function CalendarPage() {
  const { tasks: data = [], isLoading, error } = useTasks();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [errorModal, setErrorModal] = useState<{
    show: boolean;
    message?: string;
  }>({
    show: false,
  });

  useEffect(() => {
    if (error) {
      console.log(error);
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
        <TaskCalendar tasks={tasks} />
      </div>
    </div>
  );
}
