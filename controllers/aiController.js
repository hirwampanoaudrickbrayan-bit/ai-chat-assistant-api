const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// Mock message storage (replace with database)
const conversationStore = {};

// Send message and get AI response
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, message } = req.body;
    const userId = req.user.id;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    // Initialize conversation if it doesn't exist
    if (!conversationStore[conversationId]) {
      conversationStore[conversationId] = [];
    }

    // Add user message
    conversationStore[conversationId].push({
      id: uuidv4(),
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Get AI response (using OpenAI API or mock response)
    const aiResponse = await getAIResponse(message, conversationStore[conversationId]);

    // Add AI response to conversation
    conversationStore[conversationId].push({
      id: uuidv4(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    });

    res.json({
      success: true,
      conversationId,
      userMessage: message,
      aiResponse,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Stream message response
exports.streamMessage = async (req, res) => {
  try {
    const { conversationId, message } = req.body;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const aiResponse = await getAIResponse(message, conversationStore[conversationId] || []);

    // Stream response in chunks
    for (let i = 0; i < aiResponse.length; i++) {
      res.write(`data: ${JSON.stringify({ chunk: aiResponse[i] })}

`);
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    res.write('data: [DONE]

');
    res.end();
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: error.message })}

`);
    res.end();
  }
};

// Get conversation history
exports.getConversationHistory = (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!conversationStore[conversationId]) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({
      success: true,
      conversationId,
      messages: conversationStore[conversationId]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete conversation
exports.deleteConversation = (req, res) => {
  try {
    const { conversationId } = req.params;

    if (conversationStore[conversationId]) {
      delete conversationStore[conversationId];
    }

    res.json({ success: true, message: 'Conversation deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// List all conversations
exports.listConversations = (req, res) => {
  try {
    const conversations = Object.keys(conversationStore).map(id => ({
      conversationId: id,
      messageCount: conversationStore[id].length,
      lastMessage: conversationStore[id][conversationStore[id].length - 1]?.content || '',
      createdAt: conversationStore[id][0]?.timestamp || new Date()
    }));

    res.json({ success: true, conversations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get AI Response (Mock implementation)
async function getAIResponse(userMessage, conversationHistory) {
  // Mock AI response - Replace with actual OpenAI API call
  const responses = [
    `I understand you said: "${userMessage}". That's interesting! How can I help you further?`,
    `Great question! "${userMessage}" is something I can definitely help with. Tell me more details.`,
    `I got it. You're asking about "${userMessage}". Let me provide you with more information.`
  ];

  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  return randomResponse;

  // To use OpenAI API, uncomment below and add your API key
  /*
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      max_tokens: 500
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
  */
}
