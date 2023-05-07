/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for managing users
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: User object that needs to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized request
 *       500:
 *         description: Server error
 */
router.post('/users', authMiddleware.isAuthorizeUser, userController.createUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a list of all users (Only admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized request
 *       500:
 *         description: Server error
 */
router.get('/users', authMiddleware.isAuthorizeUser, userController.getUsers);

/**
 * @swagger
 * /users:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: User object that needs to be updated
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized request
 *       500:
 *         description: Server error
 */
router.put('/users', authMiddleware.isAuthorizeUser, userController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of user to fetch
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized request
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */ 
router.get('/users/:id', authMiddleware.isAuthenticated, userController.getUserById);


module.exports = router;