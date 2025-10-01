# Job Recommendation System

## Overview

This enhanced job recommendation system integrates employability scores, technical test results, and clustering algorithms to provide accurate job-candidate matching for the Moroccan job market.

## Key Features

- **Technical Test Integration**: Maps job skills to technical tests and computes weighted performance scores
- **Skills Assessment**: Incorporates employability scores from psychometric tests
- **Clustering Algorithm**: Uses statistical methods to find similar candidate-job patterns
- **Moroccan Market Focus**: Realistic salary ranges, local cities, MAD currency
- **Background Processing**: Celery tasks for batch computation and real-time updates
- **Comprehensive API**: RESTful endpoints for all operations
- **Audit Trail**: Tracks recommendation changes and algorithm versions

## Algorithm Specification

### Technical Test Score Calculation

```
technical_test_score = sum(weight_i * normalized_score_i) / sum(weight_i)
passed_ratio = (# tests with score >= test_pass_threshold) / (#relevant_tests)
```

Where:
- `weight_i` = 1.0 for required skills, 0.5 for preferred skills
- `normalized_score_i` = test_score / 100.0 (0-1 range)
- `test_pass_threshold` = 70.0 (configurable)

### Overall Ranking Formula

```
overall_score = 
  skill_match_weight * skill_match_score +
  technical_test_weight * technical_test_score +
  experience_weight * experience_score +
  salary_weight * salary_score +
  location_weight * location_score +
  cluster_fit_weight * cluster_fit_score +
  employability_weight * employability_score
```

Default weights:
- skill_match: 0.30
- technical_test: 0.25
- experience: 0.15
- salary: 0.10
- location: 0.10
- cluster_fit: 0.10
- employability: 0.05

## Installation & Setup

### 1. Database Migration

```bash
cd backend
python manage.py makemigrations recommendation
python manage.py migrate
```

### 2. Install Dependencies

```bash
pip install scikit-learn celery redis
```

### 3. Seed Data

```bash
# Create 200+ Moroccan job offers
python manage.py seed_moroccan_jobs --count 200

# Create skill-technical test mappings
python manage.py seed_skill_test_mappings

# Create default scoring weights (automatic on first use)
```

### 4. Start Celery Workers

```bash
# Start Redis (required for Celery)
redis-server

# Start Celery worker
celery -A your_project worker --loglevel=info

# Start Celery beat (for periodic tasks)
celery -A your_project beat --loglevel=info
```

## API Endpoints

### Candidate Recommendations

```bash
# Get recommendations for a candidate
GET /api/cognitive/candidate/{candidate_id}/recommendations/
  ?limit=10&min_score=0.0&include_breakdown=true

# Trigger recomputation for a candidate
POST /api/cognitive/candidate/{candidate_id}/recompute/
{
  "job_offer_ids": [1, 2, 3]  # optional
}
```

### Job Recommendations (Admin)

```bash
# Get candidate recommendations for a job
GET /api/cognitive/job/{job_offer_id}/recommendations/
  ?limit=20&min_score=0.0&include_breakdown=true
```

### Batch Operations (Admin)

```bash
# Recompute all recommendations
POST /api/cognitive/batch-recompute/

# Train K-Means clustering model
POST /api/cognitive/train-clustering/
{
  "n_clusters": 8
}
```

### System Information

```bash
# Get current scoring weights
GET /api/cognitive/scoring-weights/

# Get cluster model info
GET /api/cognitive/cluster-info/

# Get system statistics
GET /api/cognitive/stats/
```

### Webhooks

```bash
# Test submission webhook (triggers recommendation updates)
POST /api/cognitive/webhook/test-submission/
{
  "candidate_id": 123,
  "test_id": 456
}
```

## Configuration

### Changing Scoring Weights

1. **Via Django Admin**: Go to Recommendation > Scoring Weights
2. **Via API**: Create new ScoringWeights record and set `is_active=True`

Example weights configuration:
```python
ScoringWeights.objects.create(
    name="custom_weights",
    is_active=True,
    skill_match_weight=0.35,
    technical_test_weight=0.30,
    experience_weight=0.15,
    salary_weight=0.05,
    location_weight=0.10,
    cluster_fit_weight=0.05,
    test_pass_threshold=75.0
)
```

### Default Values

