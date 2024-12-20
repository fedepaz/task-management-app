import { useState, useEffect } from "react";
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

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  mode: "edit" | "delete";
  task?: Task;
  onConfirm: (task?: Task) => void;
}

export function TaskModal({
  open,
  onClose,
  mode,
  task,
  onConfirm,
}: TaskModalProps) {
  const [editedTask, setEditedTask] = useState<Task | undefined>(task);

  // Reset form when task changes
  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  const handleConfirm = () => {
    onConfirm(editedTask);
    onClose();
  };

  // For multi-tag input
  const handleTagsChange = (value: string) => {
    if (!editedTask) return;
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    setEditedTask((prev) => (prev ? { ...prev, tags } : prev));
  };

  if (mode === "delete") {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{task?.title}"? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={onClose}>
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Create Task"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title*
            </label>
            <Input
              id="title"
              value={editedTask?.title ?? ""}
              onChange={(e) =>
                setEditedTask((prev) =>
                  prev ? { ...prev, title: e.target.value } : prev
                )
              }
              placeholder="Enter task title"
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
                setEditedTask((prev) =>
                  prev ? { ...prev, description: e.target.value } : prev
                )
              }
              placeholder="Enter task description"
              rows={3}
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
                <SelectTrigger>
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
                <SelectTrigger>
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
                onChange={(e) =>
                  setEditedTask((prev) =>
                    prev ? { ...prev, dueDate: new Date(e.target.value) } : prev
                  )
                }
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
                  setEditedTask((prev) =>
                    prev ? { ...prev, assignedTo: e.target.value } : prev
                  )
                }
                placeholder="Enter assignee"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label htmlFor="tags" className="text-sm font-medium">
              Tags
            </label>
            <Input
              id="tags"
              value={editedTask?.tags?.join(", ") ?? ""}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder="Enter tags separated by commas"
            />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!editedTask?.title}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
