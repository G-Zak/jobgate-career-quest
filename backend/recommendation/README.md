# Job Recommendation System

A comprehensive job recommendation system that matches candidates with job opportunities based on skills, preferences, and test performance.

## Features

### 🎯 Smart Matching Algorithm
- **Skill-based matching**: Analyzes candidate skills against job requirements
- **Preference-based filtering**: Considers location, salary, job type, and seniority preferences
- **Test performance integration**: Uses test results to build skill proficiency profiles
- **Multi-factor scoring**: Combines skills (60%), salary (15%), location (10%), seniority (10%), and remote work (10%)

### 📊 Comprehensive Data Models
- **JobOffer**: Complete job posting information with skills, salary, location, and metadata
- **JobRecommendation**: Personalized recommendations with detailed scoring breakdown
- **UserJobPreference**: User preferences for job matching and filtering
- **JobApplication**: Track application status and history

### 🔧 Advanced Services
- **RecommendationEngine**: Core algorithm for job matching and scoring
- **SkillAnalyzer**: Analyzes user skills from test results and profile data
- **Management Commands**: Tools for data management and recommendation generation

## API Endpoints

### Job Recommendations
- `GET /api/recommendations/` - Get personalized job recommendations
- `GET /api/recommendations/jobs/<id>/` - Get detailed job information with match score
- `POST /api/recommendations/recommendations/<id>/status/` - Update recommendation status

### Job Search
- `GET /api/recommendations/jobs/search/` - Search jobs with filters
- `POST /api/recommendations/jobs/<id>/apply/` - Apply to a job
- `GET /api/recommendations/applications/` - Get user's job applications

### User Preferences
- `GET /api/recommendations/preferences/` - Get user job preferences
- `PUT /api/recommendations/preferences/` - Update user job preferences

### Skills Analysis
- `GET /api/recommendations/skills/analysis/` - Get user skills analysis

## Usage Examples

### Get Job Recommendations
```bash
curl -H "Authorization: Bearer <token>" \
     "http://localhost:8000/api/recommendations/?limit=10&min_score=70"
```

### Search Jobs
```bash
curl -H "Authorization: Bearer <token>" \
     "http://localhost:8000/api/recommendations/jobs/search/?q=python&location=casablanca&remote=true"
```

### Update Preferences
```bash
curl -X PUT -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"preferred_cities": ["Casablanca", "Rabat"], "accepts_remote": true}' \
     "http://localhost:8000/api/recommendations/preferences/"
```

## Management Commands

### Generate Recommendations
```bash
python manage.py generate_recommendations --limit 10
python manage.py generate_recommendations --candidate-id 1 --force
```

### Create Sample Jobs
```bash
python manage.py create_sample_jobs --count 50 --clear
```

## Algorithm Details

### Skill Matching
1. **Required Skills**: Exact match with job requirements (primary factor)
2. **Preferred Skills**: Bonus points for additional skills
3. **Category Weighting**: Different skill categories have different weights
4. **Proficiency Scoring**: Test performance affects skill scores

### Scoring Formula
```
Overall Score = (Skill Match × 0.6) + (Salary Fit × 0.15) + 
                (Location Match × 0.1) + (Seniority Match × 0.1) + 
                Remote Bonus
```

### Skill Categories & Weights
- Programming: 1.0
- Frontend/Backend: 0.9
- Database/DevOps: 0.8
- Mobile: 0.7
- Testing: 0.6
- Other: 0.5

## Data Models

### JobOffer
- Complete job posting information
- Skills requirements (required + preferred)
- Salary range and location details
- Company information and benefits
- Status and expiration tracking

### JobRecommendation
- Personalized recommendations with detailed scoring
- Matched and missing skills analysis
- Recommendation reasoning
- User interaction tracking

### UserJobPreference
- Location preferences (cities, countries, remote work)
- Job type and seniority preferences
- Salary expectations
- Skill preferences and weights
- Recommendation settings

### JobApplication
- Application tracking and status management
- Cover letter and notes
- Association with recommendations
- Application history

## Configuration

### Settings
The recommendation system is configured in `settings.py`:
- App included in `INSTALLED_APPS`
- URLs configured in main `urls.py`
- Admin interface available

### Database
Run migrations to create the required tables:
```bash
python manage.py makemigrations recommendation
python manage.py migrate
```

## Testing

Run the test suite:
```bash
python manage.py test recommendation
```

Test coverage includes:
- Recommendation engine algorithms
- Skill analysis services
- Model functionality
- API endpoints
- Edge cases and error handling

## Admin Interface

The Django admin provides comprehensive management for:
- Job offers with detailed filtering and search
- Job recommendations with scoring breakdown
- User preferences management
- Application tracking and status updates

## Performance Considerations

- **Database Indexing**: Optimized queries for large datasets
- **Caching**: Recommendation results can be cached
- **Batch Processing**: Management commands for bulk operations
- **Pagination**: API endpoints support pagination for large result sets

## Future Enhancements

- **Machine Learning**: Integration with ML models for better matching
- **Real-time Updates**: WebSocket support for live recommendations
- **Analytics**: Detailed analytics on recommendation performance
- **A/B Testing**: Framework for testing different algorithms
- **External APIs**: Integration with job boards and career sites

## Troubleshooting

### Common Issues
1. **No Recommendations**: Check if candidate has skills and jobs exist
2. **Low Scores**: Verify skill matching and preference configuration
3. **Performance**: Use management commands for bulk operations
4. **API Errors**: Check authentication and request format

### Debug Mode
Enable debug logging for detailed algorithm information:
```python
LOGGING = {
    'loggers': {
        'recommendation': {
            'level': 'DEBUG',
            'handlers': ['console'],
        },
    },
}
```

