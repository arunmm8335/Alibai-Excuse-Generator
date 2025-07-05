# Alibai - The Intelligent Excuse Generator 🤖

> **A full-stack, AI-powered web application that generates high-quality, believable excuses with advanced features including real-time streaming, community wall, moderator panel, and Twilio integration.**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com/)

## 🌟 Features

### 🤖 **AI-Powered Excuse Generation**
- **Real-time streaming** responses from OpenAI GPT models
- **Context-aware** excuses for work, school, social, and family situations
- **Multi-language support** with excuse generation in different languages
- **Pro-tier API key management** for unlimited usage

### 📞 **Advanced Communication Features**
- **Twilio phone call integration** for real-time excuse delivery
- **Fake call generation** with customizable scenarios
- **Proof generation** - creates fake chat logs to support excuses
- **Apology crafting** - generates follow-up apologies

### 👥 **Community & Social Features**
- **Community wall** to share and discover excuses
- **Like and comment system** on public excuses
- **User profiles** with public/private excuse sharing
- **Moderator panel** for content management
- **Report system** for inappropriate content

### 🎨 **Modern UI/UX**
- **Responsive design** that works on all devices
- **Dark/Light theme** support with theme switching
- **Beautiful animations** and smooth transitions
- **Accessibility features** for inclusive design
- **FontAwesome icons** throughout the interface

### 🔐 **Security & User Management**
- **JWT authentication** with secure token management
- **User tiers** (Free/Pro) with different limits
- **Encrypted API key storage** for Pro users
- **Rate limiting** and security middleware
- **Input validation** and sanitization

### 🐳 **Deployment Ready**
- **Docker support** with multi-stage builds
- **Docker Compose** for easy local development
- **Production-ready** configuration
- **Health checks** and monitoring
- **Environment-based** configuration

## 🛠️ Tech Stack

### **Frontend**
- **React 19.1.0** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS + DaisyUI** - Utility-first styling
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Beautiful notifications
- **FontAwesome** - Icon library

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB + Mongoose** - Database and ODM
- **JWT** - Authentication tokens
- **OpenAI API** - AI excuse generation
- **Twilio** - Phone call integration
- **CryptoJS** - Encryption utilities

### **DevOps & Tools**
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **GitHub Actions** - CI/CD (ready to implement)
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🚀 Quick Start

### **Option 1: Docker (Recommended)**

```bash
# Clone the repository
git clone https://github.com/arunmm8335/Alibai-Excuse-Generator.git
cd Alibai-Excuse-Generator

# Start with Docker Compose
docker compose up --build

# Access the application
# Frontend: http://localhost
# Backend: http://localhost:5000
```

### **Option 2: Local Development**

```bash
# Clone the repository
git clone https://github.com/arunmm8335/Alibai-Excuse-Generator.git
cd Alibai-Excuse-Generator

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Start backend (in backend directory)
cd ../backend
npm start

# Start frontend (in frontend directory)
cd ../frontend
npm run dev
```

## ⚙️ Environment Setup

### **Backend Configuration**

Create a `.env` file in the `backend/` directory:

```env
# Database
MONGO_URI=mongodb://localhost:27017/alibai

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
OPENAI_API_BASE_URL=https://api.openai.com/v1

# User Limits
FREE_TIER_LIMIT=10
ENCRYPTION_SECRET=your-encryption-secret-key

# Twilio (Optional - for phone calls)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server Configuration
PORT=5000
NODE_ENV=development
```

