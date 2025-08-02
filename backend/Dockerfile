# backend/Dockerfile
FROM python:3.12-slim

WORKDIR /app

# Copy requirements first (better caching)
COPY requirements.txt .

# Install dependencies with increased timeout and retries
RUN pip install --upgrade pip && \
    pip install --no-cache-dir --timeout=300 --retries=3 -r requirements.txt

# Copy the entire backend folder
COPY . .

# Expose port
EXPOSE 8000

# Run Django (will run migrations and start server)
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]