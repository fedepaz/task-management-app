import { useState, useCallback } from "react";
import {
  Calendar,
  momentLocalizer,
  type View,
  type NavigateAction,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import type { Task } from "@task-app/shared";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getRoleColor } from "@/lib/utils";

const localizer = momentLocalizer(moment);

interface CalendarProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
}

export default function TaskCalendar({ tasks, onSelectTask }: CalendarProps) {
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());
  const { user: sessionUser } = useAuth();

  const roleColors = sessionUser
    ? getRoleColor(sessionUser.role)
    : getRoleColor("USER");

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

  const getEventStart = useCallback((task: Task) => {
    return new Date(task.dueDate || task.createdAt);
  }, []);

  const getEventEnd = useCallback((task: Task) => {
    if (task.dueDate) {
      const end = new Date(task.dueDate);
      end.setDate(end.getDate() + 1); // Set end date to next day for proper rendering
      return end;
    }
    return new Date(task.createdAt);
  }, []);

  const handleSelectEvent = useCallback(
    (task: Task) => {
      onSelectTask(task);
    },
    [onSelectTask]
  );

  const handleNavigate = useCallback(
    (newDate: Date, view: View, action: NavigateAction) => {
      console.log(newDate, view, action);

      setDate(newDate);
    },
    []
  );

  const handleViewChange = useCallback((newView: View) => {
    setView(newView);
  }, []);

  /**
  const navigateCalendar = useCallback(
    (action: "PREV" | "NEXT" | "TODAY") => {
      const newDate = new Date(date);
      switch (action) {
        case "PREV":
          if (view === "month") newDate.setMonth(date.getMonth() - 1);
          else if (view === "week") newDate.setDate(date.getDate() - 7);
          else newDate.setDate(date.getDate() - 1);
          break;
        case "NEXT":
          if (view === "month") newDate.setMonth(date.getMonth() + 1);
          else if (view === "week") newDate.setDate(date.getDate() + 7);
          else newDate.setDate(date.getDate() + 1);
          break;
        case "TODAY":
          newDate.setTime(new Date().getTime());
          break;
      }
      setDate(newDate);
    },
    [date, view]
  );

   * 
   */

  const renderToolbar = useCallback(() => {
    const dateFormat = view === "month" ? "MMMM YYYY" : "MMMM D, YYYY";
    return (
      <div
        className={`flex justify-between items-center mb-4 ${roleColors.text}`}
      >
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleNavigate(
                new Date(
                  moment(date)
                    .add(
                      view === "month" ? -1 : view === "week" ? -7 : -1,
                      view === "month" ? "month" : "days"
                    )
                    .toDate()
                ),
                view,
                "PREV"
              )
            }
            className={roleColors.border}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleNavigate(new Date(), view, "TODAY")}
            className={roleColors.border}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleNavigate(
                new Date(
                  moment(date)
                    .add(
                      view === "month" ? 1 : view === "week" ? 7 : 1,
                      view === "month" ? "month" : "days"
                    )
                    .toDate()
                ),
                view,
                "NEXT"
              )
            }
            className={roleColors.border}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-lg font-semibold">
          {moment(date).format(dateFormat)}
        </h2>
        <Select
          value={view}
          onValueChange={(newView) => handleViewChange(newView as View)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="day">Day</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }, [
    date,
    view,
    handleViewChange,
    handleNavigate,
    roleColors.border,
    roleColors.text,
  ]);

  return (
    <div className="space-y-4">
      {renderToolbar()}
      <div className="h-[calc(100vh-200px)]">
        <Calendar<Task>
          localizer={localizer}
          events={tasks}
          startAccessor={getEventStart}
          endAccessor={getEventEnd}
          style={{ height: "100%" }}
          view={view}
          date={date}
          onNavigate={handleNavigate}
          onView={handleViewChange}
          eventPropGetter={eventStyleGetter}
          titleAccessor="title"
          onSelectEvent={handleSelectEvent}
          className="bg-white shadow-lg rounded-lg p-4"
          components={{
            toolbar: () => null, // We're using our custom toolbar
          }}
        />
      </div>
    </div>
  );
}
