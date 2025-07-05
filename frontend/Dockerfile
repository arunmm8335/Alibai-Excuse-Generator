# Multi-stage build for React frontend
FROM node:18 as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Handle npm optional dependency bug by removing lock file and reinstalling
RUN rm -rf node_modules package-lock.json && \
    npm cache clean --force && \
    npm install && \
    npm rebuild

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 