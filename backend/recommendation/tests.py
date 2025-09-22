"""
Tests for recommendation system
"""
from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

from .models import JobOffer, JobRecommendation, UserJobPreference, JobApplication
from .services import RecommendationEngine, SkillAnalyzer
from skills.models import Skill, CandidateProfile


class RecommendationEngineTestCase(TestCase):
    """Test cases for RecommendationEngine"""
    
    def setUp(self):
        """Set up test data"""
        # Create test user and candidate
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.candidate = CandidateProfile.objects.create(
            user=self.user,
            first_name='Test',
            last_name='User',
            email='test@example.com'
        )
        
        # Create test skills
        self.python_skill = Skill.objects.create(
            name='Python',
            category='programming',
            description='Python programming language'
        )
        self.javascript_skill = Skill.objects.create(
            name='JavaScript',
            category='frontend',
            description='JavaScript programming language'
        )
        self.django_skill = Skill.objects.create(
            name='Django',
            category='backend',
            description='Django web framework'
        )
        
        # Add skills to candidate
        self.candidate.skills.add(self.python_skill, self.javascript_skill)
        
        # Create test job
        self.job = JobOffer.objects.create(
            title='Python Developer',
            company='Test Company',
            description='Python developer position',
            requirements='Python, Django experience required',
            responsibilities='Develop web applications',
            job_type='CDI',
            seniority='mid',
            location='Casablanca, Morocco',
            city='Casablanca',
            remote=True,
            salary_min=10000,
            salary_max=15000,
            contact_email='hr@testcompany.com'
        )
        self.job.required_skills.add(self.python_skill, self.django_skill)
        
        # Create user preferences
        self.user_prefs = UserJobPreference.objects.create(
            user=self.user,
            preferred_cities=['Casablanca'],
            accepts_remote=True,
            preferred_job_types=['CDI'],
            preferred_seniority='mid',
            target_salary_min=8000,
            target_salary_max=20000
        )
        
        self.engine = RecommendationEngine()
    
    def test_calculate_skill_similarity(self):
        """Test skill similarity calculation"""
        user_skills = [self.python_skill, self.javascript_skill]
        job_skills = [self.python_skill, self.django_skill]
        
        score, matched, missing = self.engine.calculate_skill_similarity(user_skills, job_skills)
        
        self.assertGreater(score, 0)
        self.assertLessEqual(score, 1)
        self.assertIn('Python', matched)
        self.assertIn('Django', missing)
    
    def test_calculate_salary_fit(self):
        """Test salary fit calculation"""
        score = self.engine.calculate_salary_fit(self.user_prefs, self.job)
        
        self.assertGreater(score, 0)
        self.assertLessEqual(score, 1)
    
    def test_calculate_location_match(self):
        """Test location match calculation"""
        score = self.engine.calculate_location_match(self.user_prefs, self.job)
        
        self.assertEqual(score, 1.0)  # Should match Casablanca
    
    def test_calculate_seniority_match(self):
        """Test seniority match calculation"""
        score = self.engine.calculate_seniority_match(self.user_prefs, self.job)
        
        self.assertEqual(score, 1.0)  # Should match mid level
    
    def test_calculate_remote_bonus(self):
        """Test remote work bonus calculation"""
        bonus = self.engine.calculate_remote_bonus(self.user_prefs, self.job)
        
        self.assertEqual(bonus, 0.1)  # Should get remote bonus
    
    def test_calculate_job_score(self):
        """Test comprehensive job score calculation"""
        score_data = self.engine.calculate_job_score(self.candidate, self.job, self.user_prefs)
        
        self.assertIn('overall_score', score_data)
        self.assertIn('skill_match_score', score_data)
        self.assertIn('matched_skills', score_data)
        self.assertIn('missing_skills', score_data)
        
        self.assertGreater(score_data['overall_score'], 0)
        self.assertLessEqual(score_data['overall_score'], 1)
    
    def test_generate_recommendations(self):
        """Test recommendation generation"""
        recommendations = self.engine.generate_recommendations(self.candidate, limit=5)
        
        self.assertIsInstance(recommendations, list)
        # Should have at least one recommendation since job matches candidate
        self.assertGreater(len(recommendations), 0)
        
        if recommendations:
            rec = recommendations[0]
            self.assertEqual(rec.candidate, self.candidate)
            self.assertEqual(rec.job, self.job)
            self.assertGreater(rec.overall_score, 0)


class SkillAnalyzerTestCase(TestCase):
    """Test cases for SkillAnalyzer"""
    
    def setUp(self):
        """Set up test data"""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.candidate = CandidateProfile.objects.create(
            user=self.user,
            first_name='Test',
            last_name='User',
            email='test@example.com'
        )
        
        self.python_skill = Skill.objects.create(
            name='Python',
            category='programming',
            description='Python programming language'
        )
        self.candidate.skills.add(self.python_skill)
    
    def test_get_user_skill_vector(self):
        """Test user skill vector generation"""
        skill_vector = SkillAnalyzer.get_user_skill_vector(self.candidate)
        
        self.assertIsInstance(skill_vector, dict)
        self.assertIn('Python', skill_vector)
        self.assertGreater(skill_vector['Python'], 0)
    
    def test_get_top_skills(self):
        """Test top skills extraction"""
        top_skills = SkillAnalyzer.get_top_skills(self.candidate, limit=3)
        
        self.assertIsInstance(top_skills, list)
        self.assertGreater(len(top_skills), 0)
        
        if top_skills:
            skill = top_skills[0]
            self.assertIn('name', skill)
            self.assertIn('score', skill)
            self.assertIn('level', skill)
    
    def test_get_skill_level(self):
        """Test skill level determination"""
        self.assertEqual(SkillAnalyzer.get_skill_level(0.95), 'Expert')
        self.assertEqual(SkillAnalyzer.get_skill_level(0.75), 'Avancé')
        self.assertEqual(SkillAnalyzer.get_skill_level(0.55), 'Intermédiaire')
        self.assertEqual(SkillAnalyzer.get_skill_level(0.35), 'Débutant')


class JobRecommendationModelTestCase(TestCase):
    """Test cases for JobRecommendation model"""
    
    def setUp(self):
        """Set up test data"""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.candidate = CandidateProfile.objects.create(
            user=self.user,
            first_name='Test',
            last_name='User',
            email='test@example.com'
        )
        
        self.job = JobOffer.objects.create(
            title='Test Job',
            company='Test Company',
            description='Test job description',
            requirements='Test requirements',
            responsibilities='Test responsibilities',
            job_type='CDI',
            seniority='mid',
            location='Test Location',
            city='Test City',
            contact_email='test@example.com'
        )
    
    def test_create_recommendation(self):
        """Test creating a job recommendation"""
        recommendation = JobRecommendation.objects.create(
            candidate=self.candidate,
            job=self.job,
            overall_score=85.5,
            skill_match_score=80.0,
            salary_fit_score=90.0,
            location_match_score=100.0,
            seniority_match_score=75.0,
            matched_skills=['Python', 'Django'],
            missing_skills=['React'],
            recommendation_reason='Good match for Python developer'
        )
        
        self.assertEqual(recommendation.candidate, self.candidate)
        self.assertEqual(recommendation.job, self.job)
        self.assertEqual(recommendation.overall_score, 85.5)
        self.assertEqual(recommendation.status, 'new')
    
    def test_recommendation_str(self):
        """Test recommendation string representation"""
        recommendation = JobRecommendation.objects.create(
            candidate=self.candidate,
            job=self.job,
            overall_score=85.5,
            skill_match_score=80.0,
            salary_fit_score=90.0,
            location_match_score=100.0,
            seniority_match_score=75.0
        )
        
        expected_str = f"{self.candidate} - {self.job} (85.5%)"
        self.assertEqual(str(recommendation), expected_str)


class JobOfferModelTestCase(TestCase):
    """Test cases for JobOffer model"""
    
    def setUp(self):
        """Set up test data"""
        self.job = JobOffer.objects.create(
            title='Test Job',
            company='Test Company',
            description='Test job description',
            requirements='Test requirements',
            responsibilities='Test responsibilities',
            job_type='CDI',
            seniority='mid',
            location='Test Location',
            city='Test City',
            salary_min=10000,
            salary_max=15000,
            contact_email='test@example.com'
        )
    
    def test_salary_range_property(self):
        """Test salary range property"""
        self.assertEqual(
            self.job.salary_range,
            "10,000 - 15,000 MAD"
        )
    
    def test_is_active_property(self):
        """Test is_active property"""
        self.assertTrue(self.job.is_active)
        
        # Test with expired job
        self.job.expires_at = timezone.now() - timedelta(days=1)
        self.job.save()
        self.assertFalse(self.job.is_active)
    
    def test_job_str(self):
        """Test job string representation"""
        expected_str = f"{self.job.title} - {self.job.company}"
        self.assertEqual(str(self.job), expected_str)


class UserJobPreferenceModelTestCase(TestCase):
    """Test cases for UserJobPreference model"""
    
    def setUp(self):
        """Set up test data"""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_create_preferences(self):
        """Test creating user preferences"""
        prefs = UserJobPreference.objects.create(
            user=self.user,
            preferred_cities=['Casablanca', 'Rabat'],
            accepts_remote=True,
            preferred_job_types=['CDI', 'CDD'],
            preferred_seniority='mid',
            target_salary_min=10000,
            target_salary_max=20000
        )
        
        self.assertEqual(prefs.user, self.user)
        self.assertEqual(prefs.preferred_cities, ['Casablanca', 'Rabat'])
        self.assertTrue(prefs.accepts_remote)
        self.assertEqual(prefs.preferred_seniority, 'mid')
    
    def test_preferences_str(self):
        """Test preferences string representation"""
        prefs = UserJobPreference.objects.create(user=self.user)
        expected_str = f"Préférences de {self.user.username}"
        self.assertEqual(str(prefs), expected_str)