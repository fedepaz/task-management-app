import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Task } from "@task-app/shared";
import { TaskTags } from "./TaskTags";

const priorityColors = {
  LOW: "bg-blue-100 text-blue-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-red-100 text-red-800",
};

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  isUpdating,
  isDeleting,
}: TaskCardProps) => {
  return (
    <div
      className={`bg-white p-4 rounded-lg shadow-sm border flex flex-col ${
        task.status === "COMPLETED" ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-2 $">
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
            onClick={() => onEdit(task)}
            disabled={isUpdating}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task)}
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <h3
        className={`text-lg font-semibold mb-2 ${
          task.status === "COMPLETED" ? "line-through text-gray-500" : ""
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
          <>
            <p>Tags: </p>
            <TaskTags tagsIds={task.tags} />
          </>
        )}
        {task.assignedTo && <p>Assigned to: {task.assignedTo}</p>}
      </div>

      <div className="mt-4 flex items-center">
        <Checkbox
          checked={task.status === "COMPLETED"}
          onCheckedChange={() => onStatusChange(task)}
          disabled={isUpdating}
        />
        <span className="ml-2 text-sm text-gray-600">
          {task.status === "COMPLETED" ? "Completed" : "Mark as complete"}
        </span>
      </div>
    </div>
  );
};
