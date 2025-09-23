#!/bin/bash

# --- Configuration ---
PROJECT_ROOT="$(dirname "$0")"
DATABASE_EXPORT_FILE="database_export.json"

echo ""
echo "--- JobGate Career Quest - Teammate Database Setup ---"
echo ""

# --- Step 1: Check if database_export.json exists ---
echo "1. Checking for database export file..."
if [ ! -f "$DATABASE_EXPORT_FILE" ]; then
    echo "   ❌ database_export.json not found!"
    echo "   Please ensure the database export file is in the project root."
    echo "   Contact your team lead to get the latest database_export.json file."
    exit 1
fi
echo "   ✅ database_export.json found."

# --- Step 2: Ensure Docker is Running ---
echo ""
echo "2. Checking Docker status..."
docker info > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "   ❌ Docker Desktop is not running or not accessible."
    echo "   Please start Docker Desktop and try again."
    exit 1
fi
echo "   ✅ Docker Desktop is running."

# --- Step 3: Start Docker Compose Services ---
echo ""
echo "3. Starting Docker Compose services..."
cd "$PROJECT_ROOT" || exit
docker-compose up -d
if [ $? -ne 0 ]; then
    echo "   ❌ Failed to start Docker Compose services."
    echo "   Check 'docker-compose logs' for details."
    exit 1
fi
echo "   ✅ Docker Compose services started."

# --- Step 4: Wait for Database to be Healthy ---
echo ""
echo "4. Waiting for PostgreSQL database to become healthy (this may take a minute)..."
until docker-compose ps db | grep -q "healthy"; do
    echo "   Still waiting for database..."
    sleep 10
done
echo "   ✅ PostgreSQL database is healthy."

# --- Step 5: Run Django Migrations ---
echo ""
echo "5. Running Django migrations..."
docker-compose exec backend python manage.py migrate
if [ $? -ne 0 ]; then
    echo "   ❌ Failed to run Django migrations."
    exit 1
fi
echo "   ✅ Django migrations applied."

# --- Step 6: Load Database Data ---
echo ""
echo "6. Loading database data from $DATABASE_EXPORT_FILE..."
docker-compose exec backend python manage.py loaddata "$DATABASE_EXPORT_FILE"
if [ $? -ne 0 ]; then
    echo "   ❌ Failed to load database data."
    echo "   This might be expected if data was already loaded."
    echo "   Continuing with verification..."
else
    echo "   ✅ Database data loaded successfully."
fi

# --- Step 7: Verify Database Setup ---
echo ""
echo "7. Verifying database setup..."
python verify_database.py
if [ $? -ne 0 ]; then
    echo "   ❌ Database verification failed."
    echo "   Please check the error messages above."
    exit 1
fi
echo "   ✅ Database verification completed."

# --- Step 8: Create Superuser (Optional) ---
echo ""
echo "8. Creating Django superuser (optional)..."
echo "   You can skip this step by pressing Ctrl+C"
echo "   Or create an admin user to access the admin panel."
docker-compose exec backend python manage.py createsuperuser
if [ $? -ne 0 ]; then
    echo "   ⚠️  Superuser creation skipped or failed."
else
    echo "   ✅ Superuser created successfully."
fi

echo ""
echo "--- Setup Complete! ---"
echo ""
echo "🎉 Your database is now ready with all test data!"
echo ""
echo "You can now access:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   Admin Panel: http://localhost:8000/admin"
echo ""
echo "To stop services: 'docker-compose down'"
echo "To view logs: 'docker-compose logs -f'"
echo ""
