from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models import Avg, Count, Q, Max
import logging

logger = logging.getLogger(__name__)

try:
    from testsengine.models import TestSession, Test
except ImportError:
    TestSession = None
    Test = None

try:
    from recommendation.models import JobRecommendation, JobOffer
except ImportError:
    JobRecommendation = None
    JobOffer = None

try:
    from .services import AchievementsService
except ImportError:
    AchievementsService = None

try:
    from .cache_utils import cache_manager
except ImportError:
    cache_manager = None


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

            logger.info(f"New user registered: {user.username}")

            return Response({
                'success': True,
                'message': 'User registered successfully',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name
                }
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(f"Registration error: {str(e)}")
            return Response({
                'success': False,
                'message': 'Registration failed'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserLoginView(APIView):
    """User login endpoint"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """Authenticate user and return tokens"""
        try:
            data = request.data
            username = data.get('username')
            password = data.get('password')

            if not username or not password:
                return Response({
                    'success': False,
                    'message': 'Username and password required'
                }, status=status.HTTP_400_BAD_REQUEST)

            user = authenticate(username=username, password=password)
            if not user:
                return Response({
                    'success': False,
                    'message': 'Invalid credentials'
                }, status=status.HTTP_401_UNAUTHORIZED)

            # Generate tokens
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token

            # Update last login
            user.last_login = timezone.now()
            user.save(update_fields=['last_login'])

            logger.info(f"User logged in: {user.username}")

            return Response({
                'success': True,
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name
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
                'message': 'Login failed'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserLogoutView(APIView):
    """User logout endpoint"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """Logout user"""
        try:
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
# @permission_classes([IsAuthenticated])  # Temporarily disabled for testing
def get_user_dashboard(request):
    """Get user dashboard data"""
    try:
        return Response({
            'user': request.user.username,
            'dashboard_data': {},
            'message': 'Dashboard data retrieved successfully'
        })
    except Exception as e:
        logger.error(f"Error getting dashboard: {e}")
        return Response(
            {'error': 'Failed to get dashboard data'},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['GET'])
# @permission_classes([IsAuthenticated])  # Temporarily disabled for testing
def get_dashboard_summary(request):
    """Get user dashboard summary"""
    try:
        return Response({
            'user': request.user.username,
            'tests_taken': 0,
            'avg_score': 0,
            'last_test_date': None,
            'recommendations': [],
            'message': 'Dashboard summary retrieved successfully'
        })
    except Exception as e:
        logger.error(f"Error getting dashboard summary: {e}")
        return Response(
            {'error': 'Failed to get dashboard summary'},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def health_check(request):
    """Health check endpoint"""
    return Response({
        'status': 'healthy',
        'message': 'Authentication service is running'
    }, status=status.HTTP_200_OK)