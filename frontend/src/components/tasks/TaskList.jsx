import PropTypes from 'prop-types';
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import TaskItem from "./TaskItem";
import { TaskShape, TaskEditableProps, TaskCallbacks } from '../../types/taskTypes';


const TaskList = ({
  tasks,
  sortOrder,
  onSortToggle,
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
  // Sort tasks to show completed ones at the bottom
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) {
      const dateA = new Date(a.scheduledFor);
      const dateB = new Date(b.scheduledFor);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }
    return a.completed ? 1 : -1;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="outline"
          onClick={onSortToggle}
          className="flex items-center"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Sort by Date ({sortOrder === 'asc' ? 'Oldest' : 'Newest'})
        </Button>
      </div>

      <div className="space-y-2">
        {sortedTasks.map(task => (
          <TaskItem
            key={task._id}
            task={task}
            editingTask={editingTask}
            editText={editText}
            editDate={editDate}
            editTime={editTime}
            onEdit={onEdit}
            onDelete={onDelete}
            onEditSubmit={onEditSubmit}
            onEditCancel={onEditCancel}
            onEditTextChange={onEditTextChange}
            onEditDateChange={onEditDateChange}
            onEditTimeChange={onEditTimeChange}
            onToggleComplete={onToggleComplete}
            isUpcoming={isUpcoming}
            formatDateTime={formatDateTime}
          />
        ))}
        {tasks.length === 0 && (
          <p className="text-center text-muted-foreground py-4">
            No tasks yet. Add your first task above!
          </p>
        )}
      </div>
    </div>
  );
};

TaskList.propTypes = {
    tasks: PropTypes.arrayOf(TaskShape).isRequired,
    sortOrder: PropTypes.oneOf(['asc', 'desc']).isRequired,
    onSortToggle: PropTypes.func.isRequired,
    ...TaskEditableProps,
    ...TaskCallbacks
  };

export default TaskList;