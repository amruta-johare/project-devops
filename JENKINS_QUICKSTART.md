# Jenkins Pipeline Quick Start Guide

A complete guide to set up and run the Jenkins CI/CD pipeline for the PG Management DevOps project.

## Option 1: Quick Start with Docker Compose (Recommended for Testing)

### Prerequisites

- Docker and Docker Compose installed
- At least 4GB RAM available
- Ports available: 8080 (Jenkins), 9000 (SonarQube), 5433 (PostgreSQL)

### Step 1: Start Jenkins and SonarQube Stack

```bash
# Navigate to project directory
cd d:\DevOps\ Project\project-devops

# Start all services
docker compose -f docker-compose.jenkins.yml up -d

# Monitor startup
docker compose -f docker-compose.jenkins.yml logs -f jenkins

# Wait for Jenkins to be ready (takes 2-3 minutes)
# You'll see "Jenkins is fully up and running" in the logs
```

### Step 2: Access Jenkins

1. Open browser: http://localhost:8080
2. Get initial admin password:
   ```bash
   docker compose -f docker-compose.jenkins.yml exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
   ```
3. Copy the password and complete setup
4. Install suggested plugins
5. Create admin user

### Step 3: Access SonarQube

1. Open browser: http://localhost:9000
2. Login with default credentials:
   - Username: `admin`
   - Password: `admin`
3. Change password (required on first login)
4. Go to **My Account** → **Security**
5. Generate token:
   - Token name: `jenkins-token`
   - Select **Scopes**: `api`
   - Copy the generated token

### Step 4: Create SonarQube Project

1. In SonarQube, click **Create Project**
2. Fill in:
   - Project key: `pg-devops-pipeline`
   - Display name: `PG Management DevOps Pipeline`
   - Main branch: `main`
3. Click **Create**

### Step 5: Configure Jenkins for SonarQube

1. In Jenkins, go to **Manage Jenkins** → **Configure System**
2. Scroll to **SonarQube Servers**
3. Click **Add SonarQube**
4. Fill in:
   - Name: `SonarQube`
   - Server URL: `http://sonarqube:9000`
   - Server authentication token: (paste the token from Step 3)
5. Click **Apply** and **Save**

### Step 6: Create Pipeline Job

1. Click **New Item**
2. Enter name: `pg-devops-pipeline`
3. Select **Pipeline**
4. Click **OK**

### Step 7: Configure Pipeline

In the job configuration:

**General Section:**
- Check: **GitHub project**
- Project URL: `https://github.com/your-username/your-repo`

**Pipeline Section:**
- Definition: **Pipeline script from SCM**
- SCM: **Git**
- Repository URL: `https://github.com/your-username/your-repo.git`
- Branch Specifier: `*/main`
- Script Path: `Jenkinsfile`

**Update Jenkinsfile Variables:**

Before saving, update the Jenkinsfile environment variables:
```groovy
GITHUB_REPO = 'https://github.com/your-username/your-repo.git'
GITHUB_BRANCH = 'main'
DOCKER_IMAGE_BACKEND = 'localhost:5000/pg-management-backend'
DOCKER_IMAGE_FRONTEND = 'localhost:5000/pg-management-frontend'
```

Click **Save**

### Step 8: Run First Build

1. Click **Build Now**
2. Monitor progress in **Build History**
3. Click on the build number to see console output
4. Watch for:
   - ✓ Checkout
   - ✓ Build Backend
   - ✓ Build Frontend
   - ✓ SonarQube Analysis
   - ✓ Quality Gate
   - ✓ Docker Build
   - ✓ Docker Compose Start
   - ✓ Health Checks

### Accessing Application Services

After first successful build:

| Service | URL | Credentials |
|---------|-----|-------------|
| **Jenkins** | http://localhost:8080 | admin / [your password] |
| **SonarQube** | http://localhost:9000 | admin / [your password] |
| **Backend API** | http://localhost:8080 | N/A |
| **Frontend** | http://localhost:3001 | Use app login |
| **Prometheus** | http://localhost:9090 | N/A |
| **Grafana** | http://localhost:3000 | admin / admin |
| **MySQL** | localhost:3307 | user / password |

---

## Option 2: Production Setup

### Prerequisites

- Jenkins server (Ubuntu 20.04+ recommended)
- Docker and Docker Compose
- Maven 3.8+
- Node.js 18+
- Git
- SonarQube server (separate or docker)
- GitHub account with repository access

### Installation Steps

#### 1. Install Dependencies

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y \
    jenkins \
    docker.io \
    docker-compose \
    maven \
    nodejs \
    git

# Add Jenkins user to docker group
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

#### 2. Install Jenkins Plugins

```bash
# Via Jenkins UI or using Jenkins CLI
java -jar jenkins-cli.jar -s http://localhost:8080 \
    install-plugin pipeline git github-integration sonarqube docker-workflow email-ext -r
```

#### 3. Configure Credentials

Use the provided setup script:
```bash
chmod +x jenkins-setup-credentials.sh
./jenkins-setup-credentials.sh
```

Or manually in Jenkins:
- **Manage Jenkins** → **Manage Credentials** → **Global credentials**
- Add:
  - SonarQube token
  - Docker Hub credentials
  - GitHub token

#### 4. Create Pipeline Job

Follow steps 6-7 from Quick Start above

#### 5. Configure GitHub Webhook

1. Go to your GitHub repository
2. **Settings** → **Webhooks**
3. **Add webhook**
   - Payload URL: `http://your-jenkins-server:8080/github-webhook/`
   - Content type: `application/json`
   - Events: **Push events** and **Pull requests**
   - Active: ✓

