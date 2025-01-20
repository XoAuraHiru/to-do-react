// src/components/tasks/TaskForm.jsx
import PropTypes from 'prop-types';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus, Loader2, Clock } from "lucide-react";

const TaskForm = ({ 
  newTask, 
  scheduledDate, 
  scheduledTime, 
  isSubmitting, 
  onTaskChange, 
  onDateChange, 
  onTimeChange, 
  onSubmit 
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 mb-6">
      <div className="flex gap-2">
        <Input
          value={newTask}
          onChange={(e) => onTaskChange(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1"
          disabled={isSubmitting}
        />
        <Button 
          type="submit"
          disabled={isSubmitting || !newTask.trim() || !scheduledDate || !scheduledTime}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          Add Task
        </Button>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Schedule Date</span>
          </div>
          <Input
            type="date"
            value={scheduledDate}
            onChange={(e) => onDateChange(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            disabled={isSubmitting}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Schedule Time</span>
          </div>
          <Input
            type="time"
            value={scheduledTime}
            onChange={(e) => onTimeChange(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </form>
  );
};

TaskForm.propTypes = {
  newTask: PropTypes.string.isRequired,
  scheduledDate: PropTypes.string.isRequired,
  scheduledTime: PropTypes.string.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  onTaskChange: PropTypes.func.isRequired,
  onDateChange: PropTypes.func.isRequired,
  onTimeChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default TaskForm;