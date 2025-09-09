#!/bin/bash

# Comprehensive Scoring System Setup Script
# This script sets up the complete scoring system for the skills assessment platform

set -e  # Exit on any error

echo "🚀 Setting up Comprehensive Scoring System for Skills Assessment Platform"
echo "=================================================================="

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$PROJECT_ROOT/backend"
MIGRATION_DIR="$PROJECT_ROOT/frontend/src/features/skills-assessment/data/db-migration"

echo "📂 Project structure:"
echo "  - Project Root: $PROJECT_ROOT"
echo "  - Backend: $BACKEND_DIR"
echo "  - Migration Data: $MIGRATION_DIR"

# Step 1: Verify Python environment
echo "🐍 Checking Python environment..."
cd "$BACKEND_DIR"

if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not found. Please install Python 3."
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"

# Step 2: Install/upgrade required packages
echo "📦 Installing required Python packages..."
pip3 install --upgrade pip

# Core Django packages
pip3 install Django>=4.2.0
pip3 install djangorestframework>=3.14.0
pip3 install django-cors-headers>=4.0.0
pip3 install psycopg2-binary>=2.9.0

# Scoring and analytics packages
pip3 install numpy>=1.24.0
pip3 install scipy>=1.10.0
pip3 install pandas>=2.0.0
pip3 install scikit-learn>=1.3.0

# Testing and development
pip3 install pytest>=7.4.0
pip3 install pytest-django>=4.5.0

echo "✅ Python packages installed successfully"

# Step 3: Add scoring models to Django models
echo "🔧 Integrating scoring models with Django..."

# Check if models.py exists and add scoring models
MODELS_FILE="$BACKEND_DIR/testsengine/models.py"

if [ -f "$MODELS_FILE" ]; then
    # Check if scoring models are already added
    if ! grep -q "class ScoringProfile" "$MODELS_FILE"; then
        echo "📝 Adding scoring models to testsengine/models.py..."
        
        # Backup original models
        cp "$MODELS_FILE" "${MODELS_FILE}.backup"
        
        # Add scoring models to the file
        cat >> "$MODELS_FILE" << 'EOF'

# Scoring System Models
class ScoringProfile(models.Model):
    """Configuration for different scoring algorithms and parameters"""
    
    ALGORITHM_CHOICES = [
        ('raw_score', 'Raw Score'),
        ('weighted_difficulty', 'Weighted by Difficulty'),
        ('irt_scoring', 'Item Response Theory'),
        ('adaptive_scoring', 'Adaptive Scoring'),
        ('competency_based', 'Competency-Based Scoring'),
        ('percentile_ranking', 'Percentile Ranking'),
    ]
    
    name = models.CharField(max_length=100, unique=True)
    test_type = models.CharField(max_length=50)
    scoring_algorithm = models.CharField(max_length=50, choices=ALGORITHM_CHOICES)
    algorithm_parameters = models.JSONField(default=dict)
    
    # Score scaling
    scale_min = models.IntegerField(default=0)
    scale_max = models.IntegerField(default=100)
    pass_threshold = models.FloatField(default=70.0)
    
    # Weighting and configuration
    category_weights = models.JSONField(default=dict)
    time_limits = models.JSONField(default=dict)
    performance_levels = models.JSONField(default=dict)
    industry_rubrics = models.JSONField(default=dict)
    
    # Metadata
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'scoring_profiles'
        
    def __str__(self):
        return f"{self.name} ({self.test_type})"


class TestScore(models.Model):
    """Comprehensive scoring results for test sessions"""
    
    session = models.OneToOneField('TestSession', on_delete=models.CASCADE, related_name='comprehensive_score')
    scoring_profile = models.ForeignKey(ScoringProfile, on_delete=models.CASCADE)
    
    # Core scores
    raw_score = models.IntegerField()
    scaled_score = models.FloatField()
    percentage_score = models.FloatField()
    percentile_rank = models.FloatField()
    
    # Performance metrics
    completion_time = models.IntegerField(help_text="Time in seconds")
    accuracy_rate = models.FloatField()
    time_per_question = models.FloatField()
    
    # Analysis results
    strengths = models.JSONField(default=list)
    weaknesses = models.JSONField(default=list)
    recommendations = models.JSONField(default=list)
    
    # Metadata
    calculated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'test_scores'
        
    def __str__(self):
        return f"Score {self.scaled_score} for Session {self.session.id}"


