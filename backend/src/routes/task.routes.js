const express = require('express');
const router = express.Router();
const { 
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleComplete
} = require('../controllers/task.controller');

const {
  createTaskValidation,
  updateTaskValidation
} = require('../middleware/validation.middleware');

const { protect } = require('../middleware/auth.middleware');

// Protect all routes
router.use(protect);

// Get all tasks
router.get('/', getTasks);

// Create a new task
router.post('/', createTaskValidation, createTask);

// Update a task
router.put('/:id', updateTaskValidation, updateTask);

// Delete a task
router.delete('/:id', deleteTask);

// Toggle task completion status
router.patch('/:id/complete', toggleComplete);


module.exports = router;