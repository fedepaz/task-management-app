import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task } from "@task-app/shared";
import { TagAutoComplete } from "../common/TagAutoComplete";

interface TaskModalProps {
  open: boolean;
  onClose: (taskWithChanges?: Task) => void;
  mode: "edit" | "delete";
  task?: Task;
  onConfirm: (task?: Task) => void;
  onHasChangesUpdate?: (hasChanges: boolean) => void;
}

export function TaskModal({
  open,
  onClose,
  mode,
  task,
  onConfirm,
}: TaskModalProps) {
  const [editedTask, setEditedTask] = useState<Task | undefined>(task);

  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  const handleClose = useCallback(() => {
    if (editedTask && JSON.stringify(editedTask) !== JSON.stringify(task)) {
      onClose(editedTask);
    } else {
      onClose();
    }
  }, [editedTask, onClose, task]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, handleClose]);

  const handleConfirm = () => {
    if (!editedTask) return;
    onConfirm(editedTask);
    onClose();
  };

  const handleFieldChange = <K extends keyof Task>(
    field: K,
    value: Task[K]
  ) => {
    setEditedTask((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedTask) return;

    const date = e.target.value ? new Date(e.target.value) : undefined;

    setEditedTask((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        dueDate: date,
      };
    });
  };

  if (mode === "delete") {
    return (
      <Dialog open={open} onOpenChange={handleClose} modal={true}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{task?.title}"? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => onConfirm(task)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            handleClose();
          }
        }}
        modal={true}
      >
        <DialogContent
          aria-hidden={undefined}
          className="sm:max-w-[600px]"
          onEscapeKeyDown={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>{task ? "Edit Task" : "Create Task"}</DialogTitle>
            <DialogDescription>
              {task
                ? "Edit the details of your task below."
                : "Fill in the details for your new task."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title*
              </label>
              <Input
                id="title"
                value={editedTask?.title ?? ""}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                placeholder="Enter task title"
                autoComplete="off"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={editedTask?.description ?? ""}
                onChange={(e) =>
                  handleFieldChange("description", e.target.value)
                }
                placeholder="Enter task description"
                rows={3}
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status*
                </label>
                <Select
                  value={editedTask?.status}
                  onValueChange={(value: Task["status"]) =>
                    setEditedTask((prev) =>
                      prev ? { ...prev, status: value } : prev
                    )
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODO">To Do</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <label htmlFor="priority" className="text-sm font-medium">
                  Priority*
                </label>
                <Select
                  value={editedTask?.priority}
                  onValueChange={(value: Task["priority"]) =>
                    setEditedTask((prev) =>
                      prev ? { ...prev, priority: value } : prev
                    )
                  }
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="dueDate" className="text-sm font-medium">
                  Due Date
                </label>
                <Input
                  id="dueDate"
                  type="datetime-local"
                  value={
                    editedTask?.dueDate
                      ? new Date(editedTask.dueDate).toISOString().slice(0, 16)
                      : ""
                  }
                  onChange={handleDueDateChange}
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="assignedTo" className="text-sm font-medium">
                  Assigned To
                </label>
                <Input
                  id="assignedTo"
                  value={editedTask?.assignedTo ?? ""}
                  onChange={(e) =>
                    handleFieldChange("assignedTo", e.target.value)
                  }
                  placeholder="Enter assignee"
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="tags" className="text-sm font-medium">
                Tags
              </label>
              <TagAutoComplete
                selectedTags={editedTask?.tags ?? []}
                onTagsChange={(tagIds) => {
                  handleFieldChange("tags", tagIds);
                }}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={!editedTask?.title}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
