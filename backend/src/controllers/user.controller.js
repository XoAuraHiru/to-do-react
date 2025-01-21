const User = require('../models/user.model');
const Activity = require('../models/activity.model');
const logger = require('../config/logger');
const { log } = require('winston');

const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;

        logger.info('Updating profile', { userId: req.user._id });

        // Check if email is taken (if email is being changed)
        if (email !== req.user.email) {
            logger.info('Email is being changed', { userId: req.user._id });
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                logger.warn('Email is already taken', { userId: req.user._id });
                return res.status(400).json({ message: 'Email is already taken' });
            }
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { firstName, lastName, email },
            { new: true }
        ).select('-password');

        // Log activity
        await Activity.create({
            user: req.user._id,
            action: 'Updated profile information',
            timestamp: new Date()
        });

        logger.info('Profile updated successfully', { userId: req.user._id });
        res.json(user);
    } catch (error) {
        logger.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile' });
    }
};

const getUserActivity = async (req, res) => {
    try {
        const activities = await Activity.find({ user: req.user._id })
            .sort({ timestamp: -1 })
            .limit(20);

        logger.info('Fetched user activity', { userId: req.user._id });

        res.json(activities);
    } catch (error) {
        logger.error('Error fetching user activity:', error);
        res.status(500).json({ message: 'Error fetching user activity' });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        logger.info('Changing password', { userId: req.user._id });

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            logger.warn('Current password is incorrect', { userId: req.user._id });
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        // Log activity
        await Activity.create({
            user: req.user._id,
            action: 'Changed password',
            timestamp: new Date()
        });

        logger.info('Password changed successfully', { userId: req.user._id });
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        logger.error('Error changing password:', error);
        res.status(500).json({ message: 'Error changing password' });
    }
};

module.exports = {
    updateProfile,
    getUserActivity,
    changePassword
};