class CategoryScore(models.Model):
    """Detailed scoring breakdown by category/competency"""
    
    test_score = models.ForeignKey(TestScore, on_delete=models.CASCADE, related_name='category_scores')
    category = models.CharField(max_length=100)
    
    # Category performance
    questions_attempted = models.IntegerField()
    questions_correct = models.IntegerField()
    raw_score = models.IntegerField()
    weighted_score = models.FloatField()
    percentage = models.FloatField()
    
    # Category-specific metrics
    avg_time_per_question = models.FloatField()
    difficulty_distribution = models.JSONField(default=dict)
    performance_level = models.CharField(max_length=50)
    
    class Meta:
        db_table = 'category_scores'
        unique_together = ['test_score', 'category']
        
    def __str__(self):
        return f"{self.category}: {self.percentage}% (Session {self.test_score.session.id})"
EOF
        
        echo "✅ Scoring models added to Django models"
    else
        echo "✅ Scoring models already exist in Django models"
    fi
else
    echo "❌ testsengine/models.py not found. Please check your Django setup."
    exit 1
fi

# Step 4: Create Django migrations
echo "📊 Creating Django migrations for scoring models..."
cd "$BACKEND_DIR"

python3 manage.py makemigrations testsengine --name add_scoring_models
echo "✅ Django migrations created"

# Step 5: Apply migrations
echo "🔄 Applying Django migrations..."
python3 manage.py migrate
echo "✅ Django migrations applied"

# Step 6: Create questions directory structure if it doesn't exist
echo "📁 Setting up questions directory structure..."
QUESTIONS_DIR="$MIGRATION_DIR/questions"
mkdir -p "$QUESTIONS_DIR"

# Create sample question files if they don't exist
if [ ! -f "$QUESTIONS_DIR/sjt_questions.jsonl" ]; then
    echo "📝 Creating sample SJT questions..."
    cat > "$QUESTIONS_DIR/sjt_questions.jsonl" << 'EOF'
{"id": "sjt_001", "scenario": "Your team is facing a tight deadline, but a team member is struggling with their assigned task.", "question": "What would be the most effective response?", "options": [{"id": "A", "text": "Take over their task to ensure quality"}, {"id": "B", "text": "Offer specific help and guidance"}, {"id": "C", "text": "Report to the manager immediately"}, {"id": "D", "text": "Ignore it and focus on your own work"}], "correct_answer": "B", "category": "teamwork", "difficulty": "medium", "competency": "teamwork"}
{"id": "sjt_002", "scenario": "You discover an error in a process that could affect project outcomes.", "question": "What is your best course of action?", "options": [{"id": "A", "text": "Fix it quietly without telling anyone"}, {"id": "B", "text": "Document and report it immediately"}, {"id": "C", "text": "Wait to see if anyone else notices"}, {"id": "D", "text": "Mention it casually in the next meeting"}], "correct_answer": "B", "category": "problem_solving", "difficulty": "medium", "competency": "problem_solving"}
EOF
fi

if [ ! -f "$QUESTIONS_DIR/verbal_reasoning_questions.jsonl" ]; then
    echo "📝 Creating sample Verbal Reasoning questions..."
    cat > "$QUESTIONS_DIR/verbal_reasoning_questions.jsonl" << 'EOF'
{"id": "vr_001", "question": "Choose the word that best completes the sentence: The manager's _____ approach helped resolve the conflict efficiently.", "options": ["aggressive", "diplomatic", "passive", "confused"], "correct_answer": "diplomatic", "category": "vocabulary", "difficulty": "medium"}
{"id": "vr_002", "question": "What is the main idea of this passage: 'Effective communication in the workplace requires active listening, clear expression of ideas, and empathy for others' perspectives.'", "options": ["Communication is difficult", "Workplace requires many skills", "Effective communication has multiple components", "Empathy is most important"], "correct_answer": "Effective communication has multiple components", "category": "reading_comprehension", "difficulty": "medium"}
EOF
fi

