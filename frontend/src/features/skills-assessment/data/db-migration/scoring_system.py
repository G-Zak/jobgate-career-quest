"""
Comprehensive Scoring System for Skills Assessment Tests
Supports multiple scoring algorithms and detailed analytics
"""

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal
import json
import math
from typing import Dict, List, Tuple, Any


class ScoringProfile(models.Model):
    """
    Defines scoring rules and weightings for different test types
    """
    SCORING_METHODS = [
        ('raw_score', 'Raw Score (Simple Correct/Total)'),
        ('weighted_difficulty', 'Weighted by Difficulty'),
        ('irt_score', 'Item Response Theory'),
        ('adaptive_score', 'Adaptive Scoring'),
        ('competency_based', 'Competency-Based Scoring'),
        ('percentile_rank', 'Percentile Ranking'),
    ]
    
    name = models.CharField(max_length=100)
    test_type = models.CharField(max_length=20)
    scoring_method = models.CharField(max_length=30, choices=SCORING_METHODS)
    
    # Scoring parameters
    difficulty_weights = models.JSONField(
        default=dict,
        help_text='{"easy": 1.0, "medium": 1.5, "hard": 2.0}'
    )
    category_weights = models.JSONField(
        default=dict,
        help_text='Category-specific weights for competency scoring'
    )
    time_penalty_factor = models.DecimalField(
        max_digits=4, decimal_places=3, default=0.0,
        help_text='Penalty factor for time overruns (0.0 = no penalty)'
    )
    guess_correction = models.BooleanField(
        default=False,
        help_text='Apply correction for guessing'
    )
    
    # Scaling parameters
    scale_min = models.IntegerField(default=0)
    scale_max = models.IntegerField(default=100)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['test_type', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.test_type})"


class TestScore(models.Model):
    """
    Detailed scoring results for a completed test session
    """
    session = models.OneToOneField(
        'UserTestSession', 
        on_delete=models.CASCADE, 
        related_name='detailed_score'
    )
    scoring_profile = models.ForeignKey(ScoringProfile, on_delete=models.CASCADE)
    
    # Overall scores
    raw_score = models.IntegerField(help_text='Number of correct answers')
    weighted_score = models.DecimalField(max_digits=8, decimal_places=3)
    percentage_score = models.DecimalField(max_digits=5, decimal_places=2)
    scaled_score = models.IntegerField(help_text='Score on defined scale (e.g., 0-100)')
    
    # Performance metrics
    completion_time = models.IntegerField(help_text='Total time taken in seconds')
    time_per_question = models.DecimalField(max_digits=6, decimal_places=2)
    accuracy_rate = models.DecimalField(max_digits=5, decimal_places=2)
    
    # Advanced scoring
    ability_estimate = models.DecimalField(
        max_digits=6, decimal_places=3, null=True, blank=True,
        help_text='IRT ability estimate (theta)'
    )
    confidence_interval = models.JSONField(
        default=dict, blank=True,
        help_text='Confidence interval for ability estimate'
    )
    
    # Category breakdown
    category_scores = models.JSONField(
        default=dict,
        help_text='Scores broken down by category/competency'
    )
    difficulty_breakdown = models.JSONField(
        default=dict,
        help_text='Performance by difficulty level'
    )
    
    # Percentile and ranking
    percentile_rank = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )
    stanine_score = models.IntegerField(
        null=True, blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(9)]
    )
    
    # Diagnostic information
    strengths = models.JSONField(default=list, help_text='Identified strengths')
    weaknesses = models.JSONField(default=list, help_text='Areas for improvement')
    recommendations = models.JSONField(default=list, help_text='Improvement recommendations')
    
    calculated_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-calculated_at']
    
    def __str__(self):
        return f"{self.session.user.username} - {self.scaled_score}/{self.scoring_profile.scale_max}"


