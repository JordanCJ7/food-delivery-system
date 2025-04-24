# Use an official Node.js runtime as a parent image
FROM node:23-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5003

# Define the command to run the application
CMD ["npm", "run", "dev"]
