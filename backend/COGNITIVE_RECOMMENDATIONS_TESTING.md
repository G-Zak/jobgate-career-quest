# 🧠 Cognitive Job Recommendation System - Testing Guide

## ✅ System Status
The cognitive job recommendation system has been successfully implemented with:
- ✅ Technical test scoring algorithm
- ✅ K-Means clustering service  
- ✅ Cognitive/employability score integration
- ✅ RESTful API endpoints
- ✅ Background task processing (Celery)
- ✅ Database models and migrations
- ✅ Admin interface
- ✅ Comprehensive documentation

## 🚀 How to Test the System

### 1. Prerequisites Setup
```bash
# Install dependencies
pip install celery redis scikit-learn

# Start Redis server (required for Celery)
redis-server

# Start Celery worker (in separate terminal)
cd backend
celery -A careerquest worker --loglevel=info
```

### 2. Database Setup
```bash
# Run migrations (if not already done)
python manage.py migrate

# Create sample data
python manage.py seed_moroccan_jobs --count 50
python manage.py seed_skill_test_mappings
python manage.py setup_cognitive_recommendations --jobs 50 --clusters 8
```

### 3. Quick System Test
```bash
# Run the test script
python test_cognitive_recommendations.py
```

### 4. API Testing

#### Get Candidate Recommendations
```bash
# Replace {candidate_id} with actual candidate ID
curl -X GET "http://localhost:8000/api/cognitive/candidate/{candidate_id}/recommendations/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

#### Get Job Recommendations  
```bash
# Replace {job_id} with actual job ID
curl -X GET "http://localhost:8000/api/cognitive/job/{job_id}/recommendations/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

#### Trigger Batch Recomputation
```bash
curl -X POST "http://localhost:8000/api/cognitive/recompute/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"candidate_ids": [1, 2, 3]}'
```

#### Test Submission Webhook
```bash
curl -X POST "http://localhost:8000/api/cognitive/webhook/test-submission/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "candidate_id": 1,
    "test_type": "technical",
    "test_id": 1,
    "score": 85.5,
    "passed": true
  }'
```

### 5. Database Verification

#### Check Recommendations
```sql
-- View recent recommendations
SELECT 
    jr.candidate_id,
    jo.title,
    jo.company,
    jr.overall_score,
    jr.technical_test_score,
    jr.skill_match_score,
    jr.computed_at
FROM recommendation_jobrecommendation jr
JOIN recommendation_joboffer jo ON jr.job_offer_id = jo.id
ORDER BY jr.computed_at DESC
LIMIT 10;
```

#### Check Technical Test Scores
```sql
-- View technical test breakdown
SELECT 
    candidate_id,
    job_offer_id,
    technical_test_score,
    breakdown->'technical_tests' as test_breakdown
FROM recommendation_jobrecommendation
WHERE technical_test_score > 0
ORDER BY technical_test_score DESC;
```

#### Check Clustering Results
```sql
-- View cluster centers
SELECT 
    algorithm_version,
    n_clusters,
    silhouette_score,
    trained_at,
    is_active
FROM recommendation_clustercenters
ORDER BY trained_at DESC;
```

### 6. Admin Interface Testing
1. Go to `/admin/recommendation/`
2. Check these sections:
   - **Job Offers**: Verify Moroccan jobs with MAD currency
   - **Job Recommendations**: View computed scores and breakdowns
   - **Scoring Weights**: Configure algorithm weights
   - **Skill Technical Test Mappings**: View skill-test relationships
   - **Cluster Centers**: Check K-means model status

### 7. Performance Testing

#### Load Test Recommendations
```python
# Create load_test.py
import requests
import time
import concurrent.futures

def test_recommendation(candidate_id):
    response = requests.get(
        f"http://localhost:8000/api/cognitive/candidate/{candidate_id}/recommendations/",
        headers={"Authorization": "Bearer YOUR_TOKEN"}
    )
    return response.status_code, response.json()

# Test with multiple candidates
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
    futures = [executor.submit(test_recommendation, i) for i in range(1, 21)]
    results = [future.result() for future in futures]
    
print(f"Success rate: {sum(1 for status, _ in results if status == 200)}/20")
```

## 🔍 Expected Results

### Technical Test Scoring
- **Input**: Candidate skills + Job requirements + Test results
- **Output**: Weighted score 0.0-1.0 based on relevant test performance
- **Formula**: `sum(weight_i * normalized_score_i) / sum(weight_i)`

### Overall Recommendation Score
- **Components**: 
  - Skill Match (30%)
  - Technical Tests (25%) 
  - Experience (15%)
  - Salary Fit (10%)
  - Location (10%)
  - Cluster Fit (10%)
  - Employability (5%)

### Sample API Response
```json
{
  "recommendations": [
    {
      "job_offer": {
        "id": 1,
        "title": "Senior Python Developer",
        "company": "TechCorp Morocco",
        "location": "Casablanca",
        "salary_range": "15000-25000 MAD"
      },
      "scores": {
        "overall_score": 0.847,
        "technical_test_score": 0.892,
        "skill_match_score": 0.833,
        "experience_score": 0.750,
        "salary_score": 0.900,
        "location_score": 1.000,
        "cluster_fit_score": 0.678
      },
      "breakdown": {
        "matched_skills": ["Python", "Django", "PostgreSQL"],
        "missing_skills": ["React"],
        "technical_tests": {
          "Python": {"score": 89.2, "weight": 1.0, "passed": true},
          "Django": {"score": 85.5, "weight": 0.8, "passed": true}
        }
      },
      "computed_at": "2025-09-29T01:15:30Z"
    }
  ],
  "total_count": 25,
  "algorithm_version": "cognitive_v1.0"
}
```

## 🐛 Troubleshooting

### Common Issues
1. **Migration errors**: Run `python manage.py migrate --fake-initial`
2. **Celery not working**: Check Redis connection and start worker
3. **No recommendations**: Ensure test data exists and scoring weights are configured
4. **Low scores**: Check skill mappings and test result data

### Debug Commands
```bash
# Check migration status
python manage.py showmigrations recommendation

# Verify Celery tasks
python manage.py shell -c "from recommendation.tasks import compute_recommendations_for_candidate; print('Tasks imported successfully')"

# Check scoring weights
python manage.py shell -c "from recommendation.models import ScoringWeights; print(ScoringWeights.objects.filter(is_active=True).first().__dict__)"
```

## 📊 Success Metrics
- ✅ API endpoints return 200 status
- ✅ Recommendations have scores between 0.0-1.0
- ✅ Technical test scores reflect actual test performance
- ✅ Skill matching identifies correct overlaps
- ✅ Background tasks process without errors
- ✅ Database queries execute efficiently (<100ms)
- ✅ K-means clustering produces reasonable silhouette scores (>0.3)

The system is ready for production use! 🎉
