# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /frontend

# Copy the rest of the application code to the working directory
COPY . .

# Install dependencies
RUN npm install

# Build the React app for production
RUN npm run build
