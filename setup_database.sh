#!/bin/bash

echo "========================================"
echo "JobGate Career Quest - Database Setup"
echo "========================================"
echo

echo "Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed"
    echo "Please install Docker from: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "ERROR: docker-compose is not installed"
    echo "Please install docker-compose from: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "Docker is installed ✓"
echo

echo "Checking if project is cloned..."
if [ ! -f "backend/database_export.json" ]; then
    echo "ERROR: database_export.json not found"
    echo "Please make sure you're in the project root directory"
    echo "and that the project has been cloned properly"
    exit 1
fi

echo "Project files found ✓"
echo

echo "Starting database setup..."
echo "This may take 2-3 minutes for the first time..."
echo

echo "Starting Docker services..."
docker-compose up -d

echo
echo "Waiting for database to initialize..."
sleep 30

echo
echo "Checking database status..."
docker-compose ps

echo
echo "Checking database health..."
if docker-compose exec -T db pg_isready -U jobgate -d careerquest; then
    echo "Database is healthy ✓"
else
    echo "WARNING: Database health check failed"
    echo "This might be normal if the database is still starting up"
fi

echo
echo "Verifying data loading..."
docker-compose exec -T backend python manage.py shell -c "from testsengine.models import Question; print(f'Questions loaded: {Question.objects.count()}')"

echo
echo "========================================"
echo "Database Setup Complete!"
echo "========================================"
echo
echo "Access points:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:8000"
echo "- Admin Panel: http://localhost:8000/admin"
echo
echo "To view logs: docker-compose logs -f"
echo "To stop services: docker-compose down"
echo