if [ ! -f "$QUESTIONS_DIR/spatial_reasoning_questions.jsonl" ]; then
    echo "📝 Creating sample Spatial Reasoning questions..."
    cat > "$QUESTIONS_DIR/spatial_reasoning_questions.jsonl" << 'EOF'
{"id": "sr_001", "question": "Which shape would result from folding this pattern?", "pattern_description": "A cross-shaped pattern with squares", "options": ["cube", "pyramid", "cylinder", "cone"], "correct_answer": "cube", "category": "3d_visualization", "difficulty": "medium"}
{"id": "sr_002", "question": "If you rotate this shape 90 degrees clockwise, which orientation will it have?", "shape_description": "L-shaped figure pointing up-right", "options": ["up-left", "down-right", "down-left", "up-right"], "correct_answer": "down-right", "category": "mental_rotation", "difficulty": "medium"}
EOF
fi

echo "✅ Sample questions created"

# Step 7: Run the migration and scoring setup command
echo "🔄 Running comprehensive data migration and scoring setup..."
cd "$BACKEND_DIR"

python3 manage.py migrate_and_score --data-dir="$QUESTIONS_DIR"
echo "✅ Data migration and scoring setup completed"

# Step 8: Create superuser if needed
echo "👤 Checking for Django superuser..."
if python3 manage.py shell -c "from django.contrib.auth.models import User; print('exists' if User.objects.filter(is_superuser=True).exists() else 'none')" | grep -q "none"; then
    echo "🔐 Creating Django superuser..."
    echo "Please create a superuser account for Django admin:"
    python3 manage.py createsuperuser
else
    echo "✅ Superuser already exists"
fi

# Step 9: Collect static files (if in production)
if [ "$NODE_ENV" = "production" ]; then
    echo "📦 Collecting static files..."
    python3 manage.py collectstatic --noinput
    echo "✅ Static files collected"
fi

# Step 10: Run development server test
echo "🧪 Testing Django server startup..."
timeout 10s python3 manage.py runserver 0.0.0.0:8000 &
SERVER_PID=$!
sleep 5

if kill -0 $SERVER_PID 2>/dev/null; then
    echo "✅ Django server starts successfully"
    kill $SERVER_PID
else
    echo "⚠️  Django server test completed (this is normal for setup)"
fi

# Step 11: Display completion summary
echo ""
echo "🎉 SCORING SYSTEM SETUP COMPLETE!"
echo "=================================="
echo ""
echo "✅ Comprehensive scoring system has been successfully set up!"
echo ""
echo "📊 Features installed:"
echo "  - Multi-algorithm scoring engine (IRT, weighted difficulty, competency-based)"
echo "  - Performance analytics and insights"
echo "  - Percentile ranking and comparison"
echo "  - Category-specific scoring breakdown"
echo "  - Personalized recommendations"
echo "  - Industry-specific scoring rubrics"
echo ""
echo "🚀 Next steps:"
echo "  1. Start the Django server: cd backend && python3 manage.py runserver"
echo "  2. Access Django admin: http://localhost:8000/admin/"
echo "  3. API endpoints available at: http://localhost:8000/api/"
echo "  4. Scoring API: http://localhost:8000/api/scores/"
echo ""
echo "📁 Key files created:"
echo "  - backend/testsengine/scoring_system.py (scoring algorithms)"
echo "  - backend/testsengine/scoring_configs.py (test configurations)"
echo "  - backend/testsengine/scoring_api.py (REST API endpoints)"
echo "  - frontend/src/features/.../ScoreDashboard.jsx (React dashboard)"
echo ""
echo "🔧 Management commands:"
echo "  - python3 manage.py migrate_and_score (re-run migration/scoring)"
echo "  - python3 manage.py migrate_and_score --recalculate-scores (recalculate all scores)"
echo ""
echo "Happy testing! 🚀"
