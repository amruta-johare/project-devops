# Jenkins Pipeline Quick Reference

## Quick Setup Commands

### 1. Install Required Jenkins Plugins

From Jenkins CLI:
```bash
java -jar jenkins-cli.jar -s http://localhost:8080 install-plugin pipeline git github-integration sonarqube docker-workflow email-ext -r
java -jar jenkins-cli.jar -s http://localhost:8080 safe-restart
```

### 2. Configure SonarQube in Jenkins

```bash
# Login to Jenkins container
docker exec -it jenkins bash

# Create Jenkins job via Groovy console
```

### 3. Required Environment Variables

```bash
GITHUB_REPO=https://github.com/your-username/your-repo.git
GITHUB_BRANCH=main
SONARQUBE_SERVER=http://sonarqube:9000
DOCKER_REGISTRY=docker.io
DOCKER_USERNAME=your-username
DOCKER_PASSWORD=your-password
```

## Jenkins Job Configuration (Simplified)

### Pipeline from Git

| Setting | Value |
|---------|-------|
| **Pipeline** | Definition: Pipeline script from SCM |
| **SCM** | Git |
| **Repository URL** | `https://github.com/your-username/your-repo.git` |
| **Branch** | `*/main` |
| **Script Path** | `Jenkinsfile` |

### Build Triggers

| Trigger | Status |
|---------|--------|
| **GitHub hook trigger for GITScm polling** | ✓ Enabled |
| **Poll SCM** | Optional (set interval as needed) |

## SonarQube Token Setup

### Generate Token in SonarQube

1. Login to SonarQube
2. Click your profile icon → **My Account**
3. Go to **Security** tab
4. Under **Tokens** section, click **Generate**
5. Name: `jenkins-token`
6. Click **Generate** and copy the token

### Add Token to Jenkins

1. **Manage Jenkins** → **Manage Credentials**
2. Click **System** → **Global credentials**
3. **Add Credentials**
   - Kind: **Secret text**
   - Secret: (paste SonarQube token)
   - ID: `sonarqube-token`

## GitHub Webhook Setup

```
URL: http://your-jenkins-server:8080/github-webhook/
Content type: application/json
Events: Push events, Pull request events
Active: ✓
```

## Docker Registry Credentials

1. **Manage Jenkins** → **Manage Credentials**
2. **System** → **Global credentials** → **Add Credentials**
   - Kind: **Username with password**
   - Username: Your Docker Hub username
   - Password: Your Docker Hub password or PAT
   - ID: `docker-registry-credentials`

## Pipeline Execution Flow

```
GitHub (Push) 
    ↓
    └→ Webhook triggers Jenkins
         ↓
         ├→ Checkout code
         ├→ Build Backend (Maven)
         ├→ Build Frontend (npm)
         ├→ SonarQube Analysis
         ├→ Quality Gate Check
         ├→ Docker Build
         ├→ Docker Compose Cleanup
         ├→ Docker Compose Start
         ├→ Health Checks
         └→ Docker Push (main branch only)
```

## Useful Jenkins CLI Commands

```bash
# List all jobs
java -jar jenkins-cli.jar -s http://localhost:8080 list-jobs

# Build a job
java -jar jenkins-cli.jar -s http://localhost:8080 build pg-devops-pipeline

# Watch console output
java -jar jenkins-cli.jar -s http://localhost:8080 console pg-devops-pipeline -f

# Create job from XML
java -jar jenkins-cli.jar -s http://localhost:8080 create-job pg-devops-pipeline < job-config.xml

# Delete a job
java -jar jenkins-cli.jar -s http://localhost:8080 delete-job pg-devops-pipeline
```

## Docker Compose Health Check URLs

| Service | URL | Port |
|---------|-----|------|
| MySQL | `localhost:3307` | 3307 |
| Backend API | `http://localhost:8080/actuator/health` | 8080 |
| Frontend | `http://localhost:3001` | 3001 |
| Prometheus | `http://localhost:9090/-/healthy` | 9090 |
| Grafana | `http://localhost:3000` | 3000 |

## Troubleshooting Checklist

- [ ] Jenkins service is running
- [ ] Docker daemon is running on agent
- [ ] Jenkins user has docker permissions
- [ ] Git plugin is installed and configured
- [ ] SonarQube server is accessible
- [ ] Docker images can be built locally
- [ ] GitHub webhook is correctly configured
- [ ] Required ports (8080, 3306, 8080, 3001, 9090, 3000) are available
- [ ] Enough disk space for builds and Docker volumes

## Performance Optimization Tips

1. **Use agent labels** for specific tasks
2. **Enable parallel execution** for frontend and backend builds
3. **Cache Maven dependencies** in Jenkins workspace
4. **Use Docker layer caching** with `--cache-from`
5. **Clean workspace only when needed** (not on every build)

## Security Best Practices

1. Use **Jenkins credentials** for sensitive data
2. Never commit secrets to Git
3. Use **read-only GitHub tokens** for checking out code
4. Restrict Jenkins job access with **role-based access control**
5. Run Jenkins in a **containerized environment** with proper isolation
6. Keep Jenkins and plugins **updated** regularly
7. Use **SSL/TLS** for Jenkins communications

## Docker Image Tags Strategy

- `build-123`: Build number tag
- `latest`: Latest successful build
- `main-latest`: Latest from main branch
- `v1.0.0`: Release versions

## Build Retention Policy

```groovy
buildDiscarder(logRotator(
    daysToKeepStr: '30',      // Keep builds for 30 days
    numToKeepStr: '100',      // Keep last 100 builds
    artifactDaysToKeepStr: '5',
    artifactNumToKeepStr: '10'
))
```

## Next Steps

1. ✓ Create Jenkinsfile in repository root
2. ✓ Configure SonarQube server
3. ✓ Create Jenkins pipeline job
4. ✓ Test webhook from GitHub
5. ✓ Run first build and monitor
6. ✓ Configure notifications (email/Slack)
7. ✓ Set up backup strategy
8. ✓ Monitor build metrics and optimize
