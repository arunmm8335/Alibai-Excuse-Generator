# Alibai - The Intelligent Excuse Generator

### A full-stack, AI-powered web application that generates high-quality, believable excuses with next-level features including real-time streaming, pro-tier API key management, and Twilio integration.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)

---

![Alibai App Showcase](https://i.imgur.com/your_screenshot_or_gif_url.gif)
> **Note:** Replace the URL above with a real screenshot or, even better, a GIF of your application in action. You can use a tool like [ScreenToGif](https://www.screentogif.com/) or Loom to record a short demonstration.

## Table of Contents
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Contact](#contact)

## Project Overview
**Alibai** is not just a simple excuse generator; it's a sophisticated showcase of modern web and AI development capabilities. This project was built to demonstrate a deep understanding of full-stack architecture, real-world API integration, advanced AI features, and polished user interface design.

The application intelligently learns from user feedback, provides proactive suggestions, and integrates third-party services like Twilio for real-world interactions, making it a comprehensive portfolio centerpiece.

## Key Features
-   **🚀 Real-time Streaming AI Responses:** Excuses are streamed token-by-token from the AI, providing a live, ChatGPT-like user experience.
-   **🧠 "Community Brain" Learning:** The AI's suggestions improve over time by learning from the highest-rated and most-favorited excuses from *all users* for a given context.
-   **📈 Pro-Tier System & API Key Management:** A full implementation of a modern AI SaaS business model.
    -   **Free Tier** with daily usage limits tracked per-user.
    -   **Pro Tier** upgrade that allows users to securely add their own encrypted OpenAI API key for unlimited generations.
-   **📞 Real-World Twilio Integration:** Triggers a real, automated phone call to the user's device to read an excuse aloud, demonstrating mastery of third-party API services.
-   **📝 On-the-Fly Prompt Editing:** Users can click on any of their previous prompts to load it back into the input bar for easy editing and regeneration.
-   **✨ AI-Powered Tools:**
    -   **Proof Generator:** Creates realistic-looking fake chat logs to support an alibi.
    -   **Apology Generator:** Crafts custom, context-aware apologies for any situation.
-   **🔐 Secure User Authentication:** Full login/register system using JWT (JSON Web Tokens) with secure password hashing.
-   **📊 Dynamic User Profile & Dashboard:** A dedicated profile page showing user stats (total excuses, favorites, success rate) and a list of their favorite excuses.
-   **🔮 Proactive AI Suggestions:** Analyzes a user's history to find recurring patterns and provides helpful, dismissible suggestions.
-   **🎙️ Voice-to-Text Integration:** Supports both typed input and speech-to-text via the Web Speech API.

## Tech Stack
#### **Frontend**
-   **Framework:** React (Vite)
-   **Styling:** Tailwind CSS with DaisyUI (Custom "aiStudio" Theme)
-   **Icons:** Phosphor Icons
-   **State Management:** React Hooks (useState, useEffect, etc.)
-   **Notifications:** React Hot Toast
-   **API Client:** Axios & Fetch API (for streaming)

#### **Backend**
-   **Runtime:** Node.js
-   **Framework:** Express.js
-   **Authentication:** JSON Web Tokens (JWT)
-   **Security:** `bcryptjs` for password hashing, `crypto-js` for API key encryption.

#### **Database**
-   **Type:** NoSQL
-   **Service:** MongoDB Atlas
-   **ORM/ODM:** Mongoose

#### **AI & Third-Party APIs**
-   **AI:** OpenAI-compatible API (`gpt-4o-mini`, `gpt-3.5-turbo`)
-   **Telephony:** Twilio API

## Getting Started
### Prerequisites
-   Node.js (v18 or later) & npm
-   A free MongoDB Atlas account
-   An OpenAI-compatible API Key
-   A Twilio account with a phone number (optional, for the call feature)

### Installation
1.  **Clone the repository to your local machine:**
    ```bash
    git clone https://github.com/your-username/Alibai-Excuse-Generator.git
    cd Alibai-Excuse-Generator
    ```

2.  **Setup the Backend:**
    ```bash
    cd backend
    npm install
    cp .env.example .env 
    ```
    *Next, fill out the newly created `.env` file with your secret keys as described below.*

3.  **Setup the Frontend:**
    ```bash
    cd ../frontend
    npm install
    ```

4.  **Run the Application:**
    -   In one terminal (from the `/backend` directory), start the backend server: `npm start`
    -   In a second terminal (from the `/frontend` directory), start the frontend server: `npm run dev`
    -   Open your browser and navigate to `http://localhost:5173`.

## Environment Variables
You must create a `.env` file inside the `/backend` directory. Populate it with the following keys:

```
# MongoDB Connection String from Atlas
MONGO_URI="your_mongodb_connection_string_here"

# A long, random, secure string for signing JWT tokens
JWT_SECRET="a_very_long_and_random_secret_for_jwt"

# Your default API key for free tier users
OPENAI_API_KEY="your_api_key_from_provider_starts_with_sk"
OPENAI_API_BASE_URL="the_base_url_from_your_api_provider"

# Your Twilio account details
TWILIO_ACCOUNT_SID="your_twilio_account_sid_starts_with_AC"
TWILIO_AUTH_TOKEN="your_twilio_auth_token"
TWILIO_PHONE_NUMBER="+1your_twilio_phone_number"
    
# A long, random, secure string for encrypting user-provided API keys
ENCRYPTION_SECRET="another_very_long_random_secret_for_encrypting_keys"
# Daily generation limit for free tier users
FREE_TIER_LIMIT=20
```

## Contact
**Arun M** - The Developer

-   **GitHub:** [arunm7554](https://github.com/arunm7554)
-   **LinkedIn:** [arunm7554](https://linkedin.com/in/arunm7554)

---
