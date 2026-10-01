# AI Chat Assistant API

A powerful and scalable AI Assistant API for chat applications. Ask anything and get intelligent responses!

## Features

✨ **Core Features**
- Real-time chat messaging
- Multiple conversations support
- User authentication & authorization
- Message history tracking
- Streaming responses for real-time chat
- JWT-based authentication

## Installation

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/hirwampanoaudrickbrayan-bit/ai-chat-assistant-api.git
   cd ai-chat-assistant-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file and add your configuration:
   ```
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   OPENAI_API_KEY=your_openai_api_key (optional)
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   For development with auto-reload:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

#### Register User
```http
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Chat Endpoints

#### Create Conversation
```http
POST /api/chat/conversations
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "success": true,
  "conversationId": "uuid-string",
  "message": "Conversation created"
}
```

#### Send Message
```http
POST /api/chat/message
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "conversationId": "uuid-string",
  "message": "Hello, what is AI?"
}
```

**Response:**
```json
{
  "success": true,
  "conversationId": "uuid-string",
  "userMessage": "Hello, what is AI?",
  "aiResponse": "AI (Artificial Intelligence) is...",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### Stream Message (Real-time)
```http
POST /api/chat/message/stream
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "conversationId": "uuid-string",
  "message": "Tell me about machine learning"
}
```

#### Get Conversation History
```http
GET /api/chat/conversations/:conversationId
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "success": true,
  "conversationId": "uuid-string",
  "messages": [
    {
      "id": "msg-uuid",
      "role": "user",
      "content": "Hello",
      "timestamp": "2024-01-15T10:30:00Z"
    },
    {
      "id": "msg-uuid",
      "role": "assistant",
      "content": "Hi there!",
      "timestamp": "2024-01-15T10:30:05Z"
    }
  ]
}
```

#### List All Conversations
```http
GET /api/chat/conversations
Authorization: Bearer YOUR_TOKEN
```

#### Delete Conversation
```http
DELETE /api/chat/conversations/:conversationId
Authorization: Bearer YOUR_TOKEN
```

### User Endpoints

#### Get Profile
```http
GET /api/users/profile
Authorization: Bearer YOUR_TOKEN
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Jane Doe"
}
```

#### Logout
```http
POST /api/users/logout
Authorization: Bearer YOUR_TOKEN
```

## Usage Example

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Create Conversation
curl -X POST http://localhost:5000/api/chat/conversations \
  -H "Authorization: Bearer YOUR_TOKEN"

# Send Message
curl -X POST http://localhost:5000/api/chat/message \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "YOUR_CONVERSATION_ID",
    "message": "What is Python?"
  }'
```

### Using JavaScript (Fetch)

```javascript
// Register
const response = await fetch('http://localhost:5000/api/users/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John',
    email: 'john@example.com',
    password: 'password123'
  })
});

const data = await response.json();
const token = data.token;

// Send Message
const msgResponse = await fetch('http://localhost:5000/api/chat/message', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    conversationId: 'YOUR_CONVERSATION_ID',
    message: 'Hello AI!'
  })
});

const result = await msgResponse.json();
console.log(result.aiResponse);
```

## Integrating OpenAI API

To use real AI responses instead of mock responses:

1. Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com)
2. Add it to `.env`:
   ```
   OPENAI_API_KEY=sk-your-api-key
   ```
3. Uncomment the OpenAI code in `controllers/aiController.js`

## Project Structure

```
ai-chat-assistant-api/
├── server.js                 # Main server file
├── package.json             # Dependencies
├── .env.example             # Environment variables template
├── README.md                # Documentation
├── routes/
│   ├── chatRoutes.js       # Chat-related routes
│   └── userRoutes.js       # User authentication routes
├── controllers/
│   ├── aiController.js     # AI chat logic
│   └── userController.js   # User management logic
└── middleware/
    ├── auth.js             # JWT authentication
    ├── errorHandler.js     # Error handling
    └── validator.js        # Input validation
```

## Testing

```bash
npm test
```

## Deployment

### Heroku
```bash
heroku create your-app-name
git push heroku main
heroku config:set JWT_SECRET=your_secret
heroku config:set OPENAI_API_KEY=your_key
```

### Docker
```bash
docker build -t ai-chat-api .
docker run -p 5000:5000 ai-chat-api
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.

## Roadmap

- [ ] MongoDB integration for persistent storage
- [ ] Real OpenAI API integration
- [ ] WebSocket support for real-time chat
- [ ] User roles and permissions
- [ ] Rate limiting
- [ ] Message encryption
- [ ] Admin dashboard
- [ ] Analytics and logging

---

**Made with ❤️ by Your Name**
