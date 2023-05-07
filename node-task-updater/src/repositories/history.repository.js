const { History }= require('../models/task.model');

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

  async function getHistoriesByEmail(user_email) {
    try {
      
      return await History.find({ user_email: user_email }).sort('-created_at');
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
    updateHistory,
    deleteHistory,
    getHistoriesByEmail
  };