class CategoryScore(models.Model):
    """
    Detailed scoring for specific categories/competencies
    """
    test_score = models.ForeignKey(TestScore, on_delete=models.CASCADE, related_name='category_details')
    category = models.CharField(max_length=50)
    subcategory = models.CharField(max_length=50, blank=True)
    
    # Category-specific scores
    questions_attempted = models.IntegerField()
    questions_correct = models.IntegerField()
    raw_score = models.DecimalField(max_digits=5, decimal_places=2)
    weighted_score = models.DecimalField(max_digits=5, decimal_places=2)
    percentage = models.DecimalField(max_digits=5, decimal_places=2)
    
    # Performance level
    PERFORMANCE_LEVELS = [
        ('excellent', 'Excellent (90-100%)'),
        ('proficient', 'Proficient (80-89%)'),
        ('developing', 'Developing (70-79%)'),
        ('basic', 'Basic (60-69%)'),
        ('below_basic', 'Below Basic (<60%)'),
    ]
    performance_level = models.CharField(max_length=20, choices=PERFORMANCE_LEVELS)
    
    # Time analysis
    avg_time_per_question = models.DecimalField(max_digits=6, decimal_places=2)
    time_efficiency = models.DecimalField(
        max_digits=5, decimal_places=2,
        help_text='Time efficiency compared to expected time'
    )
    
    class Meta:
        ordering = ['category', 'subcategory']
    
    def __str__(self):
        return f"{self.category}: {self.percentage}%"


class ScoringEngine:
    """
    Main scoring engine with multiple algorithms
    """
    
    @staticmethod
    def calculate_raw_score(responses: List[Dict]) -> Dict[str, Any]:
        """Calculate basic raw score"""
        total_questions = len(responses)
        correct_answers = sum(1 for r in responses if r.get('is_correct', False))
        
        return {
            'raw_score': correct_answers,
            'total_questions': total_questions,
            'percentage': (correct_answers / total_questions * 100) if total_questions > 0 else 0
        }
    
    @staticmethod
    def calculate_weighted_score(responses: List[Dict], difficulty_weights: Dict[str, float]) -> Dict[str, Any]:
        """Calculate score weighted by difficulty"""
        total_weighted_points = 0
        earned_weighted_points = 0
        
        for response in responses:
            difficulty = response.get('difficulty', 'medium')
            weight = difficulty_weights.get(difficulty, 1.0)
            total_weighted_points += weight
            
            if response.get('is_correct', False):
                earned_weighted_points += weight
        
        percentage = (earned_weighted_points / total_weighted_points * 100) if total_weighted_points > 0 else 0
        
        return {
            'weighted_score': earned_weighted_points,
            'total_weighted_points': total_weighted_points,
            'weighted_percentage': percentage
        }
    
    @staticmethod
    def calculate_category_scores(responses: List[Dict], category_weights: Dict[str, float] = None) -> Dict[str, Dict]:
        """Calculate scores by category"""
        if category_weights is None:
            category_weights = {}
        
        categories = {}
        
        for response in responses:
            category = response.get('category', 'general')
            if category not in categories:
                categories[category] = {
                    'total': 0,
                    'correct': 0,
                    'times': [],
                    'difficulties': []
                }
            
            categories[category]['total'] += 1
            if response.get('is_correct', False):
                categories[category]['correct'] += 1
            
            if 'time_taken' in response:
                categories[category]['times'].append(response['time_taken'])
            
            categories[category]['difficulties'].append(response.get('difficulty', 'medium'))
        
        # Calculate category statistics
        category_scores = {}
        for category, data in categories.items():
            total = data['total']
            correct = data['correct']
            percentage = (correct / total * 100) if total > 0 else 0
            
            # Determine performance level
            if percentage >= 90:
                level = 'excellent'
            elif percentage >= 80:
                level = 'proficient'
            elif percentage >= 70:
                level = 'developing'
            elif percentage >= 60:
                level = 'basic'
            else:
                level = 'below_basic'
            
            category_scores[category] = {
                'total_questions': total,
                'correct_answers': correct,
                'percentage': percentage,
                'performance_level': level,
                'avg_time': sum(data['times']) / len(data['times']) if data['times'] else 0,
                'weight': category_weights.get(category, 1.0)
            }
        
        return category_scores
    
    @staticmethod
    def calculate_time_penalties(responses: List[Dict], expected_time_per_question: int, penalty_factor: float) -> float:
        """Calculate time-based penalties"""
        if penalty_factor == 0:
            return 0
        
        total_penalty = 0
        for response in responses:
            time_taken = response.get('time_taken', 0)
            if time_taken > expected_time_per_question:
                overtime = time_taken - expected_time_per_question
                penalty = (overtime / expected_time_per_question) * penalty_factor
                total_penalty += min(penalty, 1.0)  # Cap penalty at 100%
        
        return total_penalty
    
    @staticmethod
    def apply_guess_correction(raw_score: int, total_questions: int, num_choices: int = 4) -> float:
        """Apply correction for guessing (formula for multiple choice)"""
        if num_choices <= 1:
            return raw_score
        
        wrong_answers = total_questions - raw_score
        correction = wrong_answers / (num_choices - 1)
        corrected_score = raw_score - correction
        
        return max(0, corrected_score)  # Don't allow negative scores
    
    @staticmethod
    def calculate_percentile_rank(score: float, all_scores: List[float]) -> float:
        """Calculate percentile rank compared to other test takers"""
        if not all_scores:
            return 0
        
        scores_below = sum(1 for s in all_scores if s < score)
        scores_equal = sum(1 for s in all_scores if s == score)
        
        percentile = (scores_below + 0.5 * scores_equal) / len(all_scores) * 100
        return percentile
    
    @staticmethod
    def calculate_stanine(percentile: float) -> int:
        """Convert percentile to stanine score (1-9)"""
        if percentile >= 96:
            return 9
        elif percentile >= 89:
            return 8
        elif percentile >= 77:
            return 7
        elif percentile >= 60:
            return 6
        elif percentile >= 40:
            return 5
        elif percentile >= 23:
            return 4
        elif percentile >= 11:
            return 3
        elif percentile >= 4:
            return 2
        else:
            return 1
    
    @classmethod
    def generate_recommendations(cls, category_scores: Dict[str, Dict], test_type: str) -> List[str]:
        """Generate personalized recommendations based on performance"""
        recommendations = []
        
        # Find weak areas
        weak_categories = [
            cat for cat, data in category_scores.items() 
            if data['percentage'] < 70
        ]
        
        # Find strong areas
        strong_categories = [
            cat for cat, data in category_scores.items() 
            if data['percentage'] >= 85
        ]
        
        # Test-specific recommendations
        if test_type == 'sjt':
            if 'ethics' in weak_categories:
                recommendations.append("Review ethical decision-making frameworks and professional codes of conduct")
            if 'teamwork' in weak_categories:
                recommendations.append("Practice collaborative problem-solving and team communication skills")
            if 'leadership' in weak_categories:
                recommendations.append("Study leadership theories and practice delegation scenarios")
        
        elif test_type == 'verbal':
            if 'analogies' in weak_categories:
                recommendations.append("Practice identifying relationships between word pairs and concepts")
            if 'blood_relations' in weak_categories:
                recommendations.append("Work on logical reasoning and family relationship problems")
            if 'classification' in weak_categories:
                recommendations.append("Improve pattern recognition and categorization skills")
        
        elif test_type == 'spatial':
            if 'mental_rotation' in weak_categories:
                recommendations.append("Practice 3D visualization and mental rotation exercises")
            if 'shape_assembly' in weak_categories:
                recommendations.append("Work on spatial construction and assembly problems")
        
        # Time-based recommendations
        slow_categories = [
            cat for cat, data in category_scores.items() 
            if data.get('avg_time', 0) > 120  # More than 2 minutes per question
        ]
        
        if slow_categories:
            recommendations.append(f"Focus on improving speed in: {', '.join(slow_categories)}")
        
        # General recommendations
        if len(weak_categories) > len(strong_categories):
            recommendations.append("Consider additional practice sessions to strengthen weak areas")
        
        if strong_categories:
            recommendations.append(f"Leverage your strengths in {', '.join(strong_categories)} for career opportunities")
        
        return recommendations[:5]  # Limit to top 5 recommendations


class TestScoreCalculator:
    """
    Main class for calculating comprehensive test scores
    """
    
    def __init__(self, session, scoring_profile: ScoringProfile):
        self.session = session
        self.scoring_profile = scoring_profile
        self.responses = list(session.responses.all())
    
    def calculate_comprehensive_score(self) -> TestScore:
        """Calculate complete score with all metrics"""
        
        # Prepare response data
        response_data = []
        for response in self.responses:
            response_data.append({
                'is_correct': response.is_correct,
                'time_taken': response.time_taken,
                'difficulty': response.question.difficulty,
                'category': response.question.category,
                'subcategory': response.question.subcategory or '',
            })
        
        # Calculate basic scores
        raw_results = ScoringEngine.calculate_raw_score(response_data)
        weighted_results = ScoringEngine.calculate_weighted_score(
            response_data, 
            self.scoring_profile.difficulty_weights
        )
        
        # Calculate category scores
        category_scores = ScoringEngine.calculate_category_scores(
            response_data,
            self.scoring_profile.category_weights
        )
        
        # Apply time penalties if configured
        time_penalty = ScoringEngine.calculate_time_penalties(
            response_data,
            expected_time_per_question=60,  # 1 minute default
            penalty_factor=float(self.scoring_profile.time_penalty_factor)
        )
        
        # Apply guess correction if enabled
        final_raw_score = raw_results['raw_score']
        if self.scoring_profile.guess_correction:
            final_raw_score = ScoringEngine.apply_guess_correction(
                raw_results['raw_score'],
                raw_results['total_questions']
            )
        
        # Calculate final percentage with penalties
        final_percentage = max(0, weighted_results['weighted_percentage'] - time_penalty)
        
        # Scale to defined range
        scaled_score = int(
            (final_percentage / 100) * 
            (self.scoring_profile.scale_max - self.scoring_profile.scale_min) + 
            self.scoring_profile.scale_min
        )
        
        # Calculate percentile (would need historical data in real implementation)
        # For now, estimate based on normal distribution
        percentile_rank = min(99.9, max(0.1, final_percentage))
        stanine = ScoringEngine.calculate_stanine(percentile_rank)
        
        # Generate recommendations
        recommendations = ScoringEngine.generate_recommendations(
            category_scores, 
            self.session.test_configuration.test_type
        )
        
        # Identify strengths and weaknesses
        strengths = [
            cat for cat, data in category_scores.items() 
            if data['percentage'] >= 80
        ]
        weaknesses = [
            cat for cat, data in category_scores.items() 
            if data['percentage'] < 60
        ]
        
        # Create comprehensive score record
        test_score = TestScore.objects.create(
            session=self.session,
            scoring_profile=self.scoring_profile,
            raw_score=raw_results['raw_score'],
            weighted_score=Decimal(str(weighted_results['weighted_score'])),
            percentage_score=Decimal(str(final_percentage)),
            scaled_score=scaled_score,
            completion_time=self.session.time_taken,
            time_per_question=Decimal(str(self.session.time_taken / len(self.responses))),
            accuracy_rate=Decimal(str(final_percentage)),
            percentile_rank=Decimal(str(percentile_rank)),
            stanine_score=stanine,
            category_scores=category_scores,
            difficulty_breakdown=self._calculate_difficulty_breakdown(response_data),
            strengths=strengths,
            weaknesses=weaknesses,
            recommendations=recommendations
        )
        
        # Create detailed category scores
        for category, data in category_scores.items():
            CategoryScore.objects.create(
                test_score=test_score,
                category=category,
                questions_attempted=data['total_questions'],
                questions_correct=data['correct_answers'],
                raw_score=Decimal(str(data['correct_answers'])),
                weighted_score=Decimal(str(data['correct_answers'] * data['weight'])),
                percentage=Decimal(str(data['percentage'])),
                performance_level=data['performance_level'],
                avg_time_per_question=Decimal(str(data['avg_time'])),
                time_efficiency=Decimal(str(100.0))  # Would calculate based on expected times
            )
        
        return test_score
    
    def _calculate_difficulty_breakdown(self, response_data: List[Dict]) -> Dict[str, Dict]:
        """Calculate performance breakdown by difficulty level"""
        difficulties = {}
        
        for response in response_data:
            difficulty = response['difficulty']
            if difficulty not in difficulties:
                difficulties[difficulty] = {'total': 0, 'correct': 0}
            
            difficulties[difficulty]['total'] += 1
            if response['is_correct']:
                difficulties[difficulty]['correct'] += 1
        
        # Calculate percentages
        for difficulty, data in difficulties.items():
            data['percentage'] = (data['correct'] / data['total'] * 100) if data['total'] > 0 else 0
        
        return difficulties


# Usage example and management command integration would go here
