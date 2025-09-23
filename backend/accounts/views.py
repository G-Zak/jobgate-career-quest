from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import login, logout
from django.contrib.auth.hashers import check_password
from django.utils import timezone
from django.db import transaction
import logging

from .models import User, UserProfile
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer, UserProfileSerializer,
    UserUpdateSerializer, PasswordChangeSerializer, UserListSerializer
)

logger = logging.getLogger(__name__)

class UserRegistrationView(APIView):
    """User registration endpoint"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """Register a new user"""
        try:
            serializer = UserRegistrationSerializer(data=request.data)
            if serializer.is_valid():
                with transaction.atomic():
                    user = serializer.save()
                    
                    # Generate JWT tokens
                    refresh = RefreshToken.for_user(user)
                    access_token = refresh.access_token
                    
                    # Update last login
                    user.last_login = timezone.now()
                    user.save()
                    
                    logger.info(f"New user registered: {user.email}")
                    
                    return Response({
                        'success': True,
                        'message': 'User registered successfully',
                        'user': user.get_profile_data(),
                        'tokens': {
                            'access': str(access_token),
                            'refresh': str(refresh)
                        }
                    }, status=status.HTTP_201_CREATED)
            
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
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
            serializer = UserLoginSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.validated_data['user']
                
                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                access_token = refresh.access_token
                
                # Update last login
                user.last_login = timezone.now()
                user.last_login_ip = self.get_client_ip(request)
                user.save()
                
                logger.info(f"User logged in: {user.email}")
                
                return Response({
                    'success': True,
                    'message': 'Login successful',
                    'user': user.get_profile_data(),
                    'tokens': {
                        'access': str(access_token),
                        'refresh': str(refresh)
                    }
                }, status=status.HTTP_200_OK)
            
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return Response({
                'success': False,
                'message': 'Login failed. Please check your credentials.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get_client_ip(self, request):
        """Get client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

class UserLogoutView(APIView):
    """User logout endpoint"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Logout user and blacklist token"""
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            logger.info(f"User logged out: {request.user.email}")
            
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

class UserProfileView(generics.RetrieveUpdateAPIView):
    """User profile management"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UserProfileSerializer
        return UserUpdateSerializer
    
    def get_object(self):
        """Get user profile"""
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile
    
    def get(self, request):
        """Get user profile"""
        try:
            profile = self.get_object()
            serializer = UserProfileSerializer(profile)
            return Response({
                'success': True,
                'profile': serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Profile fetch error: {str(e)}")
            return Response({
                'success': False,
                'message': 'Failed to fetch profile'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def patch(self, request):
        """Update user profile"""
        try:
            user = request.user
            serializer = UserUpdateSerializer(user, data=request.data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                
                # Update profile if needed
                profile = self.get_object()
                profile_serializer = UserProfileSerializer(profile)
                
                logger.info(f"Profile updated: {user.email}")
                
                return Response({
                    'success': True,
                    'message': 'Profile updated successfully',
                    'profile': profile_serializer.data
                }, status=status.HTTP_200_OK)
            
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            logger.error(f"Profile update error: {str(e)}")
            return Response({
                'success': False,
                'message': 'Profile update failed'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PasswordChangeView(APIView):
    """Password change endpoint"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Change user password"""
        try:
            serializer = PasswordChangeSerializer(
                data=request.data,
                context={'request': request}
            )
            
            if serializer.is_valid():
                user = request.user
                user.set_password(serializer.validated_data['new_password'])
                user.save()
                
                logger.info(f"Password changed: {user.email}")
                
                return Response({
                    'success': True,
                    'message': 'Password changed successfully'
                }, status=status.HTTP_200_OK)
            
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            logger.error(f"Password change error: {str(e)}")
            return Response({
                'success': False,
                'message': 'Password change failed'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_dashboard_data(request):
    """Get user dashboard data"""
    try:
        user = request.user
        profile = UserProfile.objects.get(user=user)
        
        # Get recent test sessions (if test history is implemented)
        recent_tests = []
        try:
            from testsengine.models import TestSession
            recent_sessions = TestSession.objects.filter(user=user).order_by('-date_taken')[:5]
            recent_tests = [
                {
                    'id': session.id,
                    'test_name': session.test.title if session.test else 'Unknown Test',
                    'score': session.score,
                    'date': session.date_taken.isoformat()
                }
                for session in recent_sessions
            ]
        except ImportError:
            # Fallback if test models not available
            recent_tests = []
        
        dashboard_data = {
            'user': user.get_profile_data(),
            'profile': UserProfileSerializer(profile).data,
            'stats': {
                'total_tests': profile.total_tests_taken,
                'average_score': profile.average_score,
                'best_score': profile.best_score,
                'total_time': profile.total_time_spent
            },
            'recent_tests': recent_tests
        }
        
        return Response({
            'success': True,
            'data': dashboard_data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Dashboard data error: {str(e)}")
        return Response({
            'success': False,
            'message': 'Failed to fetch dashboard data'
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
@permission_classes([IsAuthenticated])
def get_achievements(request):
    """
    Get user achievements and badges based on test performance
    """
    try:
        from testsengine.models import TestSession
        from testsengine.test_history_views import test_history_summary
        from django.utils import timezone
        from datetime import timedelta
        
        # Get test history summary data
        summary_response = test_history_summary(request)
        summary_data = summary_response.data
        
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
            date_taken__gte=timezone.now() - timedelta(days=7)
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
        ).values_list('test__category', flat=True).distinct()
        
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