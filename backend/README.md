# Athena's Journal Backend

🏛️ **Node.js backend server for Athena's Journal - AI-powered journaling application**

## Features

- **User Authentication**: Secure signup and login with JWT tokens
- **MongoDB Integration**: Persistent data storage for users and journal entries
- **Password Security**: bcrypt hashing with salt rounds
- **Input Validation**: Comprehensive validation using express-validator
- **CORS Support**: Configured for frontend communication
- **Greek Mythology Theming**: Athena-themed error messages and responses

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/athena-journal
   FRONTEND_URL=http://localhost:8080
   JWT_SECRET=your-secure-secret-key
   ```

4. **Start MongoDB**:
   - **Local**: Make sure MongoDB is running on your system
   - **Atlas**: Use your MongoDB Atlas connection string

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - User login
- `GET /api/user/profile` - Get user profile (protected)

### Journal Entries
- `POST /api/journal/entry` - Create new journal entry (protected)
- `GET /api/journal/entries` - Get user's journal entries (protected)

### Health Check
- `GET /api/health` - Server health status

## Database Schema

### User Model
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  journalEntries: [ObjectId],
  preferences: {
    dailyReminderTime: String,
    timezone: String
  },
  createdAt: Date,
  lastLogin: Date
}
```

### Journal Entry Model
```javascript
{
  userId: ObjectId,
  journalText: String,
  azureAnalysis: {
    sentiment: String,
    confidenceScores: Object
  },
  athenaResponse: String,
  date: String,
  timestamp: Date
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

All API responses follow this format:

**Success Response**:
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

**Error Response**:
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ] // For validation errors
}
```

## Development Notes

- **Password Requirements**: Minimum 6 characters with uppercase, lowercase, and number
- **Email Validation**: RFC compliant email validation
- **Token Expiry**: JWT tokens expire after 7 days
- **CORS**: Configured for `http://localhost:8080` (frontend)
- **Logging**: Console logging for development debugging

## Future Enhancements

- [ ] Azure AI integration for sentiment analysis
- [ ] Google Gemini API for Athena responses
- [ ] Email service for daily reminders
- [ ] File upload for journal attachments
- [ ] Rate limiting and security headers
- [ ] Comprehensive API documentation with Swagger

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or check Atlas connection string
- Verify database name in connection string
- Check network connectivity

### CORS Issues
- Verify `FRONTEND_URL` in environment variables
- Ensure frontend is running on the correct port

### Authentication Issues
- Check JWT secret is consistent
- Verify token format in Authorization header
- Ensure token hasn't expired

---

🏛️ **May Athena's wisdom guide your development journey!**
