const mongoose = require('mongoose');

    const taskSchema = new mongoose.Schema({
      title: { type: String, required: true },
      description: { type: String },
      completed: { type: Boolean, default: false },
      status: { type: String, enum: ['TODO', 'IN PROGRESS', 'CLOSED'], default: 'TODO' },
      dueDate: { type: Date, default: null },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    }, { timestamps: true });

    module.exports = mongoose.model('Task', taskSchema);