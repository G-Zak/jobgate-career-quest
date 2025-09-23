from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models import Avg, Count, Q, Max
from testsengine.models import TestSession, Test
from recommendation.models import JobRecommendation, JobOffer
from .services import AchievementsService
from .cache_utils import cache_manager
import logging

logger = logging.getLogger(__name__)

class UserRegistrationView(APIView):
    """User registration endpoint using Django's built-in User model"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """Register a new user"""
        try:
            data = request.data
            
            # Validate required fields
            required_fields = ['username', 'email', 'password', 'first_name', 'last_name']
            for field in required_fields:
                if not data.get(field):
                    return Response({
                        'success': False,
                        'message': f'{field} is required'
                    }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if user already exists
            if User.objects.filter(username=data['username']).exists():
                return Response({
                    'success': False,
                    'message': 'Username already exists'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if User.objects.filter(email=data['email']).exists():
                return Response({
                    'success': False,
                    'message': 'Email already exists'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Create user
            user = User.objects.create_user(
                username=data['username'],
                email=data['email'],
                password=data['password'],
                first_name=data['first_name'],
                last_name=data['last_name']
            )
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            
            # Update last login
            user.last_login = timezone.now()
            user.save()
            
            logger.info(f"New user registered: {user.username}")
            
            return Response({
                'success': True,
                'message': 'User registered successfully',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'date_joined': user.date_joined.isoformat(),
                },
                'tokens': {
                    'access': str(access_token),
                    'refresh': str(refresh)
                }
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Registration error: {str(e)}")
            return Response({
                'success': False,
                'message': 'Registration failed. Please try again.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserLoginView(APIView):
    """User login endpoint"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """Authenticate user and return tokens"""
        try:
            data = request.data
            
            # Validate required fields
            if not data.get('username') or not data.get('password'):
                return Response({
                    'success': False,
                    'message': 'Username and password are required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Authenticate user
            user = authenticate(
                username=data['username'],
                password=data['password']
            )
            
            if not user:
                return Response({
                    'success': False,
                    'message': 'Invalid username or password'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            if not user.is_active:
                return Response({
                    'success': False,
                    'message': 'User account is disabled'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            
            # Update last login
            user.last_login = timezone.now()
            user.save()
            
            logger.info(f"User logged in: {user.username}")
            
            return Response({
                'success': True,
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'last_login': user.last_login.isoformat() if user.last_login else None,
                },
                'tokens': {
                    'access': str(access_token),
                    'refresh': str(refresh)
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return Response({
                'success': False,
                'message': 'Login failed. Please try again.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserLogoutView(APIView):
    """User logout endpoint"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Logout user"""
        try:
            # For now, we'll just log the logout without blacklisting
            # In a production environment, you might want to implement token blacklisting
            logger.info(f"User logged out: {request.user.username}")
            
            return Response({
                'success': True,
                'message': 'Logout successful'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Logout error: {str(e)}")
            return Response({
                'success': False,
                'message': 'Logout failed'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_profile(request):
    """Get user profile"""
    try:
        user = request.user
        return Response({
            'success': True,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'date_joined': user.date_joined.isoformat(),
                'last_login': user.last_login.isoformat() if user.last_login else None,
            }
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Profile error: {str(e)}")
        return Response({
            'success': False,
            'message': 'Failed to fetch profile'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def health_check(request):
    """Health check endpoint"""
    return Response({
        'status': 'healthy',
        'message': 'Authentication service is running'
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_achievements(request):
    """
    Get user achievements based on test performance using AchievementsService
    """
    try:
        user = request.user
        
        # Use the achievements service
        achievements_service = AchievementsService(user)
        achievement_summary = achievements_service.get_achievement_summary()
        
        return Response(achievement_summary)
        
    except Exception as e:
        logger.error(f"Error in get_achievements: {str(e)}")
        return Response(
            {'error': f'Failed to get achievements: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_dashboard_summary(request):
    """
    Get aggregated dashboard data in a single API call with caching
    """
    try:
        user = request.user
        
        # Try to get from cache first
        cached_data = cache_manager.get_user_dashboard_data(user.id)
        if cached_data:
            logger.info(f"Returning cached dashboard data for user {user.id}")
            return Response(cached_data)
        
        logger.info(f"Generating fresh dashboard data for user {user.id}")
        
        # Get test sessions for the user
        sessions = TestSession.objects.filter(user=user).select_related('test')
        
        # Calculate test history summary
        total_tests = sessions.count()
        if total_tests > 0:
            average_score = sessions.aggregate(avg_score=Avg('score'))['avg_score'] or 0
            recent_sessions = sessions.order_by('-start_time')[:5]
        else:
            average_score = 0
            recent_sessions = []
        
        # Calculate category stats
        category_stats = []
        if total_tests > 0:
            category_data = sessions.values('test__test_type').annotate(
                count=Count('id'),
                avg_score=Avg('score')
            ).order_by('-count')
            
            for cat in category_data:
                category_stats.append({
                    'category': cat['test__test_type'] or 'Unknown',
                    'count': cat['count'],
                    'average_score': round(cat['avg_score'] or 0, 1)
                })
        
        # Get recent test sessions data
        recent_sessions_data = []
        for session in recent_sessions:
            recent_sessions_data.append({
                'id': session.id,
                'test_name': session.test.title if session.test else 'Unknown Test',
                'test_type': session.test.test_type if session.test else 'Unknown',
                'score': session.score,
                'date_taken': session.start_time.isoformat(),
                'status': session.status
            })
        
        # Get achievements using the service
        achievements_service = AchievementsService(user)
        achievement_summary = achievements_service.get_achievement_summary()
        achievements = achievement_summary['achievements']
        
        # Get job recommendations (simplified)
        try:
            from recommendation.services import RecommendationEngine
            from recommendation.models import CandidateProfile
            
            candidate = CandidateProfile.objects.get(user=user)
            engine = RecommendationEngine()
            recommendations = engine.generate_recommendations(candidate=candidate, limit=3)
            
            job_recommendations = []
            for rec in recommendations:
                job = rec.job
                job_recommendations.append({
                    'id': str(job.id),
                    'title': job.title,
                    'company': job.company,
                    'match': round(rec.overall_score, 0),
                    'salary': f"${job.salary_min:,}-${job.salary_max:,}" if job.salary_min and job.salary_max else "Salary not specified",
                    'location': job.location,
                    'skills': [skill.name for skill in job.required_skills.all()[:3]],
                    'description': job.description[:100] + "..." if job.description and len(job.description) > 100 else job.description or "",
                    'job_type': job.job_type or "Full-time",
                    'remote': job.remote
                })
        except Exception as e:
            logger.warning(f"Could not get job recommendations: {str(e)}")
            job_recommendations = []
        
        # Calculate chart data
        chart_data = {
            'score_trend': [],
            'category_distribution': []
        }
        
        if total_tests > 0:
            # Score trend (last 10 tests)
            recent_tests = sessions.order_by('-start_time')[:10]
            for session in reversed(recent_tests):
                chart_data['score_trend'].append({
                    'date': session.start_time.strftime('%Y-%m-%d'),
                    'score': session.score
                })
            
            # Category distribution
            for cat in category_stats:
                chart_data['category_distribution'].append({
                    'category': cat['category'],
                    'count': cat['count']
                })
        
        # Prepare response data
        response_data = {
            'test_history': {
                'summary': {
                    'total_tests': total_tests,
                    'average_score': round(average_score, 1),
                    'total_time_spent': sum(session.time_spent or 0 for session in sessions),
                    'best_score': sessions.aggregate(max_score=Max('score'))['max_score'] or 0
                },
                'recent_sessions': recent_sessions_data,
                'category_stats': category_stats,
                'chart_data': chart_data
            },
            'achievements': {
                'list': achievements,
                'total_earned': achievement_summary['total_earned'],
                'total_available': achievement_summary['total_available'],
                'completion_percentage': achievement_summary['completion_percentage'],
                'next_achievements': achievement_summary['next_achievements']
            },
            'job_recommendations': {
                'jobs': job_recommendations,
                'total_count': len(job_recommendations)
            },
            'user_profile': {
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'date_joined': user.date_joined.isoformat()
            }
        }
        
        # Cache the response data
        cache_manager.set_user_dashboard_data(user.id, response_data)
        logger.info(f"Cached dashboard data for user {user.id}")
        
        return Response(response_data)
        
    except Exception as e:
        logger.error(f"Error in get_dashboard_summary: {str(e)}")
        return Response(
            {'error': f'Failed to get dashboard summary: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )