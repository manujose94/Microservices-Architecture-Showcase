const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
/**
 * Contains methods for authenticating and authorizing users.
 */
class AuthService {

    constructor(userRepository, secretKey) {
      this.userRepository = userRepository;
      this.secretKey = secretKey;
    }
  /**
   * Authenticates a user with their email and password and returns an access token.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @returns {Promise<Object>} - An object containing the user's access token.
   * @throws {Error} - If the email or password is invalid.
   */
    async authenticateUser(email, password) {
      const user = await this.userRepository.getUserByEmail(email);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Automatically hashes the user's input password before comparing it with the stored hashed password.
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }
      const accessToken = jwt.sign({ id: user.id , email: user.email, role: user.role  }, this.secretKey, { expiresIn: '2h' });
      return { accessToken };
    }
  
  /**
   * Authorizes a user based on their user ID and role.
   * @param {string} userId - The user's ID.
   * @param {string} role - The user's role.
   * @returns {Promise<Object>} - An object containing the user's role.
   * @throws {Error} - If the user is not authorized.
   */
    async authorizeUser(userId, role) {
      const user = await this.userRepository.getUserById(userId);
      if (!user) {
        throw new Error('Non-authorized user');
      }
      if (user.role !== role) {
        throw new Error('User is not authorized');
      }
      return { user };
    }
   /**
   * Verifies a user's access token and returns the decoded token.
   * @param {string} accessToken - The user's access token.
   * @returns {Promise<Object>} - An object containing the decoded access token.
   * @throws {Error} - If the access token is invalid.
   */
    async verifyAccessToken(accessToken) {
      try {
        const decodedToken = jwt.verify(accessToken, this.secretKey);
        return decodedToken;
      } catch (err) {
        throw new Error('Invalid access token');
      }
    }
  }
  
  module.exports = AuthService;