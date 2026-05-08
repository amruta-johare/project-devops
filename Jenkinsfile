pipeline {
    agent any

    environment {
        // GitHub Configuration
        GITHUB_REPO = 'https://github.com/amruta-johare/project-devops.git'
        GITHUB_BRANCH = 'main'
        
        // SonarQube Configuration
        SONARQUBE_SERVER = 'SonarQube'
        SONARQUBE_PROJECT_KEY = 'pg-management-backend'
        SONARQUBE_PROJECT_NAME = 'PG Management DevOps Pipeline'
        
        // Docker Configuration
        REGISTRY = 'docker.io'
        DOCKER_IMAGE_BACKEND = 'damodarkamath23/pg-management:backend'
        DOCKER_IMAGE_FRONTEND = 'damodarkamath23/pg-management:frontend'
        DOCKER_TAG = "${BUILD_NUMBER}"
    }

    options {
        timeout(time: 1, unit: 'HOURS')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
    }

    stages {
        stage('Checkout') {
            steps {
                echo '========== Checking out code from GitHub =========='
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: "*/${GITHUB_BRANCH}"]],
                    userRemoteConfigs: [[url: "${GITHUB_REPO}"]],
                    clean: true,
                    submoduleCfg: []
                ])
                echo '✓ Code checked out successfully'
            }
        }

        stage('Build Backend') {
            steps {
                echo '========== Building Backend Application =========='
                dir('pg-management-backend') {
                    sh '''
                        chmod +x mvnw
                        echo "Compiling Spring Boot application..."
                        ./mvnw -B clean compile -DskipTests
                    '''
                }
                echo '✓ Backend build completed'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo '========== Running SonarQube Analysis =========='
                withSonarQubeEnv("${SONARQUBE_SERVER}") {
                    dir('pg-management-backend') {
                        sh '''
                            chmod +x mvnw
                            echo "Running SonarQube analysis on Backend..."
                            ./mvnw -B sonar:sonar \
                                -Dsonar.projectKey=${SONARQUBE_PROJECT_KEY} \
                                -Dsonar.projectName="${SONARQUBE_PROJECT_NAME}" \
                                -Dsonar.sources=src/main/java \
                                -Dsonar.java.binaries=target/classes \
                                -Dsonar.java.source=21 \
                                -Dsonar.exclusions=**/target/**,**/*.sql,**/Dockerfile
                        '''
                    }
                }
                echo '✓ SonarQube analysis completed'
            }
        }

        stage('Quality Gate') {
            steps {
                echo '========== Checking SonarQube Quality Gate =========='
                // Requires a SonarQube webhook → Jenkins:
                //   SonarQube → Administration → Configuration → Webhooks
                //   URL: http://jenkins:8080/sonarqube-webhook/
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
                echo '✓ Quality gate passed'
            }
        }

        stage('Docker Build') {
            steps {
                echo '========== Building Docker Images =========='
                sh '''
                    echo "Building backend Docker image..."
                    docker build -t ${DOCKER_IMAGE_BACKEND} ./pg-management-backend
                    
                    echo "Building frontend Docker image..."
                    docker build -t ${DOCKER_IMAGE_FRONTEND} ./pg-management-frontend
                '''
                echo '✓ Docker images built successfully'
            }
        }

        stage('Docker Compose - Cleanup') {
            steps {
                echo '========== Stopping and removing old containers =========='
                sh '''
                    docker compose down --volumes || true
                    echo "✓ Cleanup completed"
                '''
            }
        }

        stage('Docker Compose - Start') {
            steps {
                echo '========== Starting Docker Compose =========='
                sh '''
                    docker compose up -d --build
                    echo "Waiting for services to be healthy..."
                    sleep 30
                '''
                echo '✓ Docker Compose started'
            }
        }


    post {
        always {
            echo '========== Pipeline Execution Completed =========='
            cleanWs()
        }
        success {
            echo '✓ Pipeline succeeded!'
            // Add notification here (email, Slack, etc.)
        }
        failure {
            echo '✗ Pipeline failed!'
            sh '''
                echo "Collecting logs for debugging..."
                docker compose logs > ${WORKSPACE}/docker-compose.log || true
            '''
            // Add notification here
        }
        unstable {
            echo '⚠ Pipeline is unstable'
        }
    }
}
