/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           format: email
 *           description: The email of the user
 *         role:
 *           type: string
 *           enum: [admin, registered, invited]
 *           description: The role of the user
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was last updated
 *       required:
 *         - name
 *         - email
 *         - password
 */
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'registered', 'invited'], // possible values for the "type" field
    default: 'registered', // default value for the "type" field
  },
  createdAt: {
    type: Date,
    default: Date.now, // default value for the "createdAt" field
  },
  updatedAt: {
    type: Date,
    default: Date.now, // default value for the "updatedAt" field
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;