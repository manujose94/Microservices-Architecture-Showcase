// src/api/controllers/user.controller.js

const userService = require('../../domain/services/user.service');

async function createUser(req, res) {
  try {
    const { name, email, password } = req.body;
    const user = await userService.createUser(name, email, password);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getUsers(req, res) {
  try {
    const user = await userService.getUsers();
    if (!user) {
      return res.status(404).json({ message: 'Not Users not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


async function getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  
async function getUserByEmail(req, res) {
    try {
      const { email } = req.params;
      const user = await userService.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const update = req.body;

    const updatedUser = await userService.updateUser(id, update);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateUserByEmail(req, res) {
  try {
    const { email } = req.params;
    const update = req.body;

    const updatedUser = await userService.updateUserByEmail(email, update);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}




module.exports = {
  createUser,
  getUsers,
  getUserByEmail,
  getUserById,
  updateUser,
  updateUserByEmail
};