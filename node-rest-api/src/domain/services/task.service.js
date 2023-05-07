

const taskRepository = require('../repositories/task.repository');

async function createTask(user_id, title, name_item,  description="") {
  try {
    const existingTask = await taskRepository.getTaskByTitle(title);
    if (existingTask) {
      throw new Error('Task already exists');
    }

    const newTask = await taskRepository.createTask(user_id, title, name_item, description);

    return newTask.toObject();
  } catch (err) {
    throw new Error(err.message);
  }
}

async function getTasks() {
  try {
    return await taskRepository.getTasks();
  } catch (err) {
    throw new Error(err.message);
  }
}

async function getTaskById(id) {
  try {
    return await taskRepository.getTaskById(id);
  } catch (err) {
    throw new Error(err.message);
  }
}

async function getTaskByTitle(title) {
  try {
    return await taskRepository.getTaskByTitle(title);
  } catch (err) {
    throw new Error(err.message);
  }
}

async function getTasksByUser(user_id) {
  try {
    return await taskRepository.getTasksByUser(user_id);
  } catch (err) {
    throw new Error(err.message);
  }
}

async function updateTask(id, update) {
  try {
    return await taskRepository.updateTask(id, update);
  } catch (err) {
    throw new Error(err.message);
  }
}

async function updateTaskByTitle(title, update) {
  try {
    const Task = await taskRepository.getTaskByTitle(title);
    if (!Task) {
      throw new Error('Task not found');
    }

    return await taskRepository.updateTask(Task.id, update);
  } catch (err) {
    throw new Error(err.message);
  }
}

async function deleteTask(id) {
  try {
    return await taskRepository.deleteTask(id);
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  getTaskByTitle,
  getTasksByUser,
  updateTask,
  updateTaskByTitle,
  deleteTask,
};