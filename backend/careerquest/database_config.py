"""
database_config.py — clean implementation

This file intentionally small and self-contained to supply Django's
DATABASES mapping and a helper to inspect the Postgres pool state.
"""
import os
from pathlib import Path

try:
    from decouple import config
except Exception:
    # simple fallback if python-decouple isn't installed
    def config(key, default=None, cast=str):
        val = os.environ.get(key, default)
        if val is None:
            return default
        try:
            return cast(val) if cast else val
        except Exception:
            return val


BASE_DIR = Path(__file__).resolve().parent.parent


def get_database_config():
    use_postgresql = config('USE_POSTGRESQL', default=False, cast=bool)

    if use_postgresql:
        return {
            'default': {
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': config('DB_NAME', default='careerquest'),
                'USER': config('DB_USER', default='jobgate'),
                'PASSWORD': config('DB_PASSWORD', default='securepass'),
                'HOST': config('DB_HOST', default='localhost'),
                'PORT': config('DB_PORT', default='5432'),
                'CONN_MAX_AGE': config('DB_CONN_MAX_AGE', default=600, cast=int),
                'OPTIONS': {'connect_timeout': 10},
            }
        }

    return {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }


DATABASES = get_database_config()


def get_db_pool_status():
    if not config('USE_POSTGRESQL', default=False, cast=bool):
        return {'status': 'sqlite'}

    try:
        from django.db import connection

        with connection.cursor() as cursor:
            cursor.execute("SELECT count(*) FROM pg_stat_activity WHERE datname = %s",
                           [config('DB_NAME', default='jobgate_career_quest')])
            total = cursor.fetchone()[0]
        return {'total_connections': total}
    except Exception as e:
        return {'error': str(e)}


__all__ = ['DATABASES', 'get_db_pool_status']

