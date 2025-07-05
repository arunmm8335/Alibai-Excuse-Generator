# Alibai - AI-Powered Excuse Generator

<div align="center">
  <img src="src/assets/logo.png" alt="Alibai Logo" width="200"/>
  <h3>Your AI-powered excuse generator for any situation</h3>
</div>

## 🚀 Features

### 🤖 AI-Powered Excuse Generation
- **Context-Aware Excuses**: Generate excuses for work, school, social, and family situations
- **Smart Customization**: Adjust urgency levels and believability
- **Multi-Language Support**: English, Hindi, Spanish, and French
- **Voice Input/Output**: Speak your scenario and hear responses

### 📱 Real Communication Integration
- **Twilio Phone Calls**: Receive actual phone calls with your excuse
- **Proof Generation**: Downloadable chat screenshots and documents
- **Automated Messaging**: Send excuses via text or email

### 👥 Community Features
- **Public Excuse Wall**: Share and discover excuses from the community
- **Rating System**: Thumbs up/down to improve AI learning
- **Moderation Tools**: Report inappropriate content, admin panel
- **Trending Excuses**: See what's popular in the community

### 🎨 Modern User Experience
- **Multi-Theme Support**: Light, AI Studio, Cyberpunk, and Synthwave themes
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Accessibility**: Full keyboard navigation and screen reader support
- **Real-time Streaming**: Instant AI responses with streaming text

### 👤 User Management
- **Profile System**: Custom avatars, bios, and social links
- **Smart Preferences**: Tone, length, and humor settings
- **Excuse History**: Save and manage your generated excuses
- **Favorites**: Bookmark your best excuses for quick access

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for modern styling
- **DaisyUI** for beautiful components
- **React Router** for navigation
- **Axios** for API communication
- **React Hot Toast** for notifications
- **Font Awesome** for icons
- **html2canvas** for screenshot generation

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **OpenAI API** for AI-powered generation
- **Twilio API** for phone calls and SMS
- **Cloudinary** for image uploads
- **JWT** for authentication
- **bcrypt** for password hashing

### External APIs
- **OpenAI GPT-4** for intelligent excuse generation
- **Twilio** for real phone calls and messaging
- **Cloudinary** for profile image storage

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- OpenAI API key
- Twilio account (optional, for phone features)
- Cloudinary account (optional, for image uploads)

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

Start the backend server:
```bash
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
```

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🎯 Usage

1. **Register/Login**: Create an account or sign in
2. **Describe Your Situation**: Tell the AI what you need an excuse for
3. **Customize Settings**: Adjust context, urgency, and language
4. **Generate Excuses**: Get multiple AI-generated options
5. **Download Proof**: Create believable chat screenshots
6. **Make Real Calls**: Receive phone calls with your excuse
7. **Share with Community**: Post your best excuses to the public wall

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Excuses
- `POST /api/excuses/generate-stream` - Generate excuses with streaming
- `POST /api/excuses/save` - Save generated excuse
- `GET /api/excuses/history` - Get user's excuse history
- `PATCH /api/excuses/:id/favorite` - Toggle favorite status
- `PATCH /api/excuses/:id/rate` - Rate an excuse

### Community
- `GET /api/excuses/public` - Get public excuse wall
- `POST /api/excuses/:id/report` - Report inappropriate content
- `POST /api/excuses/:id/comment` - Add comment to excuse

### Proof & Calls
- `POST /api/excuses/proof` - Generate proof documents
- `POST /api/calls/trigger` - Initiate phone call

## 🎨 Themes

Alibai supports multiple themes for different moods:

- **Light**: Clean, professional look
- **AI Studio**: Futuristic AI aesthetic
- **Cyberpunk**: Dark, neon-inspired theme
- **Synthwave**: Retro 80s vibe

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting on API endpoints
- Secure file upload handling
- XSS protection

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to Heroku, Railway, or your preferred platform

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred platform
3. Update API endpoints to production URLs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- OpenAI for providing the AI capabilities
- Twilio for communication services
- DaisyUI for beautiful components
- The React and Vite communities

---

<div align="center">
  <p>Built with ❤️ by Arun M</p>
  <p>Part of the LaunchEd AI team</p>
</div>
