from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.utils import timezone
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
    Get user achievements and badges based on test performance
    """
    try:
        from testsengine.models import TestSession
        from testsengine.test_history_views import test_history_summary
        from datetime import timedelta
        
        # Get test history summary data directly
        sessions = TestSession.objects.filter(user=request.user)
        
        # Calculate summary data
        total_tests = sessions.count()
        if total_tests > 0:
            average_score = sum(session.score for session in sessions) / total_tests
            # Calculate improvement trend (simplified)
            recent_sessions = sessions.order_by('-start_time')[:5]
            if len(recent_sessions) >= 2:
                recent_avg = sum(s.score for s in recent_sessions) / len(recent_sessions)
                older_sessions = sessions.order_by('-start_time')[5:10]
                if len(older_sessions) >= 2:
                    older_avg = sum(s.score for s in older_sessions) / len(older_sessions)
                    improvement_trend = recent_avg - older_avg
                else:
                    improvement_trend = 0
            else:
                improvement_trend = 0
        else:
            average_score = 0
            improvement_trend = 0
        
        summary_data = {
            'total_tests_completed': total_tests,
            'average_score': average_score,
            'improvement_trend': improvement_trend
        }
        
        achievements = []
        
        # Perfect Score Achievement
        if summary_data.get('average_score', 0) >= 90:
            achievements.append({
                'id': 1,
                'title': "Perfect Score",
                'description': "Achieved 90%+ average score",
                'icon': "🏆",
                'color': "yellow",
                'earned': True
            })
        
        # Test Master Achievement
        if summary_data.get('total_tests_completed', 0) >= 10:
            achievements.append({
                'id': 2,
                'title': "Test Master",
                'description': "Completed 10+ tests",
                'icon': "⚡",
                'color': "green",
                'earned': True
            })
        
        # Improvement Achievement
        improvement_trend = summary_data.get('improvement_trend', 0)
        if improvement_trend > 0:
            achievements.append({
                'id': 3,
                'title': "Improvement",
                'description': f"+{improvement_trend}% score increase",
                'icon': "📈",
                'color': "blue",
                'earned': True
            })
        
        # Speed Master Achievement (completed 5 tests this week)
        recent_tests = TestSession.objects.filter(
            user=request.user,
            start_time__gte=timezone.now() - timedelta(days=7)
        ).count()
        
        if recent_tests >= 5:
            achievements.append({
                'id': 4,
                'title': "Speed Master",
                'description': "Completed 5 tests this week",
                'icon': "⚡",
                'color': "green",
                'earned': True
            })
        
        # Consistency Achievement (completed tests in 3+ different categories)
        categories = TestSession.objects.filter(
            user=request.user
        ).values_list('test__test_type', flat=True).distinct()
        
        if len(categories) >= 3:
            achievements.append({
                'id': 5,
                'title': "Versatile Learner",
                'description': "Completed tests in 3+ categories",
                'icon': "⭐",
                'color': "purple",
                'earned': True
            })
        
        # First Test Achievement
        if summary_data.get('total_tests_completed', 0) >= 1:
            achievements.append({
                'id': 6,
                'title': "First Step",
                'description': "Completed your first assessment",
                'icon': "🌟",
                'color': "purple",
                'earned': True
            })
        
        # If no achievements earned, show some unearned ones as motivation
        if not achievements:
            achievements = [
                {
                    'id': 1,
                    'title': "Perfect Score",
                    'description': "Achieve 90%+ average score",
                    'icon': "🏆",
                    'color': "yellow",
                    'earned': False
                },
                {
                    'id': 2,
                    'title': "Test Master",
                    'description': "Complete 10+ tests",
                    'icon': "⚡",
                    'color': "green",
                    'earned': False
                },
                {
                    'id': 6,
                    'title': "First Step",
                    'description': "Complete your first assessment",
                    'icon': "🌟",
                    'color': "purple",
                    'earned': False
                }
            ]
        
        return Response({
            'achievements': achievements,
            'total_earned': len([a for a in achievements if a['earned']]),
            'total_available': len(achievements)
        })
        
    except Exception as e:
        logger.error(f"Error in get_achievements: {str(e)}")
        return Response(
            {'error': f'Failed to get achievements: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )