# Use the official Node.js image based on Alpine Linux version 18
FROM node:18-alpine

# Set the working directory inside the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies using npm
RUN npm install

# Copy the rest of the application files and directories to the working directory
COPY . .

# Inform Docker that the container will listen on port 4000 at runtime
EXPOSE 4000

# Define the default command to run when the container starts
CMD ["node", "index.js"]
