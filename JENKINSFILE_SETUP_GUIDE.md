# Jenkins Pipeline Setup Guide

This guide explains how to configure Jenkins to run the DevOps pipeline for the PG Management project.

## Prerequisites

Ensure the following are installed on your Jenkins server:

- **Jenkins** (version 2.387+)
- **Docker** and **Docker Compose**
- **Maven** (for Java builds)
- **Node.js** and **npm** (for frontend builds)
- **Git** plugin for Jenkins
- **SonarQube** server and SonarQube Scanner

## Required Jenkins Plugins

Install these plugins from Jenkins Plugin Manager:

1. **Pipeline** (workflow-aggregator)
2. **Git Plugin** (git)
3. **GitHub Integration Plugin** (github-integration)
4. **SonarQube Scanner** (sonarqube)
5. **Docker Pipeline** (docker-workflow)
6. **Email Extension Plugin** (email-ext) - Optional, for notifications
7. **Slack Notifier** (slack) - Optional, for Slack notifications

## Jenkins Configuration Steps

### 1. Configure System Settings

Navigate to **Manage Jenkins** → **Configure System**:

#### Add SonarQube Server

- Go to **SonarQube Servers** section
- Click **Add SonarQube**
- Name: `SonarQube`
- Server URL: `http://your-sonarqube-server:9000`
- Server authentication token: Create a token in SonarQube and paste it here

#### Add Docker Registry Credentials

- Go to **Credentials** → **System** → **Global credentials**
- Click **Add Credentials**
- Kind: **Username with password**
- ID: `docker-registry-credentials`
- Username: Your Docker Hub/Registry username
- Password: Your Docker Hub/Registry password

### 2. Create a New Pipeline Job

1. Click **New Item** on Jenkins dashboard
2. Enter job name: `pg-devops-pipeline`
3. Select **Pipeline**
4. Click **OK**

### 3. Configure Pipeline Job

In the job configuration page:

#### General Settings

- Enable: **GitHub project**
- Project URL: `https://github.com/your-username/your-repo`

#### Build Triggers

- Check: **GitHub hook trigger for GITScm polling**
- Or check: **Poll SCM** and set schedule (e.g., `H/15 * * * *` for every 15 minutes)

#### Pipeline Section

- Definition: **Pipeline script from SCM**
- SCM: **Git**
- Repository URL: `https://github.com/your-username/your-repo.git`
- Branch Specifier: `*/main`
- Script Path: `Jenkinsfile`

### 4. GitHub Webhook Setup

To enable automatic builds on push:

1. In your GitHub repository, go to **Settings** → **Webhooks**
2. Click **Add webhook**
3. Payload URL: `http://your-jenkins-server:8080/github-webhook/`
4. Content type: `application/json`
5. Trigger on: **Push events** and **Pull requests**
6. Click **Add webhook**

### 5. SonarQube Project Setup

#### Create SonarQube Project

1. Login to SonarQube (`http://your-sonarqube-server:9000`)
2. Click **Create project**
3. Project key: `pg-devops-pipeline`
4. Display name: `PG Management DevOps Pipeline`
5. Main branch: `main`

#### Generate SonarQube Token

1. Go to **My Account** → **Security**
2. Generate a token: `jenkins-token`
3. Copy the token and add it to Jenkins (see step 1.1 above)

## Environment Variables Configuration

Update these environment variables in the Jenkinsfile:

```groovy
GITHUB_REPO = 'https://github.com/your-username/your-repo.git'
GITHUB_BRANCH = 'main'
SONARQUBE_SERVER = 'SonarQube'
SONARQUBE_PROJECT_KEY = 'pg-devops-pipeline'
DOCKER_IMAGE_BACKEND = 'your-registry/pg-management-backend'
DOCKER_IMAGE_FRONTEND = 'your-registry/pg-management-frontend'
```

## Pipeline Stages Explained

### 1. **Checkout**
   - Clones the repository from GitHub

### 2. **Build Backend**
   - Runs Maven clean install for the Spring Boot application
   - Skips tests in this stage

### 3. **Build Frontend**
   - Installs npm dependencies
   - Builds the React application

### 4. **SonarQube Analysis**
   - Runs static code analysis on the backend code
   - Publishes results to SonarQube server

### 5. **Quality Gate**
   - Waits for SonarQube quality gate results
   - Fails the build if quality gate doesn't pass

### 6. **Docker Build**
   - Builds Docker images for backend and frontend
   - Tags with build number and latest

### 7. **Docker Compose - Cleanup**
   - Stops and removes old containers and volumes

### 8. **Docker Compose - Start**
   - Starts all services using docker-compose
   - Waits for services to be healthy

### 9. **Health Check**
   - Verifies all services are running correctly
   - Checks MySQL, Backend API, Frontend, and Prometheus

### 10. **Docker Push** (Only on main branch)
   - Pushes Docker images to registry

## Running Tests

To include unit tests, uncomment the test command in backend build stage:

```groovy
./mvnw clean install
```

Or add a separate test stage:

```groovy
stage('Unit Tests') {
    steps {
        dir('pg-management-backend') {
            sh './mvnw test'
        }
    }
}
```

## Notifications

### Email Notifications

Add to the `post` section:

```groovy
post {
    failure {
        emailext (
            subject: "Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            body: "Build failed. Check console output at ${env.BUILD_URL}",
            to: "your-email@example.com"
        )
    }
    success {
        emailext (
            subject: "Build Success: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            body: "Build succeeded. Application deployed.",
            to: "your-email@example.com"
        )
    }
}
```

### Slack Notifications

Add to the `post` section:

```groovy
post {
    failure {
        slackSend (
            color: '#FF0000',
            message: "Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
        )
    }
    success {
        slackSend (
            color: '#00FF00',
            message: "Build Success: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
        )
    }
}
```

## Troubleshooting

### Issue: "docker: command not found"
- Ensure Docker is installed on the Jenkins agent
- Add Jenkins user to the docker group: `sudo usermod -aG docker jenkins`
- Restart Jenkins: `sudo systemctl restart jenkins`

### Issue: Maven not found
- Ensure Maven is installed in the PATH specified in the Jenkinsfile
- Or install Maven plugin for Jenkins

### Issue: SonarQube quality gate fails
- Review the issues in the SonarQube dashboard
- Fix the code issues and push again

### Issue: Docker Compose fails to start
- Check Docker daemon is running
- Review docker-compose logs: `docker compose logs`
- Ensure ports are not already in use

## Advanced Configuration

### Build Parameters

Add parameters to allow manual pipeline execution:

```groovy
parameters {
    choice(name: 'ENVIRONMENT', choices: ['development', 'staging', 'production'], description: 'Deployment environment')
    booleanParam(name: 'RUN_TESTS', defaultValue: true, description: 'Run unit tests')
    booleanParam(name: 'PUSH_DOCKER', defaultValue: false, description: 'Push Docker images')
}
```

### Conditional Execution

Execute stages conditionally:

```groovy
when {
    branch 'main'
    environment name: 'PUSH_DOCKER', value: 'true'
}
```

### Parallel Execution

Run stages in parallel:

```groovy
parallel {
    stage('Build Backend') { ... }
    stage('Build Frontend') { ... }
}
```

## References

- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Jenkins Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/)
- [SonarQube Documentation](https://docs.sonarqube.org/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
