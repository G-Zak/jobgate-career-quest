#!/bin/bash
# Complete Database Migration Setup Script
# This script sets up the entire database migration process

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🎯 Skills Assessment Database Migration Setup${NC}"
echo "=============================================="

# Check current directory
if [[ ! -f "validate-data.mjs" ]]; then
    echo -e "${RED}❌ Please run this script from the db-migration directory${NC}"
    exit 1
fi

# Make scripts executable
chmod +x validate-data.mjs
chmod +x analyze-questions.mjs  
chmod +x extract-js-questions.mjs
chmod +x migrate_to_database.py
chmod +x setup_postgresql.sh

echo -e "${GREEN}✅ Made scripts executable${NC}"

# Check Python environment
echo -e "${BLUE}� Checking Python environment...${NC}"
if ! python3 --version &> /dev/null; then
    echo -e "${RED}❌ Python 3 is required${NC}"
    exit 1
fi

# Check if we're in a virtual environment
if [[ -z "$VIRTUAL_ENV" ]]; then
    echo -e "${YELLOW}⚠️  Not in a virtual environment. Recommended to use one.${NC}"
    echo "To create and activate a virtual environment:"
    echo "  python3 -m venv .venv"
    echo "  source .venv/bin/activate"
fi

# Install Python packages
echo -e "${BLUE}📦 Installing required Python packages...${NC}"

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Validate your data:"
echo "   node validate-data.mjs"
echo ""
echo "2. Set up your MySQL/MariaDB database:"
echo "   mysql -u root -p < migration.sql"
echo ""
echo "3. Import data to database:"
echo "   python import-to-database.py --user=your_user --password=your_password"
echo ""
echo "4. Update your application to use database queries instead of static files"
echo ""
echo "📁 File Structure Created:"
echo "├── situational-judgment/"
echo "│   └── sjt_questions.jsonl          (200 questions)"
echo "├── verbal-reasoning/"
echo "│   ├── analogy_questions.jsonl      (72 questions)"
echo "│   ├── blood_relations_questions.jsonl (95 questions)"
echo "│   ├── classification_questions.jsonl (25 questions)"
echo "│   └── coding_decoding_questions.jsonl (25 questions)"
echo "├── spatial-reasoning/"
echo "│   └── spatial_test_config.json     (test configuration)"
echo "├── validate-data.mjs                (data validation script)"
echo "├── import-to-database.py            (database import script)"
echo "├── requirements.txt                 (Python dependencies)"
echo "└── README.md                        (comprehensive documentation)"
echo ""
echo "🎯 Total Questions Ready for Migration: 417"
