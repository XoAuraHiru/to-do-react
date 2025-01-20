import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import taskService from '@/services/task.service';

import DashboardHeader from './DashboardHeader';
import TaskForm from '../tasks/TaskForm';
import TaskList from '../tasks/TaskList';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [state, setState] = useState({
    tasks: [],
    newTask: '',
    scheduledDate: '',
    scheduledTime: '',
    error: '',
    editingTask: null,
    editText: '',
    editDate: '',
    editTime: '',
    sortOrder: 'desc',
    isLoading: false,
    isSubmitting: false
  });

  const fetchTasks = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: '' }));
    const result = await taskService.getAllTasks();
    setState(prev => ({
      ...prev,
      isLoading: false,
      tasks: result.success ? result.tasks : prev.tasks,
      error: result.success ? '' : result.error
    }));
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!state.newTask.trim() || !state.scheduledDate || !state.scheduledTime || state.isSubmitting) return;

    setState(prev => ({ ...prev, isSubmitting: true, error: '' }));
    
    const scheduledFor = new Date(`${state.scheduledDate}T${state.scheduledTime}`);
    const result = await taskService.createTask({
      title: state.newTask.trim(),
      scheduledFor: scheduledFor.toISOString()
    });
    
    setState(prev => ({
      ...prev,
      isSubmitting: false,
      tasks: result.success ? [result.task, ...prev.tasks] : prev.tasks,
      newTask: result.success ? '' : prev.newTask,
      scheduledDate: result.success ? '' : prev.scheduledDate,
      scheduledTime: result.success ? '' : prev.scheduledTime,
      error: result.success ? '' : result.error
    }));
  };

  const handleDeleteTask = async (taskId) => {
    const result = await taskService.deleteTask(taskId);
    setState(prev => ({
      ...prev,
      tasks: result.success ? prev.tasks.filter(task => task._id !== taskId) : prev.tasks,
      error: result.success ? '' : result.error
    }));
  };

  const handleEditTask = async (taskId) => {
    if (!state.editText.trim() || !state.editDate || !state.editTime) {
      setState(prev => ({ ...prev, editingTask: null }));
      return;
    }

    const scheduledFor = new Date(`${state.editDate}T${state.editTime}`);
    const result = await taskService.updateTask(taskId, {
      title: state.editText.trim(),
      scheduledFor: scheduledFor.toISOString()
    });
    
    setState(prev => ({
      ...prev,
      tasks: result.success ? prev.tasks.map(task => 
        task._id === taskId ? result.task : task
      ) : prev.tasks,
      editingTask: null,
      error: result.success ? '' : result.error
    }));
  };

  const handleToggleComplete = async (taskId, completed) => {
    const result = await taskService.toggleComplete(taskId, completed);
    
    setState(prev => ({
      ...prev,
      tasks: result.success ? prev.tasks.map(task => 
        task._id === taskId ? { ...task, completed: result.task.completed } : task
      ) : prev.tasks,
      error: result.success ? '' : result.error
    }));
  };

  const startEditing = (task) => {
    const date = new Date(task.scheduledFor);
    setState(prev => ({
      ...prev,
      editingTask: task._id,
      editText: task.title,
      editDate: date.toISOString().split('T')[0],
      editTime: date.toTimeString().slice(0, 5)
    }));
  };

  const toggleSort = () => {
    setState(prev => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
      tasks: [...prev.tasks].sort((a, b) => {
        const dateA = new Date(a.scheduledFor);
        const dateB = new Date(b.scheduledFor);
        return prev.sortOrder === 'asc' ? dateB - dateA : dateA - dateB;
      })
    }));
  };

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
    return diff > 0 && diff < 24 * 60 * 60 * 1000; // Within next 24 hours
  }, []);

  if (state.isLoading) {
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
          {state.error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          <TaskForm
            newTask={state.newTask}
            scheduledDate={state.scheduledDate}
            scheduledTime={state.scheduledTime}
            isSubmitting={state.isSubmitting}
            onTaskChange={(value) => setState(prev => ({ ...prev, newTask: value }))}
            onDateChange={(value) => setState(prev => ({ ...prev, scheduledDate: value }))}
            onTimeChange={(value) => setState(prev => ({ ...prev, scheduledTime: value }))}
            onSubmit={handleAddTask}
          />

          <TaskList
            tasks={state.tasks}
            sortOrder={state.sortOrder}
            onSortToggle={toggleSort}
            editingTask={state.editingTask}
            editText={state.editText}
            editDate={state.editDate}
            editTime={state.editTime}
            onEdit={startEditing}
            onDelete={handleDeleteTask}
            onEditSubmit={handleEditTask}
            onEditCancel={() => setState(prev => ({ ...prev, editingTask: null }))}
            onEditTextChange={(value) => setState(prev => ({ ...prev, editText: value }))}
            onEditDateChange={(value) => setState(prev => ({ ...prev, editDate: value }))}
            onEditTimeChange={(value) => setState(prev => ({ ...prev, editTime: value }))}
            onToggleComplete={handleToggleComplete}
            isUpcoming={isUpcoming}
            formatDateTime={formatDateTime}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;