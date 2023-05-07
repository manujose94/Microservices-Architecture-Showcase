const AuthService = require('./auth.service');
const UserRepository = require('../repositories/user.repository');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

jest.mock('../repositories/user.repository');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');

describe('AuthService', () => {
  let authService;

  beforeEach(() => {
    authService = new AuthService();
  });

  describe('authenticateUser', () => {
    it('should return an access token for a valid user', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const user = { id: 1, email, password: '$2b$10$KWwK5H5fd5BU0qSki07jReIxZSCTY.GYvfA/lQLl4B63/Utrw4MSW' };
      jest.spyOn(UserRepository.prototype, 'findByEmail').mockResolvedValue(user);
      const result = await authService.authenticateUser(email, password);
      expect(result.accessToken).toBeDefined();
    });
    
      it('should return an access token for a valid user', async () => {
        const email = 'test@example.com';
        const password = 'password';
        const user = { id: 1, email, password: '$2b$10$KWwK5H5fd5BU0qSki07jReIxZSCTY.GYvfA/lQLl4B63/Utrw4MSW' };
        jest.spyOn(UserRepository.prototype, 'findByEmail').mockResolvedValue(user);
        const result = await authService.authenticateUser(email, password);
        expect(result.accessToken).toBeDefined();
      });


      it('should throw an error for an invalid email', async () => {
        const email = 'test@example.com';
        const password = 'password';
        jest.spyOn(UserRepository.prototype, 'findByEmail').mockResolvedValue(null);
        await expect(authService.authenticateUser(email, password)).rejects.toThrow('Invalid email or password');
      });

      it('should throw an error for an invalid password', async () => {
        const email = 'test@example.com';
        const password = 'password';
        const user = { id: 1, email, password: '$2b$10$KWwK5H5fd5BU0qSki07jReIxZSCTY.GYvfA/lQLl4B63/Utrw4MSW' };
        jest.spyOn(UserRepository.prototype, 'findByEmail').mockResolvedValue(user);
        await expect(authService.authenticateUser(email, 'wrongPassword')).rejects.toThrow('Invalid email or password');
      });

    });

    //Maybe wrong
    describe('login', () => {
      it('should return a token when given valid credentials', async () => {
        // Arrange
        const email = 'test@example.com';
        const password = 'password';
        const user = { id: 1, email, password: 'hashed_password' };
        UserRepository.findByEmail.mockResolvedValue(user);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockImplementation((payload, secret) => `JWT ${payload.email}`);

        // Act
        const token = await AuthService.login(email, password);

        // Assert
        expect(UserRepository.findByEmail).toHaveBeenCalledWith(email);
        expect(bcrypt.compare).toHaveBeenCalledWith(password, 'hashed_password');
        expect(jwt.sign).toHaveBeenCalledWith({ email }, process.env.JWT_SECRET);
        expect(token).toEqual('JWT test@example.com');
      });

      it('should throw an error when given invalid credentials', async () => {
        // Arrange
        const email = 'test@example.com';
        const password = 'password';
        const user = { id: 1, email, password: 'hashed_password' };
        UserRepository.findByEmail.mockResolvedValue(user);
        bcrypt.compare.mockResolvedValue(false);

        // Act and Assert
        await expect(AuthService.login(email, password)).rejects.toThrow('Invalid credentials');
      });

      it('should throw an error when no user is found with the given email', async () => {
        // Arrange
        const email = 'test@example.com';
        UserRepository.findByEmail.mockResolvedValue(null);

        // Act and Assert
        await expect(AuthService.login(email, 'password')).rejects.toThrow('Invalid credentials');
      });
    });
  });
