#!/bin/bash

# Quick Start Script for Prometheus & Grafana Setup
# This script helps you get started with monitoring

echo "================================"
echo "PG Management DevOps Setup"
echo "================================"
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker."
    exit 1
fi

echo "✓ Docker found"

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose."
    exit 1
fi

echo "✓ Docker Compose found"
echo ""

# Start services
echo "Starting services..."
docker-compose up -d

echo ""
echo "✓ All services started!"
echo ""
echo "================================"
echo "Service URLs:"
echo "================================"
echo ""
echo "📱 Frontend:        http://localhost:3001"
echo "🔧 Backend API:     http://localhost:8080"
echo "📊 Prometheus:      http://localhost:9090"
echo "📈 Grafana:         http://localhost:3000"
echo "🗄️  MySQL:          localhost:3307"
echo ""
echo "================================"
echo "Grafana Credentials:"
echo "================================"
echo "Username: admin"
echo "Password: admin"
echo ""
echo "================================"
echo "Useful Commands:"
echo "================================"
echo ""
echo "View all services:        docker-compose ps"
echo "View logs:                docker-compose logs -f [service]"
echo "Stop services:            docker-compose stop"
echo "Start services:           docker-compose start"
echo "Restart services:         docker-compose restart"
echo "Clean up:                 docker-compose down -v"
echo ""
echo "For more details, see: PROMETHEUS_GRAFANA_SETUP.md"
