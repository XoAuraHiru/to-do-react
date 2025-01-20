const Task = require('../models/task.model');
const logger = require('../config/logger');

// Get all tasks for a user
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id })
      .sort({ scheduledFor: -1 });
    
    res.json(tasks);
  } catch (error) {
    logger.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, scheduledFor } = req.body;
    
    if (!scheduledFor) {
      return res.status(400).json({ message: 'Scheduled date and time is required' });
    }

    const task = await Task.create({
      title,
      scheduledFor: new Date(scheduledFor),
      user: req.user._id
    });
    
    logger.info('Task created successfully', { taskId: task._id });
    res.status(201).json(task);
  } catch (error) {
    logger.error('Error creating task:', error);
    res.status(500).json({ message: 'Error creating task: ' + error.message });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, scheduledFor } = req.body;
    
    if (!scheduledFor) {
      return res.status(400).json({ message: 'Scheduled date and time is required' });
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { 
        title,
        scheduledFor: new Date(scheduledFor)
      },
      { new: true }
    );
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    logger.info('Task updated successfully', { taskId: task._id });
    res.json(task);
  } catch (error) {
    logger.error('Error updating task:', error);
    res.status(500).json({ message: 'Error updating task' });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findOneAndDelete({
      _id: id,
      user: req.user._id
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    logger.info('Task deleted successfully', { taskId: id });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    logger.error('Error deleting task:', error);
    res.status(500).json({ message: 'Error deleting task' });
  }
};

// Toggle task completion status
const toggleComplete = async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    
    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { completed },
      { new: true }
    );

    logger.info('Task completion status updated', { taskId: id, completed });
    
    if (!task) {
      logger.error('Task not found');
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    logger.error('Error updating task completion status:', error);
    res.status(500).json({ message: 'Error updating task completion status' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleComplete
};