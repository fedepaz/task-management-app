export interface Reminder {
  id: string;
  taskId: string;
  type: "EMAIL" | "PUSH" | "SMS";
  scheduledFor: Date;
  status: "PENDING" | "SENT" | "FAILED";
}
