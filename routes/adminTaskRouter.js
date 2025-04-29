const express = require('express');
const Task = require('../Model/taskModel.js');
const User = require('../Model/userModel.js');
const authMiddleware = require('../middleWare/authMiddleware.js');
const { ObjectId } = require('mongoose').Types;

const router = express.Router();

// Create a task (for admins, can assign to any user)
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, dueDate, status, userId } = req.body;
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    if (!userId || !ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Valid user ID is required' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const task = new Task({
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
      status: status || 'TODO',
      user: userId,
    });
    await task.save();
    await task.populate('user', 'username'); // Populate user before sending response
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// Update a task (for admins, can update any task)
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, description, status, dueDate, userId } = req.body;
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (userId) {
      if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      task.user = userId;
    }
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.dueDate = dueDate ? new Date(dueDate) : task.dueDate;
    await task.save();
    await task.populate('user', 'username'); // Populate user before sending response
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// Delete a task (for admins, can delete any task)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

module.exports = router;