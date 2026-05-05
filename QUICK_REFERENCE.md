# Quick Reference Card

## 🚀 Start Monitoring

```bash
# Windows
quickstart.bat

# Linux/Mac
bash quickstart.sh

# Or manually
docker-compose up -d
```

## 📊 Access Points

| What | Where | Notes |
|------|-------|-------|
| App | http://localhost:3001 | Frontend |
| API | http://localhost:8080 | Spring Boot |
| Metrics | http://localhost:8080/actuator/prometheus | Raw data |
| Prometheus | http://localhost:9090 | Query UI |
| Grafana | http://localhost:3000 | Dashboards |

## 👤 Grafana Login
- **URL**: http://localhost:3000
- **Username**: admin
- **Password**: admin

## 📋 Common Commands

```bash
# Check all services running
docker-compose ps

# View logs (replace 'backend' with service name)
docker-compose logs -f backend
docker-compose logs -f prometheus
docker-compose logs -f grafana

# Stop all services
docker-compose stop

# Start all services
docker-compose start

# Restart specific service
docker-compose restart grafana

# Clean everything (WARNING: deletes data!)
docker-compose down -v

# Rebuild and start
docker-compose up -d --build
```

## 🔍 Verify Setup

1. **Check backend metrics**: http://localhost:8080/actuator/prometheus
   - Should return MIME type `text/plain; version=0.0.4`

2. **Check Prometheus scraping**: http://localhost:9090/targets
   - Should show `spring-backend` target as UP

3. **Check Grafana connection**: http://localhost:3000
   - Login and check Data Sources → Prometheus
   - Run test query: `up{job="spring-backend"}`

## 📊 Available Queries

```promql
# JVM Memory
jvm_memory_used_bytes

# HTTP Requests
rate(http_requests_total[5m])

# Response Time
rate(http_server_requests_seconds_sum[5m]) / rate(http_server_requests_seconds_count[5m])

# DB Connections
hikaricp_connections
```

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| Services won't start | Run: `docker-compose down -v && docker-compose up -d` |
| Can't connect to Prometheus | Check: `docker-compose ps` all running? |
| No metrics in Grafana | Wait 1-2 min, then refresh. Check backend is healthy |
| Prometheus says backend DOWN | Check backend logs: `docker-compose logs backend` |
| Port already in use | Change port in docker-compose.yml or kill process |

## 📁 Important Files

- `docker-compose.yml` - Service configuration
- `prometheus.yml` - Prometheus scrape config
- `grafana/provisioning/datasources/` - Grafana datasources
- `grafana/provisioning/dashboards/` - Grafana dashboards
- `PROMETHEUS_GRAFANA_SETUP.md` - Complete documentation
- `IMPLEMENTATION_SUMMARY.md` - What was implemented

## ⚙️ Architecture

```
Spring Boot App
    ↓ (metrics)
Prometheus
    ↓ (queries)
Grafana
    ↓ (displays)
Dashboards
```

## 💡 Pro Tips

1. **Change Grafana password** after first login for security
2. **Set up alerts** in Grafana for critical metrics
3. **Export dashboards** as JSON for backup
4. **Scale metrics** by adjusting `scrape_interval` in prometheus.yml
5. **Monitor the monitor** by checking Prometheus health

## 📖 Documentation

- Full setup guide: `PROMETHEUS_GRAFANA_SETUP.md`
- Implementation summary: `IMPLEMENTATION_SUMMARY.md`
- This quick ref: `QUICK_REFERENCE.md`

---
**Last Updated**: May 3, 2026 | **Status**: Ready
