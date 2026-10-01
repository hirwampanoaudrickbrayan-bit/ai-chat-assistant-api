const { body, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const { conversationId, message } = req.body;

  if (!conversationId || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  next();
};

const validateUserInput = (req, res, next) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  next();
};

module.exports = { validateRequest, validateUserInput };