- **test_pass_threshold**: 70.0 (minimum score to consider test passed)
- **missing test results**: 0 (candidates without test results get 0 score)
- **normalization method**: min-max across current candidate-job raw scores
- **cluster retraining**: weekly (configurable via Celery beat)

## Database Schema

### New Models

- **SkillTechnicalTestMapping**: Maps skills to technical tests with weights
- **ClusterCenters**: Stores K-Means model parameters and metadata
- **Enhanced JobRecommendation**: Individual score components and detailed breakdown
- **RecommendationAudit**: Tracks recommendation changes over time

### Enhanced Models

- **JobOffer**: Added Morocco-specific fields (currency=MAD, source_type, remote_flag)
- **ScoringWeights**: Updated for technical test and cognitive skill weights

## Example Queries

### Find Top Recommendations

```sql
SELECT 
    jr.candidate_id,
    jo.title,
    jo.company,
    jr.overall_score,
    jr.technical_test_score,
    jr.breakdown->>'technical_test'->>'passed_ratio' as passed_ratio
FROM recommendation_jobrecommendation jr
JOIN recommendation_joboffer jo ON jr.job_offer_id = jo.id
WHERE jr.candidate_id = 123
ORDER BY jr.overall_score DESC
LIMIT 10;
```

### Analyze Technical Test Performance

```sql
SELECT 
    jo.title,
    AVG(jr.technical_test_score) as avg_tech_score,
    COUNT(*) as candidate_count
FROM recommendation_jobrecommendation jr
JOIN recommendation_joboffer jo ON jr.job_offer_id = jo.id
WHERE jr.technical_test_score > 0
GROUP BY jo.title
ORDER BY avg_tech_score DESC;
```

### Check Skill Coverage

```sql
SELECT 
    s.name,
    s.category,
    COUNT(stm.id) as test_mappings
FROM skills_skill s
LEFT JOIN recommendation_skilltechnicaltestmapping stm ON s.id = stm.skill_id
GROUP BY s.id, s.name, s.category
ORDER BY test_mappings DESC;
```

## Testing

### cURL Examples

```bash
# Get recommendations for candidate
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:8000/api/cognitive/candidate/123/recommendations/?limit=5"

# Trigger recomputation
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  "http://localhost:8000/api/cognitive/candidate/123/recompute/"

# Train clustering model
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"n_clusters": 8}' \
  "http://localhost:8000/api/cognitive/train-clustering/"
```

### Verification Steps

1. **Check Data**: Verify job offers and skill mappings exist
2. **Test API**: Call recommendation endpoints and verify response format
3. **Check Scores**: Ensure breakdown JSON contains technical_test_score and passed_ratio
4. **Verify Background Tasks**: Check Celery logs for successful task execution
5. **Validate Clustering**: Confirm K-Means model training and cluster assignments

## Troubleshooting

### Common Issues

1. **No Recommendations**: Check if candidate has skills and test results
2. **Zero Technical Scores**: Verify skill-test mappings exist
3. **Celery Tasks Failing**: Check Redis connection and worker logs
4. **Clustering Errors**: Ensure sufficient candidate/job data (minimum 10 candidates, 5 jobs)

### Debug Commands

```bash
# Check recommendation count
python manage.py shell -c "from recommendation.models import JobRecommendation; print(JobRecommendation.objects.count())"

# Test service directly
python manage.py shell -c "
from recommendation.cognitive_recommendation_service import CognitiveRecommendationService
service = CognitiveRecommendationService()
print(service.compute_technical_test_score(123, job_offer))
"

# Check cluster model
python manage.py shell -c "from recommendation.models import ClusterCenters; print(ClusterCenters.objects.filter(is_active=True).first())"
```

## Performance Considerations

- **Batch Processing**: Use Celery tasks for large-scale recomputation
- **Database Indexes**: Added on candidate_id, job_offer, overall_score, computed_at
- **Caching**: Consider Redis caching for frequently accessed recommendations
- **Clustering**: Retrain weekly or when data changes significantly (>20%)

## Future Enhancements

- **Real-time Updates**: WebSocket notifications for recommendation changes
- **A/B Testing**: Multiple algorithm versions with performance comparison
- **Advanced Clustering**: Try DBSCAN, hierarchical clustering
- **Personalization**: User feedback integration and preference learning
- **Explainability**: Detailed reasoning for recommendation scores
