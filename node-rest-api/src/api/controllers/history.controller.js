const historyService = require('../../domain/services/history.service');

async function createHistory(req, res, next) {
  try {
    const { taskId, user, status } = req.body;
    const newHistory = await historyService.createHistory(taskId, user, status);
    res.status(201).json(newHistory);
  } catch (err) {
    next(err);
  }
}

async function getHistories(req, res, next) {
  try {
    const { role, email } = req.user;

    let histories;
    if (role === 'admin') {
      histories = await historyService.getAllHistories();
    } else {
      histories = await historyService.getHistoriesByEmail(email);
    }
    if (req.query.status) {
      histories = histories.filter(history => history.status === req.query.status);
    }
    res.status(200).json(histories);
  } catch (err) {
    next(err);
  }
}

async function getHistoryByTaskId(req, res, next) {
  try {
    const { taskId } = req.params;
    const histories = await historyService.getHistoryByTaskId(taskId);
    res.status(200).json(histories);
  } catch (err) {
    next(err);
  }
}

async function getHistoryById(req, res, next) {
  try {
    const { id } = req.params;
    const history = await historyService.getHistoryById(id);
    res.status(200).json(history);
  } catch (err) {
    next(err);
  }
}

async function getHistoryByTaskTitle(req, res, next) {
  try {
    const { title } = req.params;
    const history = await historyService.getHistoryByTaskTitle(title);
    res.status(200).json(history);
  } catch (err) {
    next(err);
  }
}

async function getHistoriesByEmail(req, res, next) {
    try {
      const { email } = req.params;
      const history = await historyService.getHistoriesByEmail(email);
      res.status(200).json(history);
    } catch (err) {
      next(err);
    }
  }

  async function getCompletedHistories(req, res, next) {
    try {
      const { role, email } = req.user;
      const { status } = req.params;
      const history = await historyService.getHistoriesByStatus('completed');
      res.status(200).json(history);
    } catch (err) {
      next(err);
    }
  }

async function updateHistory(req, res, next) {
  try {
    const { id } = req.params;
    const update = req.body;
    const updatedHistory = await historyService.updateHistory(id, update);
    res.status(200).json(updatedHistory);
  } catch (err) {
    next(err);
  }
}

async function deleteHistory(req, res, next) {
  try {
    const { id } = req.params;
    await historyService.deleteHistory(id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createHistory,
  getHistories,
  getHistoryByTaskId,
  getHistoryById,
  getHistoryByTaskTitle,
  getCompletedHistories,
  updateHistory,
  deleteHistory,
  getHistoriesByEmail
};