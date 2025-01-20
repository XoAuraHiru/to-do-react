import { find, create, findOneAndUpdate, findOneAndDelete } from '../models/task.model';
import logger from '../config/logger';
import { log } from 'winston';

// Get all tasks for a user
const getTasks = async (req, res) => {
    try {
        const tasks = await find({ user: req.user._id })
            .sort({ createdAt: -1 });

        logger.info('Tasks fetched successfully', {
            userId: req.user._id,
            count: tasks.length
        });

        res.json(tasks);
    } catch (error) {
        logger.error('Error fetching tasks', {
            error: error.message
        });
        res.status(500).json({ message: 'Error fetching tasks' });
    }
};

// Create a new task
const createTask = async (req, res) => {
    try {
        const { title } = req.body;

        const task = await create({
            title,
            user: req.user._id
        });

        logger.info('Task created successfully', {
            userId: req.user._id,
            taskId: task._id
        });

        res.status(201).json(task);
    } catch (error) {
        logger.error('Error creating task', {
            error: error.message
        });
        res.status(500).json({ message: 'Error creating task' });
    }
};

// Update a task
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;

        const task = await findOneAndUpdate(
            { _id: id, user: req.user._id },
            { title, completed },
            { new: true }
        );

        logger.info('Task updated successfully', {
            userId: req.user._id,
            taskId: task._id
        });

        if (!task) {
            logger.warn('Task not found', {
                userId: req.user._id,
                taskId: id
            });
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(task);
    } catch (error) {
        logger.error('Error updating task', {
            error: error.message
        });
        res.status(500).json({ message: 'Error updating task' });
    }
};

// Delete a task
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await findOneAndDelete({
            _id: id,
            user: req.user._id
        });

        logger.info('Task deleted successfully', {
            userId: req.user._id,
            taskId: id
        });

        if (!task) {
            logger.warn('Task not found', {
                userId: req.user._id,
                taskId: id
            });
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        logger.error('Error deleting task', {
            error: error.message
        });
        res.status(500).json({ message: 'Error deleting task' });
    }
};

export default {
    getTasks,
    createTask,
    updateTask,
    deleteTask
};