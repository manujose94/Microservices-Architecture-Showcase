const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the task
 *         user:
 *           type: string
 *           description: The ID of the user associated with the task
 *         title:
 *           type: string
 *           description: The title of the task
 *         description:
 *           type: string
 *           description: The description of the task
 *         name_item:
 *           type: string
 *           description: The name of the item to be searched for or acted upon
 *         action:
 *           type: string
 *           enum: [search-price]
 *           default: search-price
 *           description: The action to perform on the item
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           default: medium
 *           description: The priority level of the task
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date and time the task was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date and time the task was last updated
 *       required:
 *         - title
 *         - user
 *         - name_item
 */
const taskSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}, // reference to userSchema, default to null for anonymous users
    title: { type: String, required: true },
    description: { type: String },
    name_item: {type: String, required: true},
    action: {type: String,enum: ['search-price'], default: 'search-price'},
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  })

  taskSchema.index({ user: 1, priority: 1 })

/**
 * @swagger
 * components:
 *   schemas:
 *     History:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the task generated by MongoDB.
 *           example: 609fd45a31d84a1b16e11f37
 *         task_id:
 *           type: string
 *           description: The ID of the task associated with this history.
 *         status:
 *           type: string
 *           enum: ['created', 'in progress', 'completed']
 *           description: The status of the task when this history was created.
 *           default: created
 *         user_email:
 *           type: string
 *           description: The user email who created this history.
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date and time when this history was created.
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date and time when this history was last updated.
 *         result:
 *           type: string
 *           description: The result of the task when it was completed.
 *       required:
 *         - task_id
 *         - user_email
 *       example:
 *         _id: 609fd45a31d84a1b16e11f37
 *         task_id: 609fd43131d84a1b16e11f34
 *         user: "JohnDoe@example.com"
 *         result: "task do it by golang microservice UUID"
 *         status: "completed"
 *         created_at: "2021-05-14T18:11:30.000Z"
 *         updated_at: "2021-05-14T18:11:30.000Z"
 */
  const historySchema = new mongoose.Schema({
    task_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    status: { type: String, enum: ['created', 'in progress', 'completed'], default: 'created' },
    user_email: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date },
    result: { type: String }
  })
  
  historySchema.index({ task_id: 1, status: 1 })

  taskSchema.pre('remove', async function(next) {
    try {
      const task = this;
      // find all history documents related to this task
      const historyDocs = await historySchema.find({ task_id: task._id });
      // remove all related history documents
      await historySchema.deleteMany({ task_id: task._id });
      next();
    } catch (err) {
      next(err);
    }
  });

  const Task = mongoose.model('Task', taskSchema);
  const History = mongoose.model('HistorySchema', historySchema);

  module.exports = { Task, History};