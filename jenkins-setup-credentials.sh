#!/bin/bash
# Jenkins Credentials Setup Helper Script
# This script helps set up required credentials in Jenkins via CLI

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Jenkins Credentials Setup Helper ===${NC}\n"

# Check if Jenkins CLI is available
if ! command -v jenkins-cli.jar &> /dev/null; then
    echo -e "${RED}Error: jenkins-cli.jar not found in PATH${NC}"
    echo "Download from: http://your-jenkins-server:8080/jnlpJars/jenkins-cli.jar"
    exit 1
fi

# Default values
JENKINS_URL="${JENKINS_URL:-http://localhost:8080}"
JENKINS_USER="${JENKINS_USER:-admin}"
JENKINS_TOKEN="${JENKINS_TOKEN:-}"

echo "Jenkins Configuration:"
echo "URL: $JENKINS_URL"
echo "User: $JENKINS_USER"
echo ""

# Function to create credentials
create_credentials() {
    local credential_id=$1
    local credential_type=$2
    local credential_xml=$3
    
    echo -e "${YELLOW}Creating credentials: $credential_id (Type: $credential_type)${NC}"
    
    # Create temporary XML file
    echo "$credential_xml" > /tmp/credential.xml
    
    # Add credentials via Jenkins CLI
    java -jar jenkins-cli.jar -s "$JENKINS_URL" -auth "$JENKINS_USER:$JENKINS_TOKEN" \
        create-credentials-by-xml system::system::jenkins \
        "(global)" < /tmp/credential.xml
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Credentials created successfully${NC}\n"
    else
        echo -e "${RED}✗ Failed to create credentials${NC}\n"
    fi
    
    rm -f /tmp/credential.xml
}

# Function to prompt for input
prompt_input() {
    local prompt_text=$1
    local default_value=$2
    local input_var
    
    if [ -z "$default_value" ]; then
        read -p "$prompt_text: " input_var
    else
        read -p "$prompt_text (default: $default_value): " input_var
        input_var=${input_var:-$default_value}
    fi
    
    echo "$input_var"
}

# Main menu
echo "Select which credentials to set up:"
echo "1. SonarQube Token"
echo "2. Docker Registry (Docker Hub)"
echo "3. GitHub Personal Access Token"
echo "4. All of the above"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1|4)
        echo -e "\n${YELLOW}--- SonarQube Setup ---${NC}"
        sonarqube_url=$(prompt_input "SonarQube Server URL" "http://localhost:9000")
        sonarqube_token=$(prompt_input "SonarQube Token" "")
        
        if [ -z "$sonarqube_token" ]; then
            echo -e "${RED}SonarQube token is required${NC}"
        else
            # Create SonarQube credentials XML
            read -r -d '' sonarqube_xml << EOM || true
<?xml version='1.1' encoding='UTF-8'?>
<org.jenkinsci.plugins.plaincredentials.impl.StringCredentialsImpl plugin="plain-credentials@1.7">
    <id>sonarqube-token</id>
    <description>SonarQube Server Token</description>
    <secret>${sonarqube_token}</secret>
</org.jenkinsci.plugins.plaincredentials.impl.StringCredentialsImpl>
EOM
            create_credentials "sonarqube-token" "Secret Text" "$sonarqube_xml"
        fi
        
        if [ "$choice" != "4" ]; then
            exit 0
        fi
        ;;
esac

case $choice in
    2|4)
        echo -e "\n${YELLOW}--- Docker Registry Setup ---${NC}"
        docker_username=$(prompt_input "Docker Hub Username" "")
        read -s -p "Docker Hub Password/Token: " docker_password
        echo ""
        
        if [ -z "$docker_username" ] || [ -z "$docker_password" ]; then
            echo -e "${RED}Docker username and password are required${NC}"
        else
            # Create Docker Registry credentials XML
            read -r -d '' docker_xml << EOM || true
<?xml version='1.1' encoding='UTF-8'?>
<com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl plugin="credentials@2.6.1">
    <id>docker-registry-credentials</id>
    <description>Docker Hub Credentials</description>
    <username>${docker_username}</username>
    <password>${docker_password}</password>
    <usernameSecret>false</usernameSecret>
</com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl>
EOM
            create_credentials "docker-registry-credentials" "Username with Password" "$docker_xml"
        fi
        
        if [ "$choice" != "4" ]; then
            exit 0
        fi
        ;;
esac

case $choice in
    3|4)
        echo -e "\n${YELLOW}--- GitHub Setup ---${NC}"
        github_token=$(prompt_input "GitHub Personal Access Token" "")
        
        if [ -z "$github_token" ]; then
            echo -e "${RED}GitHub token is required${NC}"
        else
            # Create GitHub credentials XML
            read -r -d '' github_xml << EOM || true
<?xml version='1.1' encoding='UTF-8'?>
<org.jenkinsci.plugins.plaincredentials.impl.StringCredentialsImpl plugin="plain-credentials@1.7">
    <id>github-token</id>
    <description>GitHub Personal Access Token</description>
    <secret>${github_token}</secret>
</org.jenkinsci.plugins.plaincredentials.impl.StringCredentialsImpl>
EOM
            create_credentials "github-token" "Secret Text" "$github_xml"
        fi
        ;;
esac

echo -e "${GREEN}=== Setup Complete ===${NC}"
echo ""
echo "Next steps:"
echo "1. Configure SonarQube server in Jenkins:"
echo "   - Go to Manage Jenkins → Configure System"
echo "   - Find SonarQube Servers section"
echo "   - Add SonarQube with the token you just created"
echo ""
echo "2. Create a Pipeline Job:"
echo "   - New Item → Pipeline"
echo "   - Name: pg-devops-pipeline"
echo "   - Pipeline → Definition: Pipeline script from SCM"
echo "   - SCM: Git"
echo "   - Repository URL: https://github.com/your-username/your-repo.git"
echo "   - Script Path: Jenkinsfile"
echo ""
echo "3. Configure GitHub Webhook:"
echo "   - Go to your GitHub repository"
echo "   - Settings → Webhooks → Add webhook"
echo "   - Payload URL: http://your-jenkins-server:8080/github-webhook/"
echo ""
