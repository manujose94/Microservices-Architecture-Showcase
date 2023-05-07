// src/domain/services/user.service.js

const bcrypt = require('bcryptjs');


const userRepository = require('../repositories/user.repository');

async function createUser(name, email, password) {
  try {
    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userRepository.createUser(name, email, hashedPassword);

    return newUser.toObject();
  } catch (err) {
    throw new Error(err.message);
  }
}

async function getUsers() {
  try {
    return await userRepository.getUsers();
  } catch (err) {
    throw new Error(err.message);
  }
}

async function getUserById(id) {
  try {
    return await userRepository.getUserById(id);
  } catch (err) {
    throw new Error(err.message);
  }
}

async function getUserByEmail(email) {
  try {
    return await userRepository.getUserByEmail(email);
  } catch (err) {
    throw new Error(err.message);
  }
}

async function updateUser(id, update) {
  try {
    return await userRepository.updateUser(id, update);
  } catch (err) {
    throw new Error(err.message);
  }
}

async function updateUserByEmail(email, update) {
  try {
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    return await userRepository.updateUser(user.id, update);
  } catch (err) {
    throw new Error(err.message);
  }
}

async function deleteUser(id) {
  try {
    return await userRepository.deleteUser(id);
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  updateUserByEmail,
  deleteUser,
};