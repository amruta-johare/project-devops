# Jenkins CI/CD Pipeline - Complete Setup Package

## Overview

This package provides a complete Jenkins CI/CD pipeline for the PG Management DevOps project. It includes:
- GitHub code checkout
- SonarQube code quality analysis
- Docker image building
- Docker Compose orchestration
- Automated testing and health checks

## Files in This Package

### 1. **Jenkinsfile**
The main pipeline configuration file that orchestrates the entire CI/CD workflow.

**Stages:**
- Checkout code from GitHub
- Build backend (Maven)
- Build frontend (npm)
- SonarQube analysis with quality gates
- Docker image building
- Docker Compose cleanup and startup
- Health checks for all services
- Docker push (for main branch only)

**Usage:**
Place this file in the root of your GitHub repository. Jenkins will automatically detect and execute it.

---

### 2. **JENKINS_QUICKSTART.md** ⭐ START HERE
Complete guide to get started with Jenkins in 15 minutes.

**Includes:**
- Quick Docker Compose setup (recommended for testing)
- Step-by-step configuration walkthrough
- Production setup instructions
- Troubleshooting guide
- Service access URLs and credentials

**For Windows Users:** Follow the Docker Compose approach for fastest setup.

---

### 3. **JENKINSFILE_SETUP_GUIDE.md**
Detailed reference guide for configuring Jenkins and all required tools.

**Covers:**
- Required Jenkins plugins
- System configuration steps
- GitHub webhook setup
- SonarQube integration
- Email and Slack notifications
- Advanced configuration options

**Use this:** When you need detailed explanations of each configuration step.

---

### 4. **JENKINS_QUICK_REFERENCE.md**
Quick lookup guide for common tasks and commands.

**Includes:**
- Quick setup commands
- Environment variables reference
- Jenkins job configuration table
- SonarQube token setup
- Useful Jenkins CLI commands
- Troubleshooting checklist
- Docker image tagging strategy

**Use this:** For quick lookups during setup or troubleshooting.

---

### 5. **docker-compose.jenkins.yml**
Complete Docker Compose file to run Jenkins with SonarQube stack.

**Services:**
- Jenkins (latest with Java 21)
- SonarQube (Community edition)
- PostgreSQL (database for SonarQube)
- Docker Registry (optional, for local image storage)

**Usage:**
```bash
docker compose -f docker-compose.jenkins.yml up -d
```

**Advantages:**
- No installation required
- Everything pre-configured
- Perfect for testing and development
- Easy cleanup: `docker compose -f docker-compose.jenkins.yml down`

---

### 6. **jenkins-setup-credentials.sh**
Bash script to automate Jenkins credential setup (Linux/Mac).

**Sets up:**
- SonarQube token
- Docker Hub credentials
- GitHub personal access token

**Usage:**
```bash
chmod +x jenkins-setup-credentials.sh
./jenkins-setup-credentials.sh
```

---

### 7. **jenkins-setup-credentials.bat**
Batch script to automate Jenkins credential setup (Windows).

**Sets up:**
- SonarQube token
- Docker Hub credentials
- GitHub personal access token

**Usage:**
```cmd
jenkins-setup-credentials.bat
```

---

## Quick Start (Choose One)

### Option A: Docker Compose (5 minutes) - RECOMMENDED FOR TESTING

```bash
# 1. Start services
docker compose -f docker-compose.jenkins.yml up -d

# 2. Get Jenkins initial password
docker compose -f docker-compose.jenkins.yml exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword

# 3. Open browser
# Jenkins: http://localhost:8080
# SonarQube: http://localhost:9000

# Follow JENKINS_QUICKSTART.md Steps 2-7
```

### Option B: Production Setup (30 minutes)

```bash
# 1. Install dependencies (Linux)
sudo apt-get install -y jenkins docker.io maven nodejs

# 2. Start Jenkins and SonarQube services
# (See JENKINSFILE_SETUP_GUIDE.md for details)

# 3. Configure Jenkins via UI at http://your-server:8080

# Follow JENKINS_QUICKSTART.md production setup section
```

---

## Configuration Checklist

Before running your first build, ensure:

- [ ] Jenkinsfile is in GitHub repository root
- [ ] Jenkins job created and pointing to correct repository
- [ ] SonarQube server is accessible and running
- [ ] SonarQube project created (`pg-devops-pipeline`)
- [ ] SonarQube token generated and added to Jenkins
- [ ] Docker credentials configured in Jenkins
- [ ] GitHub webhook configured
- [ ] Maven and Node.js available on Jenkins agent
- [ ] Docker daemon accessible from Jenkins
- [ ] Required ports available (8080, 9000, 3306, 5432)

---

## Jenkinsfile Environment Variables

Edit these in Jenkinsfile based on your setup:

```groovy
// GitHub Configuration
GITHUB_REPO = 'https://github.com/your-username/your-repo.git'
GITHUB_BRANCH = 'main'

// SonarQube Configuration  
SONARQUBE_SERVER = 'SonarQube'  // Name configured in Jenkins
SONARQUBE_PROJECT_KEY = 'pg-devops-pipeline'

// Docker Configuration
REGISTRY = 'docker.io'  // or 'localhost:5000' for local
DOCKER_IMAGE_BACKEND = 'your-registry/pg-management-backend'
DOCKER_IMAGE_FRONTEND = 'your-registry/pg-management-frontend'
```

---

## Pipeline Execution Flow

