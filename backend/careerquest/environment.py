"""
Environment configuration for Django settings
Handles environment variables and provides defaults for PostgreSQL scoring system
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

# Environment detection
def is_production():
    """Check if we're running in production"""
    return config('ENVIRONMENT', default='development') == 'production'

def is_testing():
    """Check if we're running tests"""
    return config('ENVIRONMENT', default='development') == 'testing'

def use_postgresql():
    """Determine if PostgreSQL should be used"""
    # Force PostgreSQL in production
    if is_production():
        return True
    
    # Allow override via environment variable
    return config('USE_POSTGRESQL', default=True, cast=bool)

# PostgreSQL configuration
def get_postgresql_config():
    """Get PostgreSQL connection parameters"""
    return {
        'NAME': config('DB_NAME', default='jobgate_career_quest'),
        'USER': config('DB_USER', default='jobgate_user'),
        'PASSWORD': config('DB_PASSWORD', default=''),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='5432', cast=int),
        'TEST_DB': config('DB_TEST_NAME', default='test_jobgate_career_quest'),
    }

# Scoring system configuration
def get_scoring_config():
    """Get scoring system specific configuration"""
    return {
        'DIFFICULTY_COEFFICIENTS': {
            'easy': config('SCORING_EASY_COEFF', default=1.0, cast=float),
            'medium': config('SCORING_MEDIUM_COEFF', default=1.5, cast=float),
            'hard': config('SCORING_HARD_COEFF', default=2.0, cast=float),
        },
        'TIME_LIMIT_MINUTES': config('TEST_TIME_LIMIT', default=20, cast=int),
        'ENABLE_TIME_PENALTIES': config('SCORING_TIME_PENALTIES', default=False, cast=bool),
        'ENABLE_GUESS_CORRECTION': config('SCORING_GUESS_CORRECTION', default=False, cast=bool),
    }

# Debug and logging configuration
def get_debug_config():
    """Get debug and logging configuration"""
    return {
        'DEBUG': config('DEBUG', default=True, cast=bool),
        'SQL_DEBUG': config('SQL_DEBUG', default=False, cast=bool),
        'LOG_LEVEL': config('LOG_LEVEL', default='INFO'),
    }

# Export commonly used functions
__all__ = [
    'is_production', 
    'is_testing', 
    'use_postgresql', 
    'get_postgresql_config', 
    'get_scoring_config',
    'get_debug_config'
]
