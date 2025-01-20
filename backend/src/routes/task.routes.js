const express = require('express');
const router = express.Router();
const { 
  getTasks,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/task.controller');
const { protect } = require('../middleware/auth.middleware');
const { body } = require('express-validator');

// Validation middleware
const validateTask = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ max: 100 })
    .withMessage('Task title must be less than 100 characters')
];

// All routes are protected
router.use(protect);

// Get all tasks
router.get('/', getTasks);

// Create a new task
router.post('/', validateTask, createTask);

// Update a task
router.put('/:id', validateTask, updateTask);

// Delete a task
router.delete('/:id', deleteTask);

module.exports = router;