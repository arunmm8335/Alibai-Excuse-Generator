# Alibai - Intelligent Excuse Generator

An AI-powered web application that generates context-aware, believable excuses for various situations. Built with React frontend and Node.js/Express backend.

## Features

- 🤖 **AI-Powered Excuse Generation** - Uses OpenAI GPT models for intelligent excuse creation
- 🎯 **Context-Aware** - Generates excuses based on work, school, social, or family contexts
- 🗣️ **Voice Integration** - Speech-to-text input and text-to-speech output
- 📞 **Phone Call Feature** - Twilio integration for automated excuse delivery
- 📝 **Proof Generation** - Creates fake chat logs to support excuses
- 💬 **Apology Crafting** - Generates follow-up apologies
- 📊 **History & Analytics** - Track excuse effectiveness and patterns
- 🌍 **Multi-language Support** - Generate excuses in different languages
- 👤 **User Tiers** - Free and Pro user management with API key support

## Tech Stack

### Frontend
- React 19.1.0
- Vite (Build tool)
- Tailwind CSS + DaisyUI
- React Router DOM
- Axios for API calls
- React Hot Toast for notifications

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- OpenAI API integration
- Twilio for phone calls
- CryptoJS for encryption

## Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- OpenAI API key
- Twilio account (optional, for phone call feature)

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd launchizd-excuse-generator
```

### 2. Install dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Environment Setup

Create `.env` files in both `backend/` and `frontend/` directories:

**Backend `.env**:
```env
# Database
MONGO_URI=mongodb://localhost:27017/alibai

# JWT
JWT_SECRET=your_jwt_secret_here

# OpenAI
OPENAI_API_KEY=your_openai_api_key
OPENAI_API_BASE_URL=https://api.openai.com/v1

# Encryption
ENCRYPTION_SECRET=your_encryption_secret

# Twilio (optional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Limits
FREE_TIER_LIMIT=10

# Server
PORT=5000
```

**Frontend `.env**:
```env
VITE_API_URL=http://localhost:5000
```

### 4. Start the application

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Excuses
- `POST /api/excuses/generate-stream` - Generate excuse with streaming
- `POST /api/excuses/apology` - Generate apology
- `POST /api/excuses/proof` - Generate proof
- `POST /api/excuses/save` - Save excuse to history
- `GET /api/excuses/history` - Get user's excuse history
- `PATCH /api/excuses/:id/favorite` - Toggle favorite status
- `PATCH /api/excuses/:id/rate` - Rate excuse effectiveness
- `DELETE /api/excuses/:id` - Delete excuse

### Users
- `GET /api/users/profile` - Get user profile
- `POST /api/users/upgrade` - Upgrade to Pro tier
- `POST /api/users/api-key` - Save user API key

### Calls
- `POST /api/calls/trigger` - Trigger phone call

## Project Structure

```
launchizd-excuse-generator/
├── backend/
│   ├── config/
│   │   └── db.js
│   │   ├── middleware/
│   │   │   ├── aiClient.js
│   │   │   └── authMiddleware.js
│   │   ├── models/
│   │   │   ├── Excuse.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── calls.js
│   │   │   ├── excuses.js
│   │   │   └── users.js
│   │   └── server.js
│   └── frontend/
│       ├── src/
│       │   ├── components/
│       │   │   ├── ChatInterface.jsx
│       │   │   ├── HistorySidebar.jsx
│       │   │   ├── Navbar.jsx
│       │   │   └── ...
│       │   ├── pages/
│       │   │   ├── HomePage.jsx
│       │   │   ├── LoginPage.jsx
│       │   │   └── ...
│       │   └── App.jsx
│       └── package.json
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support, please open an issue in the repository or contact the development team. 