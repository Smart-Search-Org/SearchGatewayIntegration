# Use official Node.js LTS base image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first for caching
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application source code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Default command to run your app
CMD ["node", "bin/www"]
