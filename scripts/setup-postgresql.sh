#!/bin/bash
# PostgreSQL Setup Script for JobGate Career Quest

set -e

echo "🚀 JobGate Career Quest - PostgreSQL Migration Script"
echo "===================================================="

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ This script is designed for macOS. Please install PostgreSQL manually."
    exit 1
fi

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew is not installed. Please install it first: https://brew.sh"
    exit 1
fi

echo "📦 Installing PostgreSQL..."
brew install postgresql@15

echo "🚀 Starting PostgreSQL service..."
brew services start postgresql@15

# Wait a moment for service to start
sleep 3

echo "🔐 Setting up database and user..."

# Create database and user
psql postgres <<EOF
-- Create database
CREATE DATABASE jobgate_career_quest;

-- Create user
CREATE USER jobgate_user WITH PASSWORD 'jobgate_dev_password_2025';

-- Set encoding and timezone
ALTER ROLE jobgate_user SET client_encoding TO 'utf8';
ALTER ROLE jobgate_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE jobgate_user SET timezone TO 'UTC';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE jobgate_career_quest TO jobgate_user;

-- Grant schema privileges (PostgreSQL 15+)
GRANT ALL ON SCHEMA public TO jobgate_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO jobgate_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO jobgate_user;

-- Exit
\q
EOF

echo "✅ PostgreSQL setup complete!"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    
    # Update .env with PostgreSQL settings
    sed -i '' 's/USE_POSTGRESQL=False/USE_POSTGRESQL=True/' .env
    sed -i '' 's/DB_PASSWORD=your_secure_password_here/DB_PASSWORD=jobgate_dev_password_2025/' .env
    
    echo "✅ .env file created with PostgreSQL settings"
else
    echo "⚠️  .env file already exists. Please update it manually:"
    echo "   USE_POSTGRESQL=True"
    echo "   DB_PASSWORD=jobgate_dev_password_2025"
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Update your .env file if needed"
echo "2. Backup your current data: python manage.py db_manager --action backup"
echo "3. Run migrations: python manage.py migrate"
echo "4. Load your data: python manage.py loaddata backup_file.json"
echo "5. Test the connection: python manage.py db_manager --action status"
echo ""
echo "📊 Database Details:"
echo "   Database: jobgate_career_quest"
echo "   Username: jobgate_user"
echo "   Password: jobgate_dev_password_2025"
echo "   Host: localhost"
echo "   Port: 5432"
echo ""
echo "🔗 Connect manually: psql -h localhost -U jobgate_user -d jobgate_career_quest"
