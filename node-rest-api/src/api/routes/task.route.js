/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: API endpoints for managing tasks
 */
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const authMiddleware = require('../middlewares/auth.middleware');

//router.get('/tasks/user', authMiddleware.isAuthenticated, taskController.getTasksByUser);
/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get a list of all tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized request
 *       500:
 *         description: Server error
 */
router.get('/tasks', authMiddleware.isAuthenticated, taskController.getTasks);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Task object that needs to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized request
 *       500:
 *         description: Server error
 */
router.post('/tasks', authMiddleware.isAuthenticated, taskController.createTask);


/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a tasks by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the task to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized request
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */
router.get('/tasks/:id', authMiddleware.isAuthorizeUser, taskController.getTaskById);

/**
 * @swagger
 * /tasks/title/{title}:
 *   get:
 *     summary: Get a task by title (admin only)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *       - adminAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         required: true
 *         description: Title of the task to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized request
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */
router.get('/tasks/title/:title', authMiddleware.isAuthorizeUser, taskController.getTaskByTitle);
//router.get('/tasks/user/:email', authMiddleware.isAuthenticated, taskController.getTaskByUserEmail);

/**
 * @swagger
 *
 * /tasks/user/{user_id}:
 *   get:
 *     summary: Get tasks by user
 *     tags: [Tasks]
 *     description: Retrieve tasks based on the user id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user
 *         required: true
 *         description: User ID.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of tasks for the specified user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized request.
 *       404:
 *         description: User not found.
 */
router.get('/tasks/user/:user_id', authMiddleware.isAuthenticated, taskController.getTasksByUserId);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the task to update
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Task object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Task object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized request
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */
router.put('/tasks/:id', authMiddleware.isAuthorizeUser, taskController.updateTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the task to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       401:
 *         description: Unauthorized request
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */
router.delete('/tasks/:id', authMiddleware.isAuthorizeUser, taskController.deleteTask)

/**
 * @swagger
 * /tasks/launch/{id}:
 *   post:
 *     summary: Create history for a task and start it
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the task to launch
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       description: Request body for starting a task
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: The user ID associated with the task. If not provided, anonymous user will be used.
 *     responses:
 *       200:
 *         description: Successfully started the task
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message indicating success
 *                   example: "Added history of task: Task 1"
 *                 history:
 *                   $ref: '#/components/schemas/History'
 *       401:
 *         description: Unauthorized request
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */
router.post('/tasks/launch/:id', authMiddleware.isAuthenticated, taskController.startTask);


module.exports = router;