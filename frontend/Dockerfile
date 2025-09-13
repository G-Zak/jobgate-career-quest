# Use official Node.js LTS image
FROM node:20

# Set working directory
WORKDIR /app

# Copy only package.json and package-lock.json first for caching
COPY package*.json ./

# Install deps with npm install (will create new package-lock.json)
RUN npm install

# Copy the rest of the code
COPY . .

# Expose Vite dev server port
EXPOSE 3000

# Default command (use npm script)
CMD ["npm", "run", "dev"]
