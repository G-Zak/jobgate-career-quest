# backend/Dockerfile
FROM python:3.12-slim

WORKDIR /app

# Copy requirements first (better caching)
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend folder
COPY . .

# Expose port
EXPOSE 8000

# Run Django (will run migrations and start server)
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]