#!/bin/bash
# PostgreSQL Setup Script for Skills Assessment Database
# Run this script to set up PostgreSQL for the skills assessment system

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DB_NAME="jobgate_career_quest"
DB_USER="jobgate_user"
DB_PASSWORD="secure_password_2024"
DB_HOST="localhost"
DB_PORT="5432"

echo -e "${BLUE}🗄️  Setting up PostgreSQL for Skills Assessment${NC}"
echo "=================================================="

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL is not installed${NC}"
    echo -e "${YELLOW}Installing PostgreSQL...${NC}"
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install postgresql
            brew services start postgresql
        else
            echo -e "${RED}Please install Homebrew first: https://brew.sh${NC}"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        sudo apt-get update
        sudo apt-get install -y postgresql postgresql-contrib
        sudo systemctl start postgresql
        sudo systemctl enable postgresql
    else
        echo -e "${RED}Unsupported OS. Please install PostgreSQL manually.${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ PostgreSQL is installed${NC}"

# Check if PostgreSQL is running
if ! pg_isready -h $DB_HOST -p $DB_PORT &> /dev/null; then
    echo -e "${YELLOW}⚠️  Starting PostgreSQL service...${NC}"
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew services start postgresql
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo systemctl start postgresql
    fi
    
    # Wait for PostgreSQL to start
    sleep 3
fi

echo -e "${GREEN}✅ PostgreSQL is running${NC}"

# Create database and user
echo -e "${BLUE}📊 Creating database and user...${NC}"

# Function to run SQL as postgres user
run_sql() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        psql -h $DB_HOST -p $DB_PORT -U $(whoami) -d postgres -c "$1"
    else
        sudo -u postgres psql -c "$1"
    fi
}

# Create user
echo -e "${YELLOW}Creating user: $DB_USER${NC}"
run_sql "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" 2>/dev/null || echo "User already exists"

# Create database
echo -e "${YELLOW}Creating database: $DB_NAME${NC}"
run_sql "CREATE DATABASE $DB_NAME OWNER $DB_USER;" 2>/dev/null || echo "Database already exists"

# Grant privileges
echo -e "${YELLOW}Granting privileges...${NC}"
run_sql "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
run_sql "ALTER USER $DB_USER CREATEDB;"

# Test connection
echo -e "${BLUE}🔧 Testing database connection...${NC}"
export PGPASSWORD=$DB_PASSWORD
if psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT version();" &> /dev/null; then
    echo -e "${GREEN}✅ Database connection successful${NC}"
else
    echo -e "${RED}❌ Database connection failed${NC}"
    exit 1
fi

# Create .env file for Django
echo -e "${BLUE}📝 Creating environment configuration...${NC}"
ENV_FILE="../../../backend/.env"
cat > $ENV_FILE << EOF
# Database Configuration
USE_POSTGRESQL=True
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT

# Django Settings
ENVIRONMENT=development
DEBUG=True
SECRET_KEY=django-insecure-skills-assessment-dev-key-change-in-production

# Additional Database Settings
DB_CONN_MAX_AGE=600
DB_CONN_HEALTH_CHECKS=True
DB_MAX_CONNS=20
DB_MIN_CONNS=5
EOF

echo -e "${GREEN}✅ Environment file created: $ENV_FILE${NC}"

# Install Python dependencies
echo -e "${BLUE}📦 Installing Python dependencies...${NC}"
cd ../../../backend
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
    # Additional packages for PostgreSQL
    pip install psycopg2-binary python-decouple
    echo -e "${GREEN}✅ Python dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  requirements.txt not found${NC}"
fi

# Run Django migrations
echo -e "${BLUE}🔄 Running Django migrations...${NC}"
python manage.py makemigrations
python manage.py migrate

echo -e "${GREEN}✅ Django migrations completed${NC}"

# Create superuser (optional)
echo -e "${BLUE}👤 Creating Django superuser...${NC}"
echo "You can create a superuser account for Django admin:"
echo "python manage.py createsuperuser"

# Success message
echo ""
echo -e "${GREEN}🎉 PostgreSQL setup completed successfully!${NC}"
echo "=================================================="
echo -e "${BLUE}Database Information:${NC}"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Run the migration script to load your questions:"
echo "   cd frontend/src/features/skills-assessment/data/db-migration"
echo "   python migrate_to_database.py --database postgresql"
echo ""
echo "2. Start your Django development server:"
echo "   cd backend"
echo "   python manage.py runserver"
echo ""
echo "3. Access Django admin at: http://localhost:8000/admin/"
echo ""
echo -e "${YELLOW}📁 Environment file created at: $ENV_FILE${NC}"
echo -e "${YELLOW}🔑 Database password: $DB_PASSWORD${NC}"
echo ""
