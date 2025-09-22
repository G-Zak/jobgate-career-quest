#!/bin/bash

echo "Setting up database and sample data in Docker..."
echo

echo "Running migrations..."
docker-compose exec backend python manage.py migrate

echo
echo "Creating sample jobs..."
docker-compose exec backend python manage.py create_sample_jobs --count 30

echo
echo "Generating recommendations..."
docker-compose exec backend python manage.py generate_recommendations

echo
echo "Creating superuser (optional)..."
echo "You can create an admin user by running:"
echo "docker-compose exec backend python manage.py createsuperuser"
echo
echo "Setup complete! You can now access:"
echo "- Frontend: http://localhost:3000"
echo "- Admin: http://localhost:8000/admin"
