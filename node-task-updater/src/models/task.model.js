const mongoose = require('mongoose');

  const historySchema = new mongoose.Schema({
    task_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    status: { type: String, enum: ['created', 'in progress', 'completed'], default: 'created' },
    user_email: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date },
    result: { type: String }
  })
  

  const History = mongoose.model('HistorySchema', historySchema);

  module.exports = {  History};