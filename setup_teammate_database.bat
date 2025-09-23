@echo off
SETLOCAL

REM --- Configuration ---
SET PROJECT_ROOT=%~dp0
SET DATABASE_EXPORT_FILE=database_export.json

echo.
echo --- JobGate Career Quest - Teammate Database Setup ---
echo.

REM --- Step 1: Check if database_export.json exists ---
echo 1. Checking for database export file...
if not exist "%DATABASE_EXPORT_FILE%" (
    echo    ❌ database_export.json not found!
    echo    Please ensure the database export file is in the project root.
    echo    Contact your team lead to get the latest database_export.json file.
    GOTO :EOF
)
echo    ✅ database_export.json found.

REM --- Step 2: Ensure Docker is Running ---
echo.
echo 2. Checking Docker status...
docker info > NUL 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo    ❌ Docker Desktop is not running or not accessible.
    echo    Please start Docker Desktop and try again.
    GOTO :EOF
)
echo    ✅ Docker Desktop is running.

REM --- Step 3: Start Docker Compose Services ---
echo.
echo 3. Starting Docker Compose services...
cd "%PROJECT_ROOT%"
docker-compose up -d
IF %ERRORLEVEL% NEQ 0 (
    echo    ❌ Failed to start Docker Compose services.
    echo    Check `docker-compose logs` for details.
    GOTO :EOF
)
echo    ✅ Docker Compose services started.

REM --- Step 4: Wait for Database to be Healthy ---
echo.
echo 4. Waiting for PostgreSQL database to become healthy (this may take a minute)...
:WAIT_FOR_DB
docker-compose ps db | findstr "healthy" > NUL
IF %ERRORLEVEL% NEQ 0 (
    echo    Still waiting for database...
    TIMEOUT /T 10 /NOBREAK > NUL
    GOTO :WAIT_FOR_DB
)
echo    ✅ PostgreSQL database is healthy.

REM --- Step 5: Run Django Migrations ---
echo.
echo 5. Running Django migrations...
docker-compose exec backend python manage.py migrate
IF %ERRORLEVEL% NEQ 0 (
    echo    ❌ Failed to run Django migrations.
    GOTO :EOF
)
echo    ✅ Django migrations applied.

REM --- Step 6: Load Database Data ---
echo.
echo 6. Loading database data from %DATABASE_EXPORT_FILE%...
docker-compose exec backend python manage.py loaddata %DATABASE_EXPORT_FILE%
IF %ERRORLEVEL% NEQ 0 (
    echo    ❌ Failed to load database data.
    echo    This might be expected if data was already loaded.
    echo    Continuing with verification...
) ELSE (
    echo    ✅ Database data loaded successfully.
)

REM --- Step 7: Verify Database Setup ---
echo.
echo 7. Verifying database setup...
python verify_database.py
IF %ERRORLEVEL% NEQ 0 (
    echo    ❌ Database verification failed.
    echo    Please check the error messages above.
    GOTO :EOF
)
echo    ✅ Database verification completed.

REM --- Step 8: Create Superuser (Optional) ---
echo.
echo 8. Creating Django superuser (optional)...
echo    You can skip this step by pressing Ctrl+C
echo    Or create an admin user to access the admin panel.
docker-compose exec backend python manage.py createsuperuser
IF %ERRORLEVEL% NEQ 0 (
    echo    ⚠️  Superuser creation skipped or failed.
) ELSE (
    echo    ✅ Superuser created successfully.
)

echo.
echo --- Setup Complete! ---
echo.
echo 🎉 Your database is now ready with all test data!
echo.
echo You can now access:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:8000
echo    Admin Panel: http://localhost:8000/admin
echo.
echo To stop services: `docker-compose down`
echo To view logs: `docker-compose logs -f`
echo.
PAUSE
ENDLOCAL