### **Frontend Configuration**

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000
```

## 📱 Usage Guide

### **1. Registration & Login**
- Create a new account or login with existing credentials
- Free tier includes 10 AI calls per day
- Upgrade to Pro for unlimited usage

### **2. Generate Excuses**
- Type your situation (e.g., "I'm late for work")
- Select context (work, school, social, family)
- Choose urgency level
- Get AI-generated excuses in real-time

### **3. Advanced Features**
- **Phone Calls**: Get fake calls with your excuses
- **Proof Generation**: Create fake chat logs
- **Community**: Share and discover excuses
- **Profile Management**: Customize your experience

### **4. Community Features**
- Browse public excuses on the community wall
- Like and comment on others' excuses
- Share your own excuses publicly
- Report inappropriate content

## 🏗️ Project Structure

```
Alibai-Excuse-Generator/
├── backend/                 # Node.js/Express backend
│   ├── config/             # Database configuration
│   │   └── db.js
│   │   ├── middleware/
│   │   │   ├── aiClient.js    # OpenAI client management
│   │   │   ├── authMiddleware.js # JWT authentication
│   │   │   ├── errorHandler.js
│   │   │   ├── logger.js
│   │   │   ├── rateLimiter.js
│   │   │   ├── security.js
│   │   │   └── validation.js
│   │   ├── models/            # MongoDB schemas
│   │   │   ├── Excuse.js      # Excuse model
│   │   │   └── User.js        # User model
│   │   ├── routes/            # API endpoints
│   │   │   ├── auth.js        # Authentication routes
│   │   │   ├── calls.js       # Phone call routes
│   │   │   ├── excuses.js     # Excuse generation
│   │   │   └── users.js       # User management
│   │   ├── tests/
│   │   │   ├── auth.test.js
│   │   │   └── setup.js
│   │   └── server.js          # Express server
│   └── frontend/              # React frontend
│       ├── src/
│       │   ├── components/    # React components
│       │   │   ├── BackgroundSelector.jsx
│       │   │   ├── ChatInterface.jsx
│       │   │   ├── ExcuseChoices.jsx
│       │   │   ├── FakeCallScreen.jsx
│       │   │   ├── Footer.jsx
│       │   │   ├── HistorySidebar.jsx
│       │   │   ├── Navbar.jsx
│       │   │   ├── ProofDisplay.jsx
│       │   │   ├── ProtectedRoute.jsx
│       │   │   ├── SettingsSidebar.jsx
│       │   │   └── SkeletonCard.jsx
│       │   ├── context/       # React context
│       │   │   └── ThemeContext.jsx
│       │   ├── pages/         # Page components
│       │   │   ├── AboutPage.jsx
│       │   │   ├── CommunityWallPage.jsx
│       │   │   ├── ContactPage.jsx
│       │   │   ├── EditProfilePage.jsx
│       │   │   ├── HomePage.jsx
│       │   │   ├── LoginPage.jsx
│       │   │   ├── ModeratorPanel.jsx
│       │   │   ├── ProfilePage.jsx
│       │   │   └── RegisterPage.jsx
│       │   └── App.jsx
│       └── package.json
├── docker-compose.yml     # Docker orchestration
├── Dockerfile            # Production Dockerfile
└── README.md            # This file
```

## 🔌 API Endpoints

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### **Excuse Generation**
- `POST /api/excuses/generate-stream` - Stream excuse generation
- `POST /api/excuses/apology` - Generate apology
- `POST /api/excuses/proof` - Generate proof
- `POST /api/excuses/save` - Save excuse to history

### **User Management**
- `GET /api/users/profile` - Get user profile
- `PATCH /api/users/profile` - Update profile
- `POST /api/users/upgrade` - Upgrade to Pro
- `POST /api/users/api-key` - Save API key

### **Community Features**
- `GET /api/excuses/community` - Get public excuses
- `POST /api/excuses/:id/like` - Like an excuse
- `POST /api/excuses/:id/report` - Report excuse
- `POST /api/excuses/:id/comment` - Add comment

### **Phone Calls**
- `POST /api/calls/trigger` - Trigger fake phone call

## 🐳 Docker Deployment

### **Development**
```bash
docker compose -f docker-compose.dev.yml up --build
```

### **Production**
```bash
docker compose up --build
```

### **Environment Variables**
Set your environment variables in a `.env` file or through your deployment platform.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### **Development Guidelines**
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing the AI capabilities
- **Twilio** for phone call integration
- **React Team** for the amazing frontend framework
- **Express.js** for the robust backend framework
- **MongoDB** for the flexible database solution

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/arunmm8335/Alibai-Excuse-Generator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/arunmm8335/Alibai-Excuse-Generator/discussions)
- **Email**: Contact through GitHub profile

## 🚀 Live Demo

**Coming Soon!** We're working on deploying a live demo of Alibai.

---

**Made with ❤️ by the Alibai Team**

*Generate excuses intelligently, communicate effectively!*
