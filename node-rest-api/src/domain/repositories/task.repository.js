const { Task, HistorySchema} = require('../models/task.model');
const User = require('../models/user.model');


async function createTask(user, title, name_item, description) {
    try {
      console.log(user, title, description)
      const task = new Task({
        user,
        title,
        description,
        name_item
      });
      return await task.save();
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function getTasks() {
    try {
      let a = await Task.find().populate('user','email');
      return a
    } catch (err) {
      throw new Error(err.message);
    }
  }

async function getTaskById(id) {
    try {
  const task = await Task.findById(id);
  // const task = await Task.findOne({ _id: req.params.id, user: req.user._id }).populate('user');
  return task
} catch (err) {
    throw new Error(err.message);
  }
}

/**
 * 
 * @param {*} title 
 * @returns 
 */
async function getTaskByTitle(title) {
    try {
      return await Task.findOne({ title: title }).populate('user');
      
    } catch (err) {
      console.log(err)
      throw new Error(err.message);
    }
  }

  async function getTasksByUser(user_id) {
    if(!user_id)
      throw new Error("It's necessary User ID");
    try {
      return await Task.find({ user: user_id });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function updateTask(id, update) {
    try {
      update.updated_at = new Date();
      const Task = await Task.findByIdAndUpdate(id, update, {
        new: true,
      });
      return Task;
    } catch (err) {
      throw new Error(err.message);
    }
  }
  
  async function deleteTask(id) {
    try {
      const task = await Task.findById(id);
      if (!task) throw new Error('Task not found');
  
      //  Change it by Mongoose middleware to define pre- and post-save hooks that execute when a Task document is removed. (task.model)
      // delete related history documents
     //await HistorySchema.deleteMany({ task_id: task._id });
  
      const deletedTask = await Task.findByIdAndDelete(id);
      return deletedTask;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  module.exports = {
    createTask,
    getTaskById,
    getTaskByTitle,
    getTasksByUser,
    updateTask,
    deleteTask,
    getTasks
  };
  