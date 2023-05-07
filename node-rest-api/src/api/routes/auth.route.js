/**
 * @swagger
 * tags:
 *   name: Login
 *   description: API endpoints for managing login
 */


const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
/**
 * @swagger
 *
 * /login:
 *   post:
 *     summary: Authenticate user
 *     description: Authenticate user with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns an access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token for authenticated user
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */
router.post('/login', authMiddleware.isAuthenticateUser, (req, res) => {
  res.status(200).json(req.accessToken);
});

module.exports = router;

