const express = require('express');
const Task = require('../Model/taskModel.js');
const authMiddleware = require('../middleWare/authMiddleware.js');

const router = express.Router();

// Get all tasks (admin sees all, regular user sees their own)
router.get('/', authMiddleware, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'admin') {
      tasks = await Task.find().populate('user', 'username'); // Admin sees all tasks with user info
    } else {
      tasks = await Task.find({ user: req.user.id }).populate('user', 'username'); // Regular user sees their own tasks
    }
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// Create a task (for regular users)
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, dueDate, status } = req.body;
  try {
    const task = new Task({
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
      status: status || 'TODO',
      user: req.user.id,
    });
    await task.save();
    await task.populate('user', 'username'); // Populate user before sending response
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// Update a task (for regular users)
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, description, status, dueDate } = req.body;
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
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

// Delete a task (for regular users)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
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