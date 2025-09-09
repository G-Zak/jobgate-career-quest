# PostgreSQL Migration & Connection Pooling Setup Guide

## 🗄️ **POSTGRESQL MIGRATION PLAN**

### Phase 1: PostgreSQL Installation & Setup
### Phase 2: Django Configuration 
### Phase 3: Connection Pooling Implementation
### Phase 4: Data Migration
### Phase 5: Performance Optimization

---

## 📋 **STEP 1: INSTALL POSTGRESQL**

### macOS Installation (Homebrew)
```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Create database and user
psql postgres
```

### PostgreSQL Setup Commands
```sql
-- Create database
CREATE DATABASE jobgate_career_quest;

-- Create user with password
CREATE USER jobgate_user WITH PASSWORD 'your_secure_password_here';

-- Grant privileges
ALTER ROLE jobgate_user SET client_encoding TO 'utf8';
ALTER ROLE jobgate_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE jobgate_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE jobgate_career_quest TO jobgate_user;

-- Exit psql
\q
```

---

## 🔧 **STEP 2: DJANGO CONFIGURATION**

### Environment Variables (.env file)
```env
# Database Configuration
DB_ENGINE=django.db.backends.postgresql
DB_NAME=jobgate_career_quest
DB_USER=jobgate_user
DB_PASSWORD=your_secure_password_here
DB_HOST=localhost
DB_PORT=5432

# Connection Pooling
DB_CONN_MAX_AGE=600
DB_CONN_HEALTH_CHECKS=True

# Production Settings
DEBUG=False
SECRET_KEY=your_secret_key_here
ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.com
```

### Updated settings.py
```python
import os
from decouple import config

# Database with Connection Pooling
DATABASES = {
    'default': {
        'ENGINE': config('DB_ENGINE', default='django.db.backends.postgresql'),
        'NAME': config('DB_NAME', default='jobgate_career_quest'),
        'USER': config('DB_USER', default='jobgate_user'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='5432'),
        'CONN_MAX_AGE': config('DB_CONN_MAX_AGE', default=600, cast=int),
        'CONN_HEALTH_CHECKS': config('DB_CONN_HEALTH_CHECKS', default=True, cast=bool),
        'OPTIONS': {
            'MAX_CONNS': 20,
            'MIN_CONNS': 5,
        }
    }
}
```

---

## ⚡ **STEP 3: CONNECTION POOLING**

### Install Additional Dependencies
```bash
pip install django-db-pool pgbouncer python-decouple
```

### Advanced Connection Pooling with django-db-pool
```python
# Enhanced settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django_db_pool.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'), 
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='5432'),
        'CONN_MAX_AGE': 0,  # Use pooling instead
        'POOL_OPTIONS': {
            'POOL_SIZE': 10,
            'MAX_OVERFLOW': 10,
            'POOL_TIMEOUT': 5,
            'POOL_RECYCLE': 300,
            'POOL_PRE_PING': True,
        }
    }
}
```

---

## 📊 **STEP 4: DATA MIGRATION STRATEGY**

### Backup Current SQLite Data
```bash
# Export current data
python manage.py dumpdata --natural-foreign --natural-primary > backup_data.json

# Or specific apps
python manage.py dumpdata testsengine > testsengine_data.json
python manage.py dumpdata accounts > accounts_data.json
```

### Migration Process
```bash
# 1. Update settings to PostgreSQL
# 2. Run initial migrations
python manage.py migrate

# 3. Load data (if needed)
python manage.py loaddata backup_data.json

# 4. Verify data integrity
python manage.py shell -c "from testsengine.models import Question; print(f'Questions: {Question.objects.count()}')"
```

---

## 🚀 **STEP 5: PERFORMANCE OPTIMIZATION**

### Database Indexes
```python
# Add to models.py
class Question(models.Model):
    # ... existing fields ...
    
    class Meta:
        ordering = ['test', 'order']
        indexes = [
            models.Index(fields=['test', 'order']),
            models.Index(fields=['question_type']),
            models.Index(fields=['difficulty_level']),
            models.Index(fields=['base_image_id']),
        ]
```

### Query Optimization
```python
# Optimized queries in views.py
def get_spatial_questions(test_id):
    return Question.objects.select_related('test').filter(
        test_id=test_id,
        test__test_type='spatial_reasoning'
    ).prefetch_related('test_answers')
```

---

## 📈 **MONITORING & MAINTENANCE**

### Database Health Check
```python
# Add to Django admin or management command
from django.db import connection

def check_db_health():
    with connection.cursor() as cursor:
        cursor.execute("SELECT version();")
        version = cursor.fetchone()
        
        cursor.execute("""
            SELECT count(*) as active_connections 
            FROM pg_stat_activity 
            WHERE state = 'active';
        """)
        active_conns = cursor.fetchone()
        
        return {
            'version': version[0],
            'active_connections': active_conns[0]
        }
```

---

## 🔒 **SECURITY CONSIDERATIONS**

### Connection Security
```python
# Production database settings
DATABASES = {
    'default': {
        'ENGINE': 'django_db_pool.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT'),
        'OPTIONS': {
            'sslmode': 'require',
            'sslcert': '/path/to/client-cert.pem',
            'sslkey': '/path/to/client-key.pem',
            'sslrootcert': '/path/to/ca-cert.pem',
        },
        'POOL_OPTIONS': {
            'POOL_SIZE': 10,
            'MAX_OVERFLOW': 10,
        }
    }
}
```

---

## ⚠️ **MIGRATION CHECKLIST**

### Pre-Migration
- [ ] Backup current SQLite database
- [ ] Install PostgreSQL locally/production
- [ ] Create database and user
- [ ] Test connection with psql
- [ ] Update requirements.txt

### During Migration  
- [ ] Update settings.py with PostgreSQL config
- [ ] Add environment variables
- [ ] Run migrations on empty PostgreSQL
- [ ] Import data from backup
- [ ] Test all functionality

### Post-Migration
- [ ] Verify data integrity
- [ ] Run performance tests
- [ ] Monitor connection pooling
- [ ] Update deployment scripts
- [ ] Document new setup

---

## 🛠️ **QUICK COMMANDS**

### Development
```bash
# Start PostgreSQL
brew services start postgresql@15

# Connect to database
psql -h localhost -U jobgate_user -d jobgate_career_quest

# Django with PostgreSQL
python manage.py migrate
python manage.py runserver
```

### Production
```bash
# Create production database
createdb -U postgres jobgate_career_quest_prod

# Run migrations
python manage.py migrate --settings=careerquest.settings.production

# Collect static files
python manage.py collectstatic --settings=careerquest.settings.production
```

---

**Benefits of PostgreSQL Migration:**
- ✅ Better performance for concurrent users
- ✅ Advanced indexing and query optimization  
- ✅ ACID compliance and data integrity
- ✅ Connection pooling for scalability
- ✅ Production-ready reliability
- ✅ Better JSON field support
- ✅ Full-text search capabilities

**Estimated Migration Time:** 2-4 hours including testing
