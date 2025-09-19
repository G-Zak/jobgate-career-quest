"""
Enhanced database configuration with PostgreSQL and connection pooling support
"""
import os
from pathlib import Path

# Import decouple for environment variables
try:
    from decouple import config
    HAS_DECOUPLE = True
except ImportError:
    HAS_DECOUPLE = False
    # Fallback to os.environ
    def config(key, default=None, cast=str):
        value = os.environ.get(key, default)
        if cast and value is not None:
            return cast(value)
        return value

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Environment-based database configuration
def get_database_config():
    """
    Returns database configuration based on environment variables.
    Defaults to PostgreSQL for consistent development and production environment.
    """
    
    # Check if we're in production mode
    is_production = config('ENVIRONMENT', default='development') == 'production'
    # Default to PostgreSQL for consistent scoring system behavior
    use_postgresql = config('USE_POSTGRESQL', default=True, cast=bool)
    
    if use_postgresql:
        # PostgreSQL with Django's built-in connection pooling
        return {
            'default': {
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': config('DB_NAME', default='jobgate_career_quest'),
                'USER': config('DB_USER', default='jobgate_user'),
                'PASSWORD': config('DB_PASSWORD', default=''),
                'HOST': config('DB_HOST', default='localhost'),
                'PORT': config('DB_PORT', default='5432'),
                # Django's built-in connection pooling
                'CONN_MAX_AGE': config('DB_CONN_MAX_AGE', default=600, cast=int),
                'CONN_HEALTH_CHECKS': config('DB_CONN_HEALTH_CHECKS', default=True, cast=bool),
                'OPTIONS': {
                    # PostgreSQL connection options for scoring system
                    'connect_timeout': 10,
                    'application_name': 'jobgate_career_quest',
                    # Optimize for scoring calculations
                    'sslmode': 'prefer',
                },
                'TEST': {
                    'NAME': config('DB_TEST_NAME', default='test_jobgate_career_quest'),
                }
            }
        }
    else:
        # SQLite for development
        return {
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': BASE_DIR / 'db.sqlite3',
                'CONN_MAX_AGE': config('DB_CONN_MAX_AGE', default=600, cast=int),
                'CONN_HEALTH_CHECKS': config('DB_CONN_HEALTH_CHECKS', default=True, cast=bool),
            }
        }

# Database configuration
DATABASES = get_database_config()

# Connection pooling monitoring (for PostgreSQL)
def get_db_pool_status():
    """
    Get current database connection pool status
    """
    if config('USE_POSTGRESQL', default=False, cast=bool):
        try:
            from django.db import connection
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT 
                        count(*) as total_connections,
                        count(*) FILTER (WHERE state = 'active') as active_connections,
                        count(*) FILTER (WHERE state = 'idle') as idle_connections
                    FROM pg_stat_activity 
                    WHERE datname = %s
                """, [config('DB_NAME', default='jobgate_career_quest')])
                
                result = cursor.fetchone()
                return {
                    'total_connections': result[0],
                    'active_connections': result[1], 
                    'idle_connections': result[2],
                    'conn_max_age': config('DB_CONN_MAX_AGE', default=600, cast=int),
                    'health_checks': config('DB_CONN_HEALTH_CHECKS', default=True, cast=bool),
                }
        except Exception as e:
            return {'error': str(e)}
    return {'status': 'SQLite - No pooling needed'}

# Export configuration
__all__ = ['DATABASES', 'get_db_pool_status']
