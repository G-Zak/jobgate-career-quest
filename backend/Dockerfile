# backend/Dockerfile
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Create app user
RUN adduser --disabled-password --gecos '' appuser

# Set work directory
WORKDIR /app

# Copy requirements first (better caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir --timeout=300 --retries=3 -r requirements.txt

# Copy the entire backend folder
COPY . .

# Create necessary directories
RUN mkdir -p /app/static /app/media /app/logs

# Change ownership to app user
RUN chown -R appuser:appuser /app

# Switch to app user
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8000/api/health/ || exit 1

# Run Django setup and start server
CMD ["sh", "-c", "python manage.py migrate && python manage.py collectstatic --noinput && python manage.py runserver 0.0.0.0:8000"]