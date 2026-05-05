#!/usr/bin/env bash
# One-button bootstrap for the Jenkins + SonarQube CI/CD stack.
# - Brings the stack up
# - Sets a deterministic SonarQube admin password
# - Generates a global analysis token
# - Registers the Jenkins webhook in SonarQube
# - Re-applies JCasC so Jenkins picks up the token
# - Triggers the seed pipeline and tails it
set -euo pipefail

SONAR_URL="${SONAR_URL:-http://localhost:9000}"
JENKINS_URL="${JENKINS_URL:-http://localhost:8081}"
JENKINS_ADMIN="admin"
JENKINS_ADMIN_PASSWORD="${JENKINS_ADMIN_PASSWORD:-admin}"

# SonarQube ships with admin/admin and forces a change on first login.
SONAR_NEW_PASSWORD="${SONAR_NEW_PASSWORD:-Sonar@123!}"

cd "$(dirname "$0")"

echo "==> [1/7] Building & starting Jenkins/SonarQube stack..."
docker compose -f docker-compose.jenkins.yml up -d --build

echo "==> [2/7] Waiting for SonarQube to be UP (this can take 2–3 minutes on first boot)..."
for i in {1..60}; do
  status=$(curl -sf "$SONAR_URL/api/system/status" 2>/dev/null | jq -r .status 2>/dev/null || echo "DOWN")
  if [ "$status" = "UP" ]; then echo "    SonarQube UP"; break; fi
  printf "    [%02d/60] status=%s\n" "$i" "$status"
  sleep 10
done

echo "==> [3/7] Forcing SonarQube admin password to a known value..."
# Idempotent: if the password is already changed, retry with the new one.
if curl -sf -u "admin:admin" -X POST \
     "$SONAR_URL/api/users/change_password?login=admin&previousPassword=admin&password=$SONAR_NEW_PASSWORD" \
     -o /dev/null; then
  echo "    Default password rotated to provided value."
else
  if curl -sf -u "admin:$SONAR_NEW_PASSWORD" "$SONAR_URL/api/authentication/validate" | grep -q '"valid":true'; then
    echo "    Password already set to expected value (idempotent)."
  else
    echo "    !! Could not authenticate with admin/admin OR admin/$SONAR_NEW_PASSWORD."
    echo "    !! If you've changed it before, set SONAR_NEW_PASSWORD to your real password and re-run."
    exit 1
  fi
fi

echo "==> [4/7] Revoking any existing 'jenkins' token and minting a fresh one..."
curl -sf -u "admin:$SONAR_NEW_PASSWORD" -X POST \
     "$SONAR_URL/api/user_tokens/revoke?name=jenkins" -o /dev/null || true
SONAR_TOKEN=$(curl -sf -u "admin:$SONAR_NEW_PASSWORD" -X POST \
                "$SONAR_URL/api/user_tokens/generate?name=jenkins&type=GLOBAL_ANALYSIS_TOKEN" \
                | jq -r .token)
if [ -z "$SONAR_TOKEN" ] || [ "$SONAR_TOKEN" = "null" ]; then
  echo "    !! Failed to mint a SonarQube token."; exit 1
fi
echo "    Token: ${SONAR_TOKEN:0:8}…(redacted)"

echo "==> [5/7] Registering Jenkins webhook in SonarQube..."
# Drop any pre-existing webhook with the same name, then create.
existing=$(curl -sf -u "admin:$SONAR_NEW_PASSWORD" "$SONAR_URL/api/webhooks/list" \
           | jq -r '.webhooks[]? | select(.name=="Jenkins") | .key')
if [ -n "$existing" ]; then
  curl -sf -u "admin:$SONAR_NEW_PASSWORD" -X POST \
       "$SONAR_URL/api/webhooks/delete?webhook=$existing" -o /dev/null || true
fi
curl -sf -u "admin:$SONAR_NEW_PASSWORD" -X POST \
     --data-urlencode "name=Jenkins" \
     --data-urlencode "url=http://jenkins:8080/sonarqube-webhook/" \
     "$SONAR_URL/api/webhooks/create" -o /dev/null
echo "    Webhook → http://jenkins:8080/sonarqube-webhook/"

echo "==> [6/7] Re-launching Jenkins with token injected (so JCasC binds the credential)..."
SONARQUBE_TOKEN="$SONAR_TOKEN" docker compose -f docker-compose.jenkins.yml up -d
echo "    Waiting for Jenkins to be ready..."
for i in {1..60}; do
  if curl -sf "$JENKINS_URL/login" -o /dev/null 2>&1; then echo "    Jenkins UP"; break; fi
  printf "    [%02d/60] waiting for Jenkins...\n" "$i"
  sleep 5
done

# Persist token to .env for subsequent compose ups.
grep -v '^SONARQUBE_TOKEN=' .env 2>/dev/null > .env.tmp || true
echo "SONARQUBE_TOKEN=$SONAR_TOKEN" >> .env.tmp
mv .env.tmp .env

echo "==> [7/7] Triggering pipeline 'pg-management-sonar'..."
CRUMB=$(curl -sf -u "$JENKINS_ADMIN:$JENKINS_ADMIN_PASSWORD" \
        "$JENKINS_URL/crumbIssuer/api/json" | jq -r '.crumb')
CRUMB_FIELD=$(curl -sf -u "$JENKINS_ADMIN:$JENKINS_ADMIN_PASSWORD" \
              "$JENKINS_URL/crumbIssuer/api/json" | jq -r '.crumbRequestField')
curl -sf -u "$JENKINS_ADMIN:$JENKINS_ADMIN_PASSWORD" -H "$CRUMB_FIELD: $CRUMB" \
     -X POST "$JENKINS_URL/job/pg-management-sonar/build" -o /dev/null
echo "    Pipeline build queued."
echo
echo "================================================================"
echo "  Jenkins:    $JENKINS_URL  (admin / $JENKINS_ADMIN_PASSWORD)"
echo "  SonarQube:  $SONAR_URL    (admin / $SONAR_NEW_PASSWORD)"
echo "  Pipeline:   $JENKINS_URL/job/pg-management-sonar/"
echo "  Sonar UI:   $SONAR_URL/dashboard?id=pg-management-backend"
echo "================================================================"
