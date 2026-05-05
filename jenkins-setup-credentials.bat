@echo off
REM Jenkins Credentials Setup Helper Script for Windows
REM This script helps set up required credentials in Jenkins via CLI

setlocal enabledelayedexpansion

echo.
echo ========== Jenkins Credentials Setup Helper ==========
echo.

REM Default values
set "JENKINS_URL=http://localhost:8080"
set "JENKINS_USER=admin"

if not defined JENKINS_TOKEN (
    echo Enter your Jenkins API Token (can be found in Jenkins user settings):
    set /p JENKINS_TOKEN="Jenkins Token: "
)

if not defined JENKINS_CLI_JAR (
    set "JENKINS_CLI_JAR=jenkins-cli.jar"
)

REM Check if jenkins-cli.jar exists
if not exist "%JENKINS_CLI_JAR%" (
    echo.
    echo ERROR: jenkins-cli.jar not found!
    echo Please download it from: %JENKINS_URL%/jnlpJars/jenkins-cli.jar
    echo.
    echo And place it in the current directory or set JENKINS_CLI_JAR environment variable.
    pause
    exit /b 1
)

echo.
echo Jenkins Configuration:
echo URL: %JENKINS_URL%
echo User: %JENKINS_USER%
echo.

REM Display menu
echo Select which credentials to set up:
echo 1. SonarQube Token
echo 2. Docker Registry ^(Docker Hub^)
echo 3. GitHub Personal Access Token
echo 4. All of the above
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto sonarqube
if "%choice%"=="2" goto docker
if "%choice%"=="3" goto github
if "%choice%"=="4" goto all
echo Invalid choice. Exiting.
exit /b 1

:all
goto sonarqube

:sonarqube
echo.
echo --- SonarQube Setup ---
set /p SONARQUBE_URL="SonarQube Server URL (default: http://localhost:9000): " || set "SONARQUBE_URL=http://localhost:9000"
set /p SONARQUBE_TOKEN="SonarQube Token: "

if "%SONARQUBE_TOKEN%"=="" (
    echo ERROR: SonarQube token is required
    pause
    exit /b 1
)

REM Create temporary XML file for SonarQube credentials
(
    echo ^<?xml version='1.1' encoding='UTF-8'?^>
    echo ^<org.jenkinsci.plugins.plaincredentials.impl.StringCredentialsImpl plugin="plain-credentials@1.7"^>
    echo     ^<id^>sonarqube-token^</id^>
    echo     ^<description^>SonarQube Server Token^</description^>
    echo     ^<secret^>%SONARQUBE_TOKEN%^</secret^>
    echo ^</org.jenkinsci.plugins.plaincredentials.impl.StringCredentialsImpl^>
) > "%TEMP%\sonarqube-credential.xml"

echo.
echo Creating SonarQube credentials...
java -jar "%JENKINS_CLI_JAR%" -s "%JENKINS_URL%" -auth "%JENKINS_USER%:%JENKINS_TOKEN%" ^
    create-credentials-by-xml system::system::jenkins "(global)" < "%TEMP%\sonarqube-credential.xml"

if errorlevel 1 (
    echo ERROR: Failed to create SonarQube credentials
) else (
    echo Credentials created successfully
)

del "%TEMP%\sonarqube-credential.xml"

if "%choice%"=="1" goto end
if "%choice%"=="2" goto docker
if "%choice%"=="3" goto github
if "%choice%"=="4" goto docker

:docker
echo.
echo --- Docker Registry Setup ---
set /p DOCKER_USERNAME="Docker Hub Username: "
if "%DOCKER_USERNAME%"=="" (
    echo ERROR: Docker username is required
    pause
    exit /b 1
)

setlocal
set "psCmd=powershell -Command "$pword = read-host 'Enter password' -AsSecureString ; ^
    $BSTR=[System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($pword); ^
    [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)""

for /f "usebackq delims=" %%A in (`%psCmd%`) do set "DOCKER_PASSWORD=%%A"
endlocal & set "DOCKER_PASSWORD=%DOCKER_PASSWORD%"

if "%DOCKER_PASSWORD%"=="" (
    echo ERROR: Docker password is required
    pause
    exit /b 1
)

REM Create temporary XML file for Docker credentials
(
    echo ^<?xml version='1.1' encoding='UTF-8'?^>
    echo ^<com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl plugin="credentials@2.6.1"^>
    echo     ^<id^>docker-registry-credentials^</id^>
    echo     ^<description^>Docker Hub Credentials^</description^>
    echo     ^<username^>%DOCKER_USERNAME%^</username^>
    echo     ^<password^>%DOCKER_PASSWORD%^</password^>
    echo     ^<usernameSecret^>false^</usernameSecret^>
    echo ^</com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl^>
) > "%TEMP%\docker-credential.xml"

echo.
echo Creating Docker credentials...
java -jar "%JENKINS_CLI_JAR%" -s "%JENKINS_URL%" -auth "%JENKINS_USER%:%JENKINS_TOKEN%" ^
    create-credentials-by-xml system::system::jenkins "(global)" < "%TEMP%\docker-credential.xml"

if errorlevel 1 (
    echo ERROR: Failed to create Docker credentials
) else (
    echo Credentials created successfully
)

del "%TEMP%\docker-credential.xml"

if "%choice%"=="2" goto end
if "%choice%"=="3" goto github
if "%choice%"=="4" goto github

:github
echo.
echo --- GitHub Setup ---
set /p GITHUB_TOKEN="GitHub Personal Access Token: "

if "%GITHUB_TOKEN%"=="" (
    echo ERROR: GitHub token is required
    pause
    exit /b 1
)

REM Create temporary XML file for GitHub credentials
(
    echo ^<?xml version='1.1' encoding='UTF-8'?^>
    echo ^<org.jenkinsci.plugins.plaincredentials.impl.StringCredentialsImpl plugin="plain-credentials@1.7"^>
    echo     ^<id^>github-token^</id^>
    echo     ^<description^>GitHub Personal Access Token^</description^>
    echo     ^<secret^>%GITHUB_TOKEN%^</secret^>
    echo ^</org.jenkinsci.plugins.plaincredentials.impl.StringCredentialsImpl^>
) > "%TEMP%\github-credential.xml"

echo.
echo Creating GitHub credentials...
java -jar "%JENKINS_CLI_JAR%" -s "%JENKINS_URL%" -auth "%JENKINS_USER%:%JENKINS_TOKEN%" ^
    create-credentials-by-xml system::system::jenkins "(global)" < "%TEMP%\github-credential.xml"

if errorlevel 1 (
    echo ERROR: Failed to create GitHub credentials
) else (
    echo Credentials created successfully
)

del "%TEMP%\github-credential.xml"

:end
echo.
echo ========== Setup Complete ==========
echo.
echo Next steps:
echo 1. Configure SonarQube server in Jenkins:
echo    - Go to Manage Jenkins ^> Configure System
echo    - Find SonarQube Servers section
echo    - Add SonarQube with the token you just created
echo.
echo 2. Create a Pipeline Job:
echo    - New Item ^> Pipeline
echo    - Name: pg-devops-pipeline
echo    - Pipeline ^> Definition: Pipeline script from SCM
echo    - SCM: Git
echo    - Repository URL: https://github.com/your-username/your-repo.git
echo    - Script Path: Jenkinsfile
echo.
echo 3. Configure GitHub Webhook:
echo    - Go to your GitHub repository
echo    - Settings ^> Webhooks ^> Add webhook
echo    - Payload URL: http://your-jenkins-server:8080/github-webhook/
echo.
pause
