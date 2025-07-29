# JobGate Career Quest - Troubleshooting & Fixes

## Project Overview
JobGate Career Quest is a gamified skills assessment platform built with:
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Django REST Framework with JWT authentication
- **Database**: PostgreSQL 15
- **Deployment**: Docker Compose

## Issues Resolved

### Issue #1: Backend Container Failing - Missing JWT Dependencies

**Problem:**
```
ModuleNotFoundError: No module named 'rest_framework_simplejwt'
```

**Root Cause:**
The Django settings (`backend/careerquest/settings.py`) referenced `rest_framework_simplejwt` in `INSTALLED_APPS`, but the package wasn't included in `requirements.txt`.

**Solution:**
Added the missing dependency to `backend/requirements.txt`:
```pip
djangorestframework-simplejwt==5.3.0
```

### Issue #2: Backend Container Failing - Missing setuptools

**Problem:**
```
ModuleNotFoundError: No module named 'pkg_resources'
```

**Root Cause:**
The `djangorestframework-simplejwt` package requires `pkg_resources` which is provided by `setuptools`, but it wasn't explicitly installed.

**Solution:**
Added setuptools to `backend/requirements.txt`:
```pip
setuptools==69.0.0
```

### Issue #3: Frontend Port Configuration Mismatch

**Problem:**
- Docker Compose exposed port 3000
- Vite development server was running on internal port 5173
- Frontend was not accessible via http://localhost:3000

**Root Cause:**
The frontend Dockerfile didn't configure Vite to run on the correct port and host.

**Solution:**
Updated `frontend/Dockerfile` CMD instruction:
```dockerfile
# Before
CMD ["npm", "run", "dev"]

# After
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
```

## Files Modified

### 1. `/backend/requirements.txt`
```diff
Django==4.2.16
djangorestframework==3.14.0
+ djangorestframework-simplejwt==5.3.0
psycopg2-binary==2.9.9
drf-spectacular==0.27.2
python-decouple==3.8
+ setuptools==69.0.0
```

### 2. `/frontend/Dockerfile`
```diff
# frontend/Dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

- CMD ["npm", "run", "dev"]
+ CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
```

## Resolution Steps Taken

1. **Diagnosed the Issue**
   - Checked Docker container status: `docker-compose ps`
   - Examined container logs: `docker-compose logs backend`
   - Identified missing dependencies in error messages

2. **Fixed Backend Dependencies**
   - Added `djangorestframework-simplejwt==5.3.0` to requirements.txt
   - Added `setuptools==69.0.0` to requirements.txt
   - Rebuilt backend container: `docker-compose build backend`

3. **Fixed Frontend Port Configuration**
   - Updated Dockerfile to specify correct host and port
   - Rebuilt frontend container: `docker-compose build frontend`

4. **Verified Resolution**
   - Restarted all containers: `docker-compose up -d`
   - Tested backend accessibility: `curl http://localhost:8000/` (HTTP 200 ✓)
   - Tested frontend accessibility: `curl http://localhost:3000/` (HTTP 200 ✓)

## Final Working Configuration

### Container Status
```
NAME                              IMAGE                           STATUS                   PORTS
jobgate-career-quest-backend-1    jobgate-career-quest-backend    Up                       0.0.0.0:8000->8000/tcp
jobgate-career-quest-db-1         postgres:15                     Up (healthy)             5432/tcp
jobgate-career-quest-frontend-1   jobgate-career-quest-frontend   Up                       0.0.0.0:3000->3000/tcp
```

### Application URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Database**: PostgreSQL running on internal port 5432

### Dependencies Added
- `djangorestframework-simplejwt==5.3.0` - JWT authentication for Django REST Framework
- `setuptools==69.0.0` - Required for pkg_resources used by JWT package

## Prevention Tips

1. **Dependency Management**
   - Always update `requirements.txt` when adding new packages to Django settings
   - Use `pip freeze > requirements.txt` to capture all dependencies
   - Test in clean environments to catch missing dependencies

2. **Docker Configuration**
   - Ensure port mappings match between docker-compose.yml and application configuration
   - Use `--host 0.0.0.0` for development servers in containers
   - Test container accessibility after builds

3. **Development Workflow**
   - Check container logs immediately after startup
   - Use health checks for databases
   - Verify all services are accessible before proceeding with development

## Quick Commands Reference

```bash
# Check container status
docker-compose ps

# View logs for specific service
docker-compose logs [service-name]

# Rebuild and restart specific service
docker-compose down [service-name]
docker-compose build [service-name]
docker-compose up [service-name] -d

# Rebuild all services
docker-compose down
docker-compose build
docker-compose up -d

# Test service accessibility
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/
curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/
```

---

**Resolution Date**: July 29, 2025  
**Status**: ✅ Resolved - All services running successfully
