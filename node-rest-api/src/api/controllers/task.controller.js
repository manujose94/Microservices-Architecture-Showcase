const taskService = require('../../domain/services/task.service');
const historyService = require('../../domain/services/history.service');

async function createTask(req, res) {
  try {
    const { user } = req;
    const { title, name_item, description } = req.body;
    const task = await taskService.createTask(user.id, title,name_item, description);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getTasks(req, res) {
  try {
    const task = await taskService.getTasks();
    if (!task) {
      return res.status(404).json({ message: 'Not Tasks not found' });
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


async function getTaskById(req, res) {
    try {
      const { id } = req.params;
      const task = await taskService.getTaskById(id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.status(200).json(task);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  
async function getTaskByTitle(req, res) {
    try {
      const { title } = req.params;
      const task = await taskService.getTaskByTitle(title);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.status(200).json(task);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
}

async function getTasksByUser(req, res) {
  try {
    const { user } = req;
    console.log(user)
    const task = await taskService.getTasksByUser(user.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getTasksByUserId(req, res) {
  try {
    const { user_id } = req.params;
    const task = await taskService.getTasksByUser(user_id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const update = req.body;

    const updatedTask = await taskService.updateTask(id, update);
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateTaskByTitle(req, res) {
  try {
    const { title } = req.params;
    const update = req.body;

    const updatedTask = await taskService.updateTaskByTitle(title, update);
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


async function deleteTask(req, res, next) {
    try {
      const taskId = req.params.id;
      await taskService.deleteTask(taskId);
      res.sendStatus(204);
    } catch (err) {
    res.status(500).json({ message: err.message });
    }
  }

const sendToKafka = require('../../domain/kafka/kafka').sendToKafka;


  async function startTask(req, res) {
    try {
     
   
      const { id } = req.params;
      const {user} = req;
      const task = await taskService.getTaskById(id);
      
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      let history=await historyService.createHistory(task._id, "created", user.email)
      if (!history) {
        return res.status(404).json({ message: 'history not created' });
      }

      const messageTask = {
        id: history._id,
        title: task.title,
        name_item: task.name_item,
        task_id: task._id,
        status: history.status,
        result: null,
      };
  
      const payload = {
        value: JSON.stringify(messageTask),
      };
  
      await sendToKafka(payload);
      
      // Simulate latency response for some service
      //const timer = ms => new Promise( res => setTimeout(res, ms));
      //await timer(1000)

      res.status(200).json({message: `Added history of task: ${task.title}`, history: history});
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
}


module.exports = {
  createTask,
  getTasks,
  getTaskByTitle,
  getTaskById,
  getTasksByUser,
  getTasksByUserId,
  updateTask,
  updateTaskByTitle,
  deleteTask,
  startTask
};