const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const historyController = require('../controllers/history.controller');

/**
 * @swagger
 * tags:
 *   name: Histories
 *   description: API for managing histories of tasks
 */

/**
 * @swagger
 * /histories:
 *   post:
 *     summary: Create a new histories entry
 *     tags: [Histories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: string
 *               user:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Created histories entry
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/History'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized request
 *       500:
 *         description: Server error
 */
router.post('/histories', authMiddleware.isAuthorizeUser, historyController.createHistory);

/**
 * @swagger
 * /histories:
 *   get:
 *     summary: Get histories
 *     tags: [Histories]
 *     security:
 *       - bearerAuth: [admin, user]
 *       - in: query
 *         name: status
 *         description: Filter histories by status
 *         schema:
 *           type: string
 *         example: 'completed'
 *     responses:
 *       200:
 *         description: Return histories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/History'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 * components:
 *   responses:
 *     UnauthorizedError:
 *       description: Unauthorized request
 *     ForbiddenError:
 *       description: User does not have permission to perform the requested action
 *     InternalServerError:
 *       description: Server error
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       flows:
 *         implicit:
 *           authorizationUrl: https://example.com/api/oauth/dialog
 *           scopes:
 *             admin: Get all histories
 *             user: Get only own histories
 */
router.get('/histories', authMiddleware.isAuthenticated, historyController.getHistories);

/**
 * @swagger
 * /histories/{taskId}:
 *   get:
 *     summary: Get histories of a specific task
 *     tags: [Histories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the task
 *     responses:
 *       200:
 *         description: Histories of the task
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/History'
 *       401:
 *         description: Unauthorized request
 *       500:
 *         description: Server error
 */
router.get('/histories/:taskId', authMiddleware.isAuthenticated, historyController.getHistoryByTaskId);


/**
 * @swagger
 * /histories/{id}:
 *   get:
 *     summary: Get a history entry by ID
 *     tags: [Histories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the history entry
 *     responses:
 *       200:
 *         description: A history entry
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/History'
 *       401:
 *         description: Unauthorized request
 *       404:
 *         description: History entry not found
 *       500:
 *         description: Server error
 */
router.get('/history/:id', authMiddleware.isAuthorizeUser, historyController.getHistoryById);

/**
 * @swagger
 * /histories/{user_email}:
 *   get:
 *     summary: Get histories by user email
 *     tags: [Histories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_email
 *         schema:
 *           type: string
 *         required: true
 *         description: user email of histories
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               $ref: '#/components/schemas/History'
 *       401:
 *         description: Unauthorized request
 *       404:
 *         description: Histories not found
 *       500:
 *         description: Server error
 */
router.get('/histories/:user_email', authMiddleware.isAuthorizeUser, historyController.getHistoriesByEmail);


module.exports = router;