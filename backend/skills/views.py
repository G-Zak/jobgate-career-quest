"""
Skills API Views
Handles skill-related operations including validated skills from test results
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from .models import Skill, CandidateProfile, TestResult, TechnicalTest
import logging

logger = logging.getLogger(__name__)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_validated_skills(request):
    """
    Get validated skills for the current user based on passed test results
    """
    try:
        user = request.user
        
        # Get candidate profile
        try:
            candidate = CandidateProfile.objects.get(user__username=user.username)
        except CandidateProfile.DoesNotExist:
            return Response({
                'error': 'Candidate profile not found',
                'success': False
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get all test results for this candidate
        test_results = TestResult.objects.filter(
            candidate=candidate,
            status='completed'
        ).select_related('test')
        
        # Map test IDs to skill names
        test_to_skill_mapping = {
            1: 'Python',
            2: 'JavaScript', 
            3: 'React',
            4: 'Django',
            5: 'SQL',
            6: 'SQLite',
            7: 'Java',
            8: 'Git',
            9: 'HTML5'
        }
        
        validated_skills = []
        validated_skills_with_scores = {}
        
        for result in test_results:
            test_id = result.test.id
            skill_name = test_to_skill_mapping.get(test_id)
            
            if skill_name and result.score >= 70:  # 70% passing threshold
                validated_skills.append(skill_name)
                validated_skills_with_scores[skill_name] = {
                    'test_id': test_id,
                    'score': result.score,
                    'percentage': result.score,
                    'passed': True,
                    'completed_at': result.completed_at.isoformat() if result.completed_at else None,
                    'time_taken': result.time_taken
                }
        
        # Remove duplicates
        validated_skills = list(set(validated_skills))
        
        # Get all user skills
        user_skills = []
        if candidate.skills:
            skill_objects = Skill.objects.filter(id__in=candidate.skills)
            user_skills = [skill.name for skill in skill_objects]
        
        # Calculate validation statistics
        total_skills = len(user_skills)
        validated_count = len(validated_skills)
        unvalidated_skills = [skill for skill in user_skills if skill not in validated_skills]
        
        validation_stats = {
            'total_skills': total_skills,
            'validated_count': validated_count,
            'unvalidated_count': len(unvalidated_skills),
            'validation_percentage': round((validated_count / total_skills * 100) if total_skills > 0 else 0),
            'validated_skills': validated_skills,
            'unvalidated_skills': unvalidated_skills
        }
        
        return Response({
            'validated_skills': validated_skills,
            'validated_skills_with_scores': validated_skills_with_scores,
            'validation_stats': validation_stats,
            'user_skills': user_skills,
            'success': True
        })
        
    except Exception as e:
        logger.error(f"Error getting validated skills: {str(e)}")
        return Response({
            'error': f'Failed to get validated skills: {str(e)}',
            'success': False
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_skill_validation_status(request, skill_name):
    """
    Check if a specific skill is validated for the current user
    """
    try:
        user = request.user
        
        # Get candidate profile
        try:
            candidate = CandidateProfile.objects.get(user__username=user.username)
        except CandidateProfile.DoesNotExist:
            return Response({
                'error': 'Candidate profile not found',
                'success': False
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Map skill names to test IDs
        skill_to_test_mapping = {
            'Python': 1,
            'JavaScript': 2, 
            'React': 3,
            'Django': 4,
            'SQL': 5,
            'SQLite': 6,
            'Java': 7,
            'Git': 8,
            'HTML5': 9
        }
        
        test_id = skill_to_test_mapping.get(skill_name)
        if not test_id:
            return Response({
                'is_validated': False,
                'reason': 'No test available for this skill',
                'success': True
            })
        
        # Check if user has passed the test for this skill
        try:
            test_result = TestResult.objects.get(
                candidate=candidate,
                test_id=test_id,
                status='completed'
            )
            
            is_validated = test_result.score >= 70
            validation_data = {
                'is_validated': is_validated,
                'test_id': test_id,
                'score': test_result.score,
                'percentage': test_result.score,
                'passed': is_validated,
                'completed_at': test_result.completed_at.isoformat() if test_result.completed_at else None,
                'time_taken': test_result.time_taken
            } if is_validated else {
                'is_validated': False,
                'test_id': test_id,
                'score': test_result.score,
                'percentage': test_result.score,
                'passed': False,
                'reason': 'Test score below 70% threshold'
            }
            
            return Response({
                **validation_data,
                'success': True
            })
            
        except TestResult.DoesNotExist:
            return Response({
                'is_validated': False,
                'test_id': test_id,
                'reason': 'Test not completed',
                'success': True
            })
        
    except Exception as e:
        logger.error(f"Error checking skill validation status: {str(e)}")
        return Response({
            'error': f'Failed to check skill validation: {str(e)}',
            'success': False
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)