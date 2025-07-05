# 🚀 Deployment Guide - Alibai Excuse Generator

This guide will help you deploy Alibai to free hosting platforms.

## 📋 Prerequisites

Before deploying, you'll need:

1. **GitHub Repository** ✅ (Already done)
2. **MongoDB Atlas Account** (Free cloud database)
3. **OpenAI API Key** (For AI features)
4. **Render Account** (Free hosting)

---

## 🗄️ Step 1: Set Up MongoDB Atlas (Free Database)

### **1. Create MongoDB Atlas Account**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and create an account
3. Choose "Free" tier (M0)

### **2. Create a Cluster**
1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select your preferred cloud provider (AWS/Google Cloud/Azure)
4. Choose a region close to you
5. Click "Create"

### **3. Set Up Database Access**
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Username: `alibai-admin`
4. Password: Create a strong password
5. Role: "Read and write to any database"
6. Click "Add User"

### **4. Set Up Network Access**
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for deployment)
4. Click "Confirm"

### **5. Get Connection String**
1. Go to "Database" in the left sidebar
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `alibai`

**Example connection string:**
```
mongodb+srv://alibai-admin:yourpassword@cluster0.xxxxx.mongodb.net/alibai?retryWrites=true&w=majority
```

---

## 🤖 Step 2: Get OpenAI API Key

### **1. Create OpenAI Account**
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up for a free account
3. Add payment method (required for API access)

### **2. Get API Key**
1. Go to [API Keys](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Copy the key (starts with `sk-`)

---

## 🌐 Step 3: Deploy to Render

### **1. Create Render Account**
1. Go to [Render](https://render.com/)
2. Sign up with your GitHub account
3. Connect your GitHub repository

### **2. Deploy Backend**
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `alibai-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

### **3. Set Environment Variables**
Add these environment variables in Render:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://alibai-admin:yourpassword@cluster0.xxxxx.mongodb.net/alibai?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_API_BASE_URL=https://api.openai.com/v1
FREE_TIER_LIMIT=10
ENCRYPTION_SECRET=your-encryption-secret-key
```

### **4. Deploy Frontend**
1. Click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `alibai-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Environment Variable**: `VITE_API_URL=https://your-backend-url.onrender.com`

---

## 🔧 Alternative Deployment Options

### **Option A: Railway**
1. Go to [Railway](https://railway.app/)
2. Connect GitHub repository
3. Deploy backend and frontend separately
4. Set environment variables

### **Option B: Vercel + Railway**
1. **Frontend on Vercel**:
   - Go to [Vercel](https://vercel.com/)
   - Import your GitHub repository
   - Set build command: `cd frontend && npm install && npm run build`
   - Set output directory: `frontend/dist`

2. **Backend on Railway**:
   - Deploy backend to Railway
   - Set environment variables
   - Update frontend API URL

### **Option C: Netlify + Render**
1. **Frontend on Netlify**:
   - Go to [Netlify](https://netlify.com/)
   - Connect GitHub repository
   - Set build command: `cd frontend && npm install && npm run build`
   - Set publish directory: `frontend/dist`

2. **Backend on Render**:
   - Deploy backend to Render
   - Set environment variables
   - Update frontend API URL

---

## 🎯 Quick Deploy with Render

### **One-Click Deploy**
1. Click this button to deploy to Render:
   [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

2. Connect your GitHub repository
3. Set environment variables
4. Deploy!

---

## 🔍 Troubleshooting

### **Common Issues:**

**1. Build Failures**
- Check build logs in Render dashboard
- Ensure all dependencies are in package.json
- Verify build commands are correct

**2. Database Connection Issues**
- Verify MongoDB Atlas connection string
- Check network access settings
- Ensure database user has correct permissions

**3. API Key Issues**
- Verify OpenAI API key is correct
- Check API key has sufficient credits
- Ensure environment variables are set correctly

**4. CORS Issues**
- Add frontend URL to backend CORS settings
- Check environment variables for API URLs

### **Environment Variables Checklist:**
- [ ] `MONGODB_URI` - MongoDB Atlas connection string
- [ ] `JWT_SECRET` - Random secret for JWT tokens
- [ ] `OPENAI_API_KEY` - Your OpenAI API key
- [ ] `OPENAI_API_BASE_URL` - https://api.openai.com/v1
- [ ] `FREE_TIER_LIMIT` - 10 (or your preferred limit)
- [ ] `ENCRYPTION_SECRET` - Random secret for encryption
- [ ] `VITE_API_URL` - Your backend URL (frontend only)

---

## 🎉 Success!

Once deployed, your Alibai app will be available at:
- **Frontend**: `https://your-app-name.onrender.com`
- **Backend**: `https://your-backend-name.onrender.com`

### **Next Steps:**
1. Test all features
2. Set up custom domain (optional)
3. Monitor usage and performance
4. Share your deployed app!

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Render/Railway/Vercel documentation
3. Check application logs in your hosting platform
4. Open an issue on GitHub

**Happy Deploying! 🚀** 