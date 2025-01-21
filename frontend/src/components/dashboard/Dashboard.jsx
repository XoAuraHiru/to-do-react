import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import useTasks from '@/hooks/useTasks';

import DashboardHeader from './DashboardHeader';
import TaskForm from '../tasks/TaskForm';
import TaskList from '../tasks/TaskList';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { 
    tasks, 
    isLoading, 
    error, 
    fetchTasks, 
    createTask, 
    updateTask, 
    deleteTask, 
    toggleTaskComplete, 
    sortTasks 
  } = useTasks();

  const [editState, setEditState] = useState({
    taskId: null,
    title: '',
    scheduledDate: '',
    scheduledTime: ''
  });

  const [newTaskState, setNewTaskState] = useState({
    title: '',
    scheduledDate: '',
    scheduledTime: ''
  });

  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const formatDateTime = useCallback((dateString) => {
    const options = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }, []);

  const isUpcoming = useCallback((dateString) => {
    const taskDate = new Date(dateString);
    const now = new Date();
    const diff = taskDate - now;
    return diff > 0 && diff < 24 * 60 * 60 * 1000;
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskState.title.trim() || !newTaskState.scheduledDate || !newTaskState.scheduledTime) return;

    const scheduledFor = new Date(`${newTaskState.scheduledDate}T${newTaskState.scheduledTime}`);
    await createTask({
      title: newTaskState.title.trim(),
      scheduledFor: scheduledFor.toISOString()
    });

    setNewTaskState({
      title: '',
      scheduledDate: '',
      scheduledTime: ''
    });
  };

  const handleEditSubmit = async (taskId) => {
    if (!editState.title.trim() || !editState.scheduledDate || !editState.scheduledTime) return;

    const scheduledFor = new Date(`${editState.scheduledDate}T${editState.scheduledTime}`);
    await updateTask(taskId, {
      title: editState.title.trim(),
      scheduledFor: scheduledFor.toISOString()
    });

    setEditState({
      taskId: null,
      title: '',
      scheduledDate: '',
      scheduledTime: ''
    });
  };

  const startEditing = (task) => {
    const date = new Date(task.scheduledFor);
    setEditState({
      taskId: task._id,
      title: task.title,
      scheduledDate: date.toISOString().split('T')[0],
      scheduledTime: date.toTimeString().slice(0, 5)
    });
  };

  const handleSortToggle = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    sortTasks(newOrder);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading tasks...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <Card className="max-w-4xl mx-auto">
        <DashboardHeader user={user} onLogout={logout} />
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <TaskForm
            newTask={newTaskState.title}
            scheduledDate={newTaskState.scheduledDate}
            scheduledTime={newTaskState.scheduledTime}
            isSubmitting={isLoading}
            onTaskChange={(value) => setNewTaskState(prev => ({ ...prev, title: value }))}
            onDateChange={(value) => setNewTaskState(prev => ({ ...prev, scheduledDate: value }))}
            onTimeChange={(value) => setNewTaskState(prev => ({ ...prev, scheduledTime: value }))}
            onSubmit={handleAddTask}
          />

          <TaskList
            tasks={tasks}
            sortOrder={sortOrder}
            onSortToggle={handleSortToggle}
            editingTask={editState.taskId}
            editText={editState.title}
            editDate={editState.scheduledDate}
            editTime={editState.scheduledTime}
            onEdit={startEditing}
            onDelete={deleteTask}
            onEditSubmit={handleEditSubmit}
            onEditCancel={() => setEditState({ taskId: null, title: '', scheduledDate: '', scheduledTime: '' })}
            onEditTextChange={(value) => setEditState(prev => ({ ...prev, title: value }))}
            onEditDateChange={(value) => setEditState(prev => ({ ...prev, scheduledDate: value }))}
            onEditTimeChange={(value) => setEditState(prev => ({ ...prev, scheduledTime: value }))}
            onToggleComplete={toggleTaskComplete}
            isUpcoming={isUpcoming}
            formatDateTime={formatDateTime}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;