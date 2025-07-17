# Docker Setup for ExcuseMe

This guide will help you set up and run ExcuseMe using Docker containers.

## 🐳 Prerequisites

- Docker and Docker Compose installed
- Environment variables configured (see below)

## 📋 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# OpenAI API
OPENAI_API_KEY=your_openai_api_key

# Twilio (optional - for phone call features)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Cloudinary (optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## 🚀 Quick Start

### Production Setup

1. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Frontend: http://localhost
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

### Development Setup

1. **Start development environment:**
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

2. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

## 🛠️ Docker Commands

### Production Commands

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up --build

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
```

### Development Commands

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up

# Start in background
docker-compose -f docker-compose.dev.yml up -d

# Stop development environment
docker-compose -f docker-compose.dev.yml down

# Rebuild development environment
docker-compose -f docker-compose.dev.yml up --build
```

## 📁 Project Structure

```
launchizd-excuse-generator/
├── docker-compose.yml          # Production orchestration
├── docker-compose.dev.yml      # Development orchestration
├── .dockerignore              # Docker ignore file
├── .env                       # Environment variables
├── backend/
│   ├── Dockerfile            # Production backend image
│   ├── Dockerfile.dev        # Development backend image
│   ├── healthcheck.js        # Health check script
│   └── init-mongo.js         # MongoDB initialization
└── frontend/
    ├── Dockerfile            # Production frontend image
    ├── Dockerfile.dev        # Development frontend image
    └── nginx.conf           # Nginx configuration
```

## 🔧 Service Details

### MongoDB
- **Image:** mongo:6.0
- **Port:** 27017
- **Data:** Persisted in Docker volume
- **Authentication:** Enabled with admin user

### Backend API
- **Image:** Custom Node.js 18 Alpine
- **Port:** 5000
- **Health Check:** Available at `/api/auth/me`
- **Environment:** Production optimized

### Frontend
- **Image:** Custom React with Nginx
- **Port:** 80 (production) / 5173 (development)
- **Features:** Hot reloading in development

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts:**
   ```bash
   # Check what's using the ports
   netstat -tulpn | grep :5000
   netstat -tulpn | grep :80
   ```

2. **Permission issues:**
   ```bash
   # Fix Docker permissions
   sudo chown -R $USER:$USER .
   ```

3. **Container not starting:**
   ```bash
   # Check container logs
   docker-compose logs backend
   docker-compose logs frontend
   ```

4. **MongoDB connection issues:**
   ```bash
   # Check MongoDB container
   docker-compose exec mongodb mongo --eval "db.adminCommand('ping')"
   ```

### Reset Everything

```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Remove all images
docker system prune -a

# Rebuild from scratch
docker-compose up --build
```

## 🔒 Security Notes

- **Production:** Change default passwords and JWT secrets
- **Environment Variables:** Never commit `.env` files
- **Ports:** Consider using reverse proxy for production
- **Volumes:** Use named volumes for data persistence

## 📊 Monitoring

### Health Checks
- Backend: Automatic health checks every 30s
- MongoDB: Connection verification
- Frontend: Nginx status monitoring

### Logs
```bash
# View all logs
docker-compose logs

# Follow specific service
docker-compose logs -f backend

# View last 100 lines
docker-compose logs --tail=100
```

## 🚀 Deployment

### Production Deployment

1. **Set environment variables**
2. **Build images:**
   ```bash
   docker-compose build
   ```
3. **Start services:**
   ```bash
   docker-compose up -d
   ```
4. **Monitor:**
   ```bash
   docker-compose logs -f
   ```

### Scaling

```bash
# Scale backend services
docker-compose up --scale backend=3

# Scale with specific configuration
docker-compose -f docker-compose.prod.yml up --scale backend=5
```

## 📝 Notes

- **Development:** Uses volume mounts for hot reloading
- **Production:** Uses multi-stage builds for optimization
- **Database:** Data persists in Docker volumes
- **Networks:** Services communicate via Docker networks
- **Health Checks:** Automatic monitoring of service health

For more information, check the main README.md file. 