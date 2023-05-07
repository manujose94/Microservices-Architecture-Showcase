// src/domain/repositories/user.repository.js

const User = require('../models/user.model');

async function createUser(name, email, password) {
    try {
      const user = new User({
        name,
        email,
        password,
      });
      return await user.save();
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function getUsers() {
    try {
      return await User.find({});
    } catch (err) {
      throw new Error(err.message);
    }
  }

async function getUserById(id) {
  const user = await User.findById(id);
  return user;
}

async function getUserByEmail(email) {
    try {
      return await User.findOne({ email: email });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function updateUser(id, update) {
    try {
      const user = await User.findByIdAndUpdate(id, update, {
        new: true,
      });
      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  }
  
  async function deleteUser(id) {
    try {
      const user = await User.findByIdAndDelete(id);
      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  }

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
  getUsers
};
