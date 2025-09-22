# Use official Node.js LTS image
FROM node:20-alpine

# Set environment variables
ENV NODE_ENV=development
ENV VITE_API_URL=http://localhost:8000

# Install curl for health checks
RUN apk add --no-cache curl

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy the rest of the code
COPY . .

# Create necessary directories
RUN mkdir -p /app/dist /app/.vite

# Change ownership to app user
RUN chown -R nextjs:nodejs /app

# Switch to app user
USER nextjs

# Expose Vite dev server port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

# Default command (use npm script)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
