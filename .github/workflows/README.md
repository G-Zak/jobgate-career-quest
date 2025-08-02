# GitHub Workflows Documentation

This directory contains GitHub Actions workflows for the JobGate Career Quest project, providing comprehensive CI/CD automation.

## 🔄 Workflows Overview

### 1. Backend CI/CD (`backend.yml`)

**Triggers:**

- Push to `main` or `develop` branches (when backend files change)
- Pull requests to `main` or `develop` branches (when backend files change)

**Jobs:**

- **Test**: Runs Django tests with PostgreSQL database

  - Python 3.12 setup
  - PostgreSQL 15 service
  - Dependency installation
  - Code linting with flake8
  - Database migrations
  - Test execution with coverage
  - Coverage upload to Codecov

- **Build & Push**: Builds and pushes Docker image to Docker Hub

  - Only runs on main branch pushes
  - Multi-platform support (amd64, arm64)
  - Docker Hub integration

- **Security Scan**: Vulnerability scanning with Trivy
  - Filesystem scanning
  - SARIF report upload to GitHub Security

### 2. Frontend CI/CD (`frontend.yml`)

**Triggers:**

- Push to `main` or `develop` branches (when frontend files change)
- Pull requests to `main` or `develop` branches (when frontend files change)

**Jobs:**

- **Test**: Frontend testing and building

  - Node.js 20 setup
  - Dependency installation with npm ci
  - ESLint code linting
  - TypeScript type checking
  - Test execution with coverage
  - Build verification
  - Artifact upload

- **Lighthouse**: Performance testing (PR only)

  - Lighthouse CI for performance metrics
  - Accessibility, SEO, and best practices checks

- **Build & Push**: Docker image building and pushing

  - Only runs on main branch pushes
  - Multi-platform support
  - Build args for API URL configuration

- **Security Scan**: Security vulnerability checks
  - npm audit for dependency vulnerabilities
  - Trivy filesystem scanning

### 3. Docker Multi-Platform (`docker-publish.yml`)

**Triggers:**

- Push to `main` branch
- Git tags with `v*` pattern
- GitHub releases

**Jobs:**

- **Build Backend**: Multi-platform backend image

  - Docker Buildx setup
  - Cross-platform builds (linux/amd64, linux/arm64)
  - Semantic versioning tags

- **Build Frontend**: Multi-platform frontend image

  - Environment-specific build args
  - Production-ready configurations

- **Deploy**: Deployment automation

  - Production environment targeting
  - Deployment status notifications

- **Security Scan**: Container image security
  - Docker image vulnerability scanning
  - SARIF reports for security insights

## 🔐 Required Secrets

Configure these secrets in your GitHub repository settings:

```
DOCKER_USERNAME     # Docker Hub username
DOCKER_PASSWORD     # Docker Hub password or access token
```

## 🔧 Optional Variables

Configure these variables for customization:

```
VITE_API_URL       # Production API URL for frontend builds
```

## 📊 Features

### Code Quality

- **Linting**: ESLint for frontend, flake8 for backend
- **Type Checking**: TypeScript validation
- **Testing**: Comprehensive test suites with coverage
- **Security**: Trivy vulnerability scanning

### Performance

- **Lighthouse CI**: Performance, accessibility, and SEO metrics
- **Caching**: Aggressive Docker layer caching
- **Parallel Jobs**: Concurrent execution for faster builds

### Deployment

- **Multi-Platform**: Support for AMD64 and ARM64 architectures
- **Semantic Versioning**: Automatic tag generation
- **Environment Isolation**: Separate production deployments

### Monitoring

- **Coverage Reports**: Codecov integration
- **Security Alerts**: GitHub Security tab integration
- **Build Artifacts**: Downloadable build outputs

## 🚀 Getting Started

1. **Set up secrets** in your GitHub repository
2. **Push changes** to trigger workflows
3. **Monitor progress** in the Actions tab
4. **Review reports** in pull requests

## 📝 Customization

### Adding New Tests

- Backend: Add to existing Django test files
- Frontend: Configure Jest or Vitest (currently placeholder)

### Modifying Build Process

- Update Dockerfile configurations
- Adjust workflow environment variables
- Customize deployment steps

### Security Configuration

- Adjust Trivy scan configurations
- Configure additional security tools
- Set up custom security policies

## 🔍 Troubleshooting

Common issues and solutions:

1. **Docker Hub Authentication**: Verify secrets are correctly set
2. **Test Failures**: Check database configuration and dependencies
3. **Build Failures**: Verify Dockerfile syntax and build context
4. **Security Scan Issues**: Review Trivy configuration and file paths

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Hub Integration](https://docs.docker.com/ci-cd/github-actions/)
- [Codecov Documentation](https://docs.codecov.com/docs)
- [Trivy Security Scanner](https://aquasecurity.github.io/trivy/)
