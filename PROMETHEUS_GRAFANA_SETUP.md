# Prometheus & Grafana Setup Guide

## Overview
This project is configured with **Prometheus** for metrics collection and **Grafana** for visualization and alerting.

## Architecture

```
┌─────────────────┐
│ Spring Backend  │ (port 8080)
│  - Actuator     │
│  - Prometheus   │
└────────┬────────┘
         │ metrics
         ▼
┌─────────────────┐
│  Prometheus     │ (port 9090)
│  - Scraping     │
│  - Time-series  │
└────────┬────────┘
         │ queries
         ▼
┌─────────────────┐
│    Grafana      │ (port 3000)
│  - Dashboards   │
│  - Alerts       │
└─────────────────┘
```

## Services

### Prometheus
- **Port**: 9090
- **Access**: http://localhost:9090
- **Config**: `prometheus.yml`
- **Purpose**: Collects and stores metrics from Spring Boot application

### Grafana
- **Port**: 3000
- **Access**: http://localhost:3000
- **Default Credentials**: admin/admin
- **Purpose**: Visualizes metrics and provides alerting

### Spring Boot Backend
- **Port**: 8080
- **Metrics Endpoint**: http://localhost:8080/actuator/prometheus
- **Health Check**: http://localhost:8080/actuator/health

### Frontend
- **Port**: 3001
- **Purpose**: React application for PG management system

### MySQL Database
- **Port**: 3307
- **Container Name**: pg-mysql

## Getting Started

### 1. Start All Services
```bash
cd project-devops
docker-compose up -d
```

### 2. Verify Services are Running
```bash
docker-compose ps
```

### 3. Access the Applications

| Service | URL | Notes |
|---------|-----|-------|
| Frontend | http://localhost:3001 | React app |
| Backend API | http://localhost:8080 | Spring Boot API |
| Backend Metrics | http://localhost:8080/actuator/prometheus | Prometheus metrics |
| Prometheus | http://localhost:9090 | Metrics database |
| Grafana | http://localhost:3000 | Visualization dashboard |

## Grafana Setup

### First Login
1. Navigate to http://localhost:3000
2. Login with credentials:
   - **Username**: admin
   - **Password**: admin
3. Change password when prompted

### Pre-configured Datasource
Prometheus is automatically configured as a datasource:
- **Name**: Prometheus
- **URL**: http://prometheus:9090
- **Access**: Proxy

### Pre-configured Dashboard
A Spring Boot metrics dashboard is automatically provisioned:
- **Name**: Spring Boot Application Metrics
- **Metrics Included**:
  - JVM Memory Usage
  - HTTP Request Rate
  - HTTP Response Time
  - Database Connection Pool Status

### Create Custom Dashboards
1. Click "+" (Create) → Dashboard
2. Add panels with queries like:
   - `jvm_memory_used_bytes`
   - `http_requests_total`
   - `hikaricp_connections`

## Prometheus Metrics Collection

### Scrape Configuration
- **Job**: spring-backend
- **Target**: backend:8080
- **Endpoint**: /actuator/prometheus
- **Interval**: 15 seconds
- **Timeout**: 10 seconds

### Available Metrics from Spring Boot
- JVM Metrics: Memory, GC, Threads
- HTTP Metrics: Requests, Response Times, Status Codes
- Database Metrics: Connection Pool, Query Performance
- Custom Application Metrics

## Configuration Files

### prometheus.yml
Defines scrape jobs and intervals. Edit to:
- Change scrape intervals
- Add new scrape targets
- Configure alerting rules

### docker-compose.yml
Defines all services and their configurations. Key sections:
- **backend**: Spring Boot application
- **db**: MySQL database
- **prometheus**: Metrics collection
- **grafana**: Visualization
- **networks**: Docker network for service communication
- **volumes**: Persistent data storage

### grafana/provisioning/datasources/prometheus-datasource.yml
Auto-configures Prometheus as a Grafana datasource.

### grafana/provisioning/dashboards/
Contains pre-built dashboards automatically loaded on startup.

## Port Assignments

| Service | Port | Container Port |
|---------|------|-----------------|
| Frontend | 3001 | 80 |
| Backend | 8080 | 8080 |
| Prometheus | 9090 | 9090 |
| Grafana | 3000 | 3000 |
| MySQL | 3307 | 3306 |

## Troubleshooting

### Prometheus not scraping metrics
- Check if backend is healthy: `docker-compose logs backend`
- Verify backend has actuator enabled
- Check prometheus.yml syntax: http://localhost:9090/config

### Grafana datasource error
- Verify Prometheus is running: `docker-compose ps`
- Check datasource URL: should be `http://prometheus:9090`
- Check network connectivity between containers

### Services not communicating
- Verify network exists: `docker network ls | grep pg-devops`
- Check container logs: `docker-compose logs -f [service-name]`
- Restart services: `docker-compose restart`

### Volumes or permissions issues
- Clear and rebuild: `docker-compose down -v && docker-compose up -d`
- Check file permissions on mounted volumes

## Useful Commands

```bash
# View all services
docker-compose ps

# View service logs
docker-compose logs -f [service-name]
# Example: docker-compose logs -f backend

# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart prometheus

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v

# Build and start
docker-compose up -d --build

# Check network
docker network inspect pg-devops-network

# Access container shell
docker exec -it [container-name] /bin/bash
```

## Advanced Configuration

### Adding Alert Rules
Edit `prometheus.yml` to add alert rules under `rule_files` section.

### Custom Grafana Dashboards
1. Export dashboard as JSON
2. Place in `grafana/provisioning/dashboards/`
3. Restart Grafana: `docker-compose restart grafana`

### Scaling Metrics Collection
- Adjust `scrape_interval` in prometheus.yml
- Increase Prometheus storage: modify volume size in docker-compose.yml
- Configure retention: add flags to Prometheus command

## Security Considerations

- Change Grafana admin password after first login
- Restrict Prometheus access in production
- Use authentication for sensitive metrics
- Configure TLS for production deployments

## Resources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Spring Boot Actuator](https://spring.io/guides/gs/actuator-service/)
- [Micrometer Prometheus Registry](https://micrometer.io/docs/registry/prometheus)
