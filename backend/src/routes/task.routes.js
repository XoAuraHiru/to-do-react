import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/task.controller';
import { protect } from '../middleware/auth.middleware';
import { body } from 'express-validator';

const router = Router();

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

export default router;