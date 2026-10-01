const express = require('express');
const { v4: uuidv4 } = require('uuid');
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');
const { validateRequest } = require('../middleware/validator');

const router = express.Router();

// Create a new conversation
router.post('/conversations', auth, (req, res) => {
  try {
    const conversationId = uuidv4();
    res.json({
      success: true,
      conversationId,
      message: 'Conversation created',
      createdAt: new Date()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send message and get AI response
router.post('/message', auth, validateRequest, aiController.sendMessage);

// Get conversation history
router.get('/conversations/:conversationId', auth, aiController.getConversationHistory);

// Delete conversation
router.delete('/conversations/:conversationId', auth, aiController.deleteConversation);

// List all conversations for user
router.get('/conversations', auth, aiController.listConversations);

// Stream response (for real-time chat)
router.post('/message/stream', auth, aiController.streamMessage);

module.exports = router;
