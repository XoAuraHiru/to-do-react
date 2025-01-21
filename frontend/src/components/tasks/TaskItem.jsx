import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Edit2, Check, X } from "lucide-react";
import { TaskShape, TaskEditableProps, TaskCallbacks } from '../../types/taskTypes';

const TaskItem = ({
  task,
  editingTask,
  editText,
  editDate,
  editTime,
  onEdit,
  onDelete,
  onEditSubmit,
  onEditCancel,
  onEditTextChange,
  onEditDateChange,
  onEditTimeChange,
  onToggleComplete,
  isUpcoming,
  formatDateTime
}) => {
  const isEditing = editingTask === task._id;

  if (isEditing) {
    return (
      <div className="flex-1 space-y-2">
        <Input
          value={editText}
          onChange={(e) => onEditTextChange(e.target.value)}
          className="flex-1"
        />
        <div className="flex gap-2">
          <Input
            type="date"
            value={editDate}
            onChange={(e) => onEditDateChange(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
          <Input
            type="time"
            value={editTime}
            onChange={(e) => onEditTimeChange(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => onEditSubmit(task._id)}
            disabled={!editText.trim() || !editDate || !editTime}
          >
            <Check className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button
            variant="outline"
            onClick={onEditCancel}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border ${
        isUpcoming(task.scheduledFor) ? 'bg-blue-50 border-blue-200' : 'bg-background'
      } ${task.completed ? 'opacity-75' : ''}`}
    >
      <div className="flex items-center gap-3 flex-1">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggleComplete(task._id, !task.completed)}
          id={`task-${task._id}`}
        />
        <div className="flex-1">
          <div className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
            {task.title}
          </div>
          <div className="text-sm text-muted-foreground">
            {formatDateTime(task.scheduledFor)}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={() => onEdit(task)}
          disabled={task.completed}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="destructive"
          onClick={() => onDelete(task._id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

TaskItem.propTypes = {
    task: TaskShape.isRequired,
    ...TaskEditableProps,
    ...TaskCallbacks
  };

export default TaskItem;