const { History, Task }= require('../models/task.model');

async function createHistory(taskId, status, user_email, result) {
    try {
      const history = new History({
        task_id: taskId,
        status,
        user_email,
        result
      });
      return await history.save();
    } catch (err) {
      throw new Error(err.message);
    }
  }
  
  async function getAllHistories() {
    try {
      return await History.find({});
    } catch (err) {
      throw new Error(err.message);
    }
  }
  
  async function getHistoryById(id) {
    try {
        const history = await History.findById(id);
        return history;
    } catch (err) {
        throw new Error(err.message);
    }
  }


  

  async function getHistoryByTaskId(taskId) {
    try {
      return await History.find({ task_id: taskId }).sort('-created_at');
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function getHistoryByTaskTitle(title) {
    try {
      const tasks = await Task.find({ title: new RegExp(title, 'i') }).select('_id');
      const taskIds = tasks.map(task => task._id);
      return await History.find({ task_id: { $in: taskIds } }).sort('-created_at');
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function getHistoriesByEmail(user_email) {
    try {
      
      return await History.find({ user_email: user_email }).sort('-created_at');
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function getHistoriesByStatus(status) {
    try {
      
      return await History.find({ status: status }).sort('-updated_at');
    } catch (err) {
      throw new Error(err.message);
    }
  }
  
  
  async function updateHistory(id, update) {
    update.updated_at = new Date();
    try {
      const history = await History.findByIdAndUpdate(id, update, {
        new: true,
      });
      return history;
    } catch (err) {
      throw new Error(err.message);
    }
  }
  
  async function deleteHistory(id) {
    try {
      const history = await History.findByIdAndDelete(id);
      return history;
    } catch (err) {
      throw new Error(err.message);
    }
  }
  
  module.exports = {
    createHistory,
    getAllHistories,
    getHistoryById,
    getHistoryByTaskId,
    updateHistory,
    deleteHistory,
    getHistoryByTaskTitle,
    getHistoriesByStatus,
    getHistoriesByEmail
  };