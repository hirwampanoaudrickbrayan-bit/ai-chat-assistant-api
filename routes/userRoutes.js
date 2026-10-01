const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { validateUserInput } = require('../middleware/validator');

const router = express.Router();

// User registration
router.post('/register', validateUserInput, userController.register);

// User login
router.post('/login', userController.login);

// Get user profile
router.get('/profile', auth, userController.getProfile);

// Update user profile
router.put('/profile', auth, userController.updateProfile);

// Logout
router.post('/logout', auth, userController.logout);

// Delete user account
router.delete('/profile', auth, userController.deleteAccount);

module.exports = router;