#### 6. Test Pipeline

```bash
# Trigger build by pushing to main branch
git push origin main

# Or manually trigger
curl -X POST http://your-jenkins-server:8080/job/pg-devops-pipeline/build \
    -u admin:YOUR_API_TOKEN
```

---

## Troubleshooting Guide

### Issue: "docker: command not found"

**Solution:**
```bash
# Verify Docker is installed
docker --version

# Add Jenkins user to docker group
sudo usermod -aG docker jenkins

# Restart Jenkins
sudo systemctl restart jenkins
```

### Issue: "Maven not found"

**Solution:**
```bash
# Verify Maven is installed
mvn --version

# Update PATH in Jenkinsfile if needed
export PATH=/usr/share/maven/bin:$PATH
```

### Issue: "SonarQube quality gate fails"

**Solution:**
1. Check SonarQube dashboard for issues
2. Review code quality issues
3. Fix issues in source code
4. Push changes and rebuild

### Issue: Docker Compose fails to start services

**Solution:**
```bash
# Check Docker logs
docker logs pg-mysql
docker logs pg-backend
docker logs pg-frontend

# Verify ports are free
netstat -tulpn | grep 3306
netstat -tulpn | grep 8080
netstat -tulpn | grep 3001

# Clean up and restart
docker compose down -v
docker compose up -d --build
```

### Issue: Build takes too long

**Solutions:**
1. Increase Jenkins heap: `-Xmx2048m -Xms1024m`
2. Enable Docker layer caching
3. Cache Maven dependencies
4. Use parallel builds
5. Run tests selectively

### Issue: Out of disk space

**Solution:**
```bash
# Check disk usage
df -h

# Clean Docker
docker system prune -a

# Clean Jenkins workspace
# Manage Jenkins → Configure System → Disk space threshold
```

---

## Monitoring and Logs

### View Jenkins Logs

```bash
# Docker
docker compose -f docker-compose.jenkins.yml logs -f jenkins

# System
tail -f /var/log/jenkins/jenkins.log

# Docker container
docker exec jenkins cat /var/jenkins_home/logs/jenkins.log
```

### View Build Logs

1. Go to Jenkins job
2. Click build number
3. Click **Console Output**
4. Or use Jenkins CLI:
   ```bash
   java -jar jenkins-cli.jar -s http://localhost:8080 \
       console pg-devops-pipeline 1
   ```

### Monitor SonarQube Quality

1. Go to http://localhost:9000 (or your SonarQube URL)
2. Project: `pg-devops-pipeline`
3. View:
   - Code quality metrics
   - Security issues
   - Reliability issues
   - Maintainability index

---

## Advanced Configuration

### Webhooks and Triggers

**GitHub Webhook Payload:**
```json
{
  "zen": "Design for failure.",
  "hook_id": 123456789,
  "hook": {
    "type": "Repository",
    "id": 123456789,
    "events": ["push"]
  },
  "repository": {
    "name": "your-repo",
    "full_name": "your-username/your-repo"
  },
  "pusher": {
    "name": "your-name",
    "email": "your-email@example.com"
  }
}
```

### Email Notifications

Add to Jenkinsfile `post` section:
```groovy
emailext (
    subject: 'Build ${BUILD_STATUS}: ${JOB_NAME} #${BUILD_NUMBER}',
    body: '''Build Info:
    Job: ${JOB_NAME}
    Build Number: ${BUILD_NUMBER}
    Build Status: ${BUILD_STATUS}
    Build Log: ${BUILD_LOG,maxLines=20}
    Build URL: ${BUILD_URL}''',
    to: '${DEFAULT_RECIPIENTS}'
)
```

### Slack Notifications

Add to Jenkinsfile `post` section:
```groovy
slackSend (
    color: '${BUILD_STATUS}' == 'SUCCESS' ? 'good' : 'danger',
    message: """Build ${BUILD_STATUS}
    Job: ${JOB_NAME}
    Build: ${BUILD_NUMBER}
    URL: ${BUILD_URL}"""
)
```

---

## Cleanup and Shutdown

### Stop All Services

```bash
# Docker Compose
docker compose -f docker-compose.jenkins.yml down

# Keep volumes
docker compose -f docker-compose.jenkins.yml down -v
```

### Remove All Data

```bash
# Remove volumes
docker volume rm \
    $(docker volume ls -q | grep jenkins)
```

### Restart Services

```bash
# Restart all
docker compose -f docker-compose.jenkins.yml restart

# Restart specific service
docker compose -f docker-compose.jenkins.yml restart jenkins
```

---

## Performance Tuning

### Jenkins JVM Settings

```bash
# Set JAVA_OPTS
export JAVA_OPTS="-Xmx2048m -Xms1024m -XX:+UseG1GC"

# Or in docker-compose.jenkins.yml
environment:
  JENKINS_OPTS: "-Xmx2048m -Xms1024m"
```

### Build Timeout

In Jenkinsfile:
```groovy
options {
    timeout(time: 1, unit: 'HOURS')
}
```

### Disable Workspace Cleanup

Remove or comment out:
```groovy
cleanWs()
```

---

## Additional Resources

- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Jenkins Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/)
- [SonarQube Documentation](https://docs.sonarqube.org/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [GitHub Webhooks](https://docs.github.com/en/developers/webhooks-and-events/webhooks)

---

## Support

For issues or questions:
1. Check logs: `docker compose -f docker-compose.jenkins.yml logs`
2. Review Jenkinsfile: Ensure environment variables are correct
3. Verify GitHub token: Ensure it has correct scopes
4. Check SonarQube: Ensure quality gates are properly configured
