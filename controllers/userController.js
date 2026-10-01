const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock user storage (replace with database)
const users = {};

// Register user
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (users[email]) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = Object.keys(users).length + 1;

    users[email] = {
      id: userId,
      name,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };

    const token = jwt.sign({ id: userId, email }, process.env.JWT_SECRET || 'secret_key', {
      expiresIn: '24h'
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: { id: userId, name, email }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users[email];
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET || 'secret_key', {
      expiresIn: '24h'
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get user profile
exports.getProfile = (req, res) => {
  try {
    const userId = req.user.id;
    const user = Object.values(users).find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    const user = Object.values(users).find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) user.name = name;

    res.json({
      success: true,
      message: 'Profile updated',
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Logout
exports.logout = (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

// Delete account
exports.deleteAccount = (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = Object.keys(users).find(email => users[email].id === userId);

    if (userEmail) {
      delete users[userEmail];
    }

    res.json({ success: true, message: 'Account deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