```
GitHub Push
    ↓
Webhook Trigger
    ↓
Jenkins Job Started
    ├─ Checkout
    ├─ Build Backend
    ├─ Build Frontend
    ├─ SonarQube Analysis
    ├─ Quality Gate Check (❌ FAIL = Pipeline stops)
    ├─ Docker Build
    ├─ Docker Compose Cleanup
    ├─ Docker Compose Up
    ├─ Health Checks (❌ FAIL = Pipeline fails)
    └─ Docker Push (main branch only)
    ↓
Success ✓ or Failure ✗
    ↓
Email/Slack Notification (optional)
```

---

## Accessing Services

After first successful build:

| Service | URL | Login |
|---------|-----|-------|
| **Jenkins** | http://localhost:8080 | admin / [your-password] |
| **SonarQube** | http://localhost:9000 | admin / [your-password] |
| **Application Backend** | http://localhost:8080 | N/A |
| **Application Frontend** | http://localhost:3001 | app login |
| **Prometheus** | http://localhost:9090 | N/A |
| **Grafana** | http://localhost:3000 | admin / admin |
| **MySQL** | localhost:3307 | user / password |

---

## Monitoring Builds

### Via Jenkins UI
1. Go to Jenkins dashboard
2. Click job name `pg-devops-pipeline`
3. Click build number to view console output
4. Scroll to see each stage execution

### Via Command Line
```bash
# Watch Jenkins logs
docker compose -f docker-compose.jenkins.yml logs -f jenkins

# View build console
curl http://localhost:8080/job/pg-devops-pipeline/1/consoleText
```

### Via Browser
1. Open http://localhost:8080/job/pg-devops-pipeline
2. Click "Console Output" for real-time logs

---

## Common Tasks

### Trigger Build Manually
```bash
# Via UI: Click "Build Now" button
# Via CLI: 
curl -X POST http://localhost:8080/job/pg-devops-pipeline/build \
    -u admin:YOUR_API_TOKEN
```

### View SonarQube Results
1. Go to http://localhost:9000
2. Click project `pg-devops-pipeline`
3. Review issues, coverage, and metrics

### Check Container Logs
```bash
# Backend
docker compose logs pg-backend

# Frontend  
docker compose logs pg-frontend

# MySQL
docker compose logs db

# All
docker compose logs -f
```

### Rebuild Application
```bash
# Stop services
docker compose down -v

# Clean Jenkins workspace
rm -rf /var/jenkins_home/workspace/pg-devops-pipeline/*

# Trigger new build
# Via Jenkins UI or API call
```

---

## Troubleshooting

### Build Fails at "Docker Build" Stage
- Ensure Docker daemon is running
- Check Jenkins has Docker permissions: `sudo usermod -aG docker jenkins`
- Verify Dockerfiles exist in project

### SonarQube Quality Gate Fails
- Review issues in SonarQube dashboard
- Fix code issues
- Push changes to trigger new build

### Services Won't Start
```bash
# Check if ports are in use
netstat -tulpn | grep 8080
netstat -tulpn | grep 3306

# Kill process using port 8080
lsof -ti:8080 | xargs kill -9

# Or change port in docker-compose.yml
```

### Jenkins CLI Not Found
```bash
# Download jenkins-cli.jar
wget http://localhost:8080/jnlpJars/jenkins-cli.jar

# Or place in PATH where script can find it
```

---

## Security Considerations

⚠️ **Important:** These files are for development/testing. For production:

1. **Never commit credentials** to repository
2. **Use Jenkins Credentials Manager** for all secrets
3. **Enable HTTPS** for Jenkins
4. **Restrict access** with firewall rules
5. **Change default passwords** for all services
6. **Use read-only GitHub tokens** where possible
7. **Enable audit logging**
8. **Regular backups** of Jenkins configuration
9. **Keep Jenkins and plugins updated**

---

## Support & Documentation

### Official Resources
- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Jenkins Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/)
- [SonarQube Documentation](https://docs.sonarqube.org/)
- [Docker Compose Reference](https://docs.docker.com/compose/)

### Included Guides (in this package)
- `JENKINS_QUICKSTART.md` - Complete setup guide
- `JENKINSFILE_SETUP_GUIDE.md` - Detailed reference
- `JENKINS_QUICK_REFERENCE.md` - Quick lookup

---

## Next Steps

1. **Choose Setup Method**
   - Option A: Docker Compose (fastest)
   - Option B: Production setup

2. **Follow JENKINS_QUICKSTART.md**
   - Complete all configuration steps
   - Test each service

3. **Run First Build**
   - Push to main branch or manually trigger
   - Monitor progress in Jenkins UI

4. **Configure Notifications** (optional)
   - Email alerts
   - Slack integration

5. **Optimize Pipeline** (optional)
   - Add tests
   - Enable notifications
   - Configure backup strategies

---

## File Summary

```
project-devops/
├── Jenkinsfile                          ← Main pipeline configuration
├── docker-compose.yml                   ← Application stack
├── docker-compose.jenkins.yml          ← Jenkins+SonarQube stack
├── jenkins-setup-credentials.sh        ← Linux/Mac setup script
├── jenkins-setup-credentials.bat       ← Windows setup script
├── JENKINS_QUICKSTART.md               ← ⭐ START HERE
├── JENKINSFILE_SETUP_GUIDE.md          ← Detailed guide
├── JENKINS_QUICK_REFERENCE.md          ← Quick lookup
└── JENKINS_SETUP_PACKAGE_README.md     ← This file
```

---

**Ready to get started? Open [JENKINS_QUICKSTART.md](JENKINS_QUICKSTART.md) and follow the steps!**
