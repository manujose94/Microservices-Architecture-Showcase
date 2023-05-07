/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *     adminAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
const AuthService = require('../../domain/services/auth.service');
const userRepository = require('../../domain/repositories/user.repository');
const secretKey = process.env.JWT_SECRET;
const authService = new AuthService(userRepository,secretKey);


async function isAuthenticateUser(req, res, next) {
  try {   
    const { email, password } = req.body;
    const token = await authService.authenticateUser(email, password);
    req.accessToken=token;
    next()
  } catch (err) {
    res.status(401).json({ message: 'Invalid credentials' });
  }
}

async function isAuthenticated(req, res, next) {
    const authToken = req.headers.authorization;
    // Get the JWT token from the authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!authToken || !token) {
      return res.status(401).json({ message: 'Authentication failed', error: 'Authentication required' });
    }
    try {
        // Verify the token with the secret key
        const decoded = await authService.verifyAccessToken(token)
        // Set user on the request object for later use
        req.user = decoded;
        next();
      } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
      }
  }

  async function isAuthorizeUser(req, res, next) {
    const authToken = req.headers.authorization;
    // Get the JWT token from the authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!authToken || !token) {
      return res.status(401).json({ message: 'Authentication failed', error: 'Authentication required' });
    }
   
    try {
        // Verify the token with the secret key
        const decoded = await authService.verifyAccessToken(token)
        // Set the user ID on the request object for later use
        req.user = decoded
        
        try{
          const role = await authService.authorizeUser(req.user.id, 'admin');
          next();
        } catch (err) {
          res.status(403).json({ error: 'Non-authorized user' });
        }
      } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
      }
  }
  
  
  module.exports = {
    isAuthenticateUser,
    isAuthenticated,
    isAuthorizeUser,
  };