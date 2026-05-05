@echo off
REM Quick Start Script for Prometheus & Grafana Setup (Windows)

echo.
echo ================================
echo PG Management DevOps Setup
echo ================================
echo.

REM Check Docker
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker.
    exit /b 1
)

echo ✓ Docker found

REM Check Docker Compose
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose.
    exit /b 1
)

echo ✓ Docker Compose found
echo.

REM Start services
echo Starting services...
docker-compose up -d

echo.
echo ✓ All services started!
echo.
echo ================================
echo Service URLs:
echo ================================
echo.
echo 📱 Frontend:        http://localhost:3001
echo 🔧 Backend API:     http://localhost:8080
echo 📊 Prometheus:      http://localhost:9090
echo 📈 Grafana:         http://localhost:3000
echo 🗄️  MySQL:          localhost:3307
echo.
echo ================================
echo Grafana Credentials:
echo ================================
echo Username: admin
echo Password: admin
echo.
echo ================================
echo Useful Commands:
echo ================================
echo.
echo View all services:        docker-compose ps
echo View logs:                docker-compose logs -f [service]
echo Stop services:            docker-compose stop
echo Start services:           docker-compose start
echo Restart services:         docker-compose restart
echo Clean up:                 docker-compose down -v
echo.
echo For more details, see: PROMETHEUS_GRAFANA_SETUP.md
