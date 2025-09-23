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