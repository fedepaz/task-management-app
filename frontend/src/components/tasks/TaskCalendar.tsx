import { useState, useCallback } from "react";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Task } from "@task-app/shared";

const localizer = momentLocalizer(moment);

interface CalendarProps {
  tasks: Task[];
}

export default function TaskCalendar({ tasks }: CalendarProps) {
  const [view, setView] = useState<View>("month");

  const eventStyleGetter = useCallback((task: Task) => {
    let backgroundColor = "#3B82F6";
    switch (task.priority) {
      case "HIGH":
        backgroundColor = "#EF4444";
        break;
      case "MEDIUM":
        backgroundColor = "#F59E0B";
        break;
    }
    return {
      style: {
        backgroundColor,
        borderRadius: "4px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    };
  }, []);

  const getEventStart = useCallback(
    (task: Task) => task.dueDate || task.createdAt,
    []
  );
  const getEventEnd = useCallback((task: Task) => {
    if (task.dueDate) {
      const end = new Date(task.dueDate);
      end.setDate(end.getDate() + 1); // Set end date to next day for proper rendering
      return end;
    }
    return task.createdAt;
  }, []);

  return (
    <div className="h-[calc(100vh-200px)]">
      <Calendar<Task>
        localizer={localizer}
        events={tasks}
        startAccessor={getEventStart}
        endAccessor={getEventEnd}
        style={{ height: "100%" }}
        views={["month", "week", "day"]}
        view={view}
        onView={(newView: View) => setView(newView)}
        eventPropGetter={eventStyleGetter}
        titleAccessor="title"
        className="bg-white shadow-lg rounded-lg p-4"
      />
    </div>
  );
}
