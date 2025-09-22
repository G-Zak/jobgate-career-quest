"""
Serializers for recommendation models
"""
from rest_framework import serializers
from .models import JobOffer, JobRecommendation, UserJobPreference, JobApplication
from skills.models import Skill, CandidateProfile


class SkillSerializer(serializers.ModelSerializer):
    """Serializer for Skill model"""
    class Meta:
        model = Skill
        fields = ['id', 'name', 'category', 'description']


class JobOfferSerializer(serializers.ModelSerializer):
    """Serializer for JobOffer model"""
    required_skills = SkillSerializer(many=True, read_only=True)
    preferred_skills = SkillSerializer(many=True, read_only=True)
    salary_range = serializers.ReadOnlyField()
    is_active = serializers.ReadOnlyField()
    
    class Meta:
        model = JobOffer
        fields = [
            'id', 'title', 'company', 'description', 'requirements', 'responsibilities',
            'job_type', 'seniority', 'location', 'city', 'remote',
            'salary_min', 'salary_max', 'salary_currency', 'salary_range',
            'required_skills', 'preferred_skills', 'tags',
            'status', 'posted_at', 'updated_at', 'expires_at', 'is_active',
            'contact_email', 'contact_phone', 'benefits', 'company_size', 'industry'
        ]


class JobRecommendationSerializer(serializers.ModelSerializer):
    """Serializer for JobRecommendation model"""
    job = JobOfferSerializer(read_only=True)
    candidate_name = serializers.CharField(source='candidate.full_name', read_only=True)
    
    class Meta:
        model = JobRecommendation
        fields = [
            'id', 'job', 'candidate_name',
            'overall_score', 'skill_match_score', 'salary_fit_score',
            'location_match_score', 'seniority_match_score', 'remote_bonus',
            'matched_skills', 'missing_skills', 'recommendation_reason',
            'status', 'created_at', 'updated_at'
        ]


class UserJobPreferenceSerializer(serializers.ModelSerializer):
    """Serializer for UserJobPreference model"""
    preferred_skills = SkillSerializer(many=True, read_only=True)
    
    class Meta:
        model = UserJobPreference
        fields = [
            'id', 'preferred_cities', 'preferred_countries', 'accepts_remote',
            'preferred_job_types', 'preferred_seniority',
            'target_salary_min', 'target_salary_max', 'salary_currency',
            'preferred_skills', 'skill_weights',
            'preferred_industries', 'preferred_company_sizes',
            'max_recommendations', 'min_score_threshold',
            'created_at', 'updated_at'
        ]


class JobApplicationSerializer(serializers.ModelSerializer):
    """Serializer for JobApplication model"""
    job = JobOfferSerializer(read_only=True)
    candidate_name = serializers.CharField(source='candidate.full_name', read_only=True)
    recommendation_score = serializers.FloatField(source='recommendation.overall_score', read_only=True)
    
    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'candidate_name', 'recommendation_score',
            'cover_letter', 'status', 'applied_at', 'updated_at', 'notes'
        ]


class JobSearchSerializer(serializers.Serializer):
    """Serializer for job search parameters"""
    q = serializers.CharField(required=False, allow_blank=True)
    location = serializers.CharField(required=False, allow_blank=True)
    job_type = serializers.ChoiceField(
        choices=JobOffer.JOB_TYPES,
        required=False,
        allow_blank=True
    )
    seniority = serializers.ChoiceField(
        choices=JobOffer.SENIORITY_LEVELS,
        required=False,
        allow_blank=True
    )
    remote = serializers.BooleanField(required=False)
    min_salary = serializers.IntegerField(required=False, min_value=0)
    max_salary = serializers.IntegerField(required=False, min_value=0)
    skills = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True
    )


class RecommendationRequestSerializer(serializers.Serializer):
    """Serializer for recommendation request parameters"""
    limit = serializers.IntegerField(default=10, min_value=1, max_value=50)
    min_score = serializers.FloatField(default=50.0, min_value=0.0, max_value=100.0)
    status = serializers.ChoiceField(
        choices=['new', 'viewed', 'applied', 'interested', 'not_interested'],
        required=False,
        allow_blank=True
    )


class ApplicationRequestSerializer(serializers.Serializer):
    """Serializer for job application request"""
    cover_letter = serializers.CharField(required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)


class PreferenceUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user preferences"""
    class Meta:
        model = UserJobPreference
        fields = [
            'preferred_cities', 'preferred_countries', 'accepts_remote',
            'preferred_job_types', 'preferred_seniority',
            'target_salary_min', 'target_salary_max', 'salary_currency',
            'preferred_industries', 'preferred_company_sizes',
            'max_recommendations', 'min_score_threshold'
        ]
    
    def validate_preferred_cities(self, value):
        """Validate preferred cities list"""
        if not isinstance(value, list):
            raise serializers.ValidationError("Preferred cities must be a list")
        return value
    
    def validate_preferred_job_types(self, value):
        """Validate preferred job types"""
        if not isinstance(value, list):
            raise serializers.ValidationError("Preferred job types must be a list")
        valid_types = [choice[0] for choice in JobOffer.JOB_TYPES]
        for job_type in value:
            if job_type not in valid_types:
                raise serializers.ValidationError(f"Invalid job type: {job_type}")
        return value
    
    def validate_target_salary_min(self, value):
        """Validate minimum target salary"""
        if value is not None and value < 0:
            raise serializers.ValidationError("Minimum salary cannot be negative")
        return value
    
    def validate_target_salary_max(self, value):
        """Validate maximum target salary"""
        if value is not None and value < 0:
            raise serializers.ValidationError("Maximum salary cannot be negative")
        return value
    
    def validate(self, data):
        """Validate salary range"""
        min_salary = data.get('target_salary_min')
        max_salary = data.get('target_salary_max')
        
        if min_salary is not None and max_salary is not None:
            if min_salary > max_salary:
                raise serializers.ValidationError(
                    "Minimum salary cannot be greater than maximum salary"
                )
        
        return data

