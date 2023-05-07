const historyRepository = require('../repositories/history.repository');


async function createHistory(taskId, status, user_email, result) {
  try {
   
    const newHistory = await historyRepository.createHistory(taskId, status, user_email, result);

    return newHistory.toObject();
  } catch (err) {
    throw new Error(err.message);
  } 
}

async function getAllHistories() { 
  try {
    return await historyRepository.getAllHistories();
  } catch (err) {
    throw new Error(err.message);
  }
}


async function getHistoryById(id) {
  try {
    return await historyRepository.getHistoryById(id);
  } catch (err) {
    throw new Error(err.message);
  }
}


async function updateHistory(id, update) {
  try {
    return await historyRepository.updateHistory(id, update);
  } catch (err) {
    throw new Error(err.message);
  }
}

async function updateHistoryResultAndStatus(id, result, status) {
  try {
    const update = { result, status };
    const history = await historyRepository.getHistoryById(id);
    if (!history) {
      throw new Error('History not found');
    }

    const updatedHistory = await historyRepository.updateHistory(id, update);

    return updatedHistory.toObject();
  } catch (err) {
    throw new Error(err.message);
  }
}


async function deleteHistory(id) {
  try {
    return await historyRepository.deleteHistory(id);
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
  updateHistoryResultAndStatus
};