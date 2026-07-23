# Restoku — Staging Deployment Guide

## Overview

This guide covers deploying Restoku to a staging environment.

---

## Prerequisites

- [ ] Server with SSH access (Ubuntu 22.04+)
- [ ] Docker & Docker Compose installed
- [ ] Domain configured (e.g., staging.restoku.id)
- [ ] SSL certificate (Let's Encrypt)

---

## Environment Setup

### 1. Clone Repository

```bash
ssh user@staging-server
cd /var/www
git clone https://github.com/your-org/restoku.git
cd restoku
```

### 2. Environment Variables

```bash
# Backend
cp backend/.env.example backend/.env
php artisan key:generate

# Edit backend/.env
APP_NAME=Restoku
APP_ENV=staging
APP_URL=https://staging-api.restoku.id
APP_DEBUG=false

DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=restoku_staging
DB_USERNAME=restoku
DB_PASSWORD=your-secure-password

REDIS_HOST=redis
REDIS_PORT=6379

SANCTUM_STATEFUL_DOMAINS=staging.restoku.id
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# Frontend
cp frontend/.env.example frontend/.env

# Edit frontend/.env
VITE_API_URL=https://staging-api.restoku.id/api/v1
VITE_WS_HOST=staging-ws.restoku.id
VITE_WS_PORT=443
```

---

## Docker Deployment

### docker-compose.yml

```yaml
version: "3.8"

services:
  # Backend API
  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: restoku-api
    restart: unless-stopped
    ports:
      - "8000:8000"
    environment:
      - APP_ENV=staging
      - APP_DEBUG=false
    volumes:
      - ./backend:/var/www/html
      - storage:/var/www/html/storage
    depends_on:
      - postgres
      - redis
    networks:
      - restoku

  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        - VITE_API_URL=https://staging-api.restoku.id/api/v1
    container_name: restoku-frontend
    restart: unless-stopped
    ports:
      - "3000:80"
    networks:
      - restoku

  # PostgreSQL
  postgres:
    image: postgres:15-alpine
    container_name: restoku-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: restoku_staging
      POSTGRES_USER: restoku
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - restoku

  # Redis
  redis:
    image: redis:7-alpine
    container_name: restoku-redis
    restart: unless-stopped
    volumes:
      - redis_data:/data
    networks:
      - restoku

  # Nginx (Reverse Proxy)
  nginx:
    image: nginx:alpine
    container_name: restoku-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - api
      - frontend
    networks:
      - restoku

volumes:
  postgres_data:
  redis_data:
  storage:

networks:
  restoku:
    driver: bridge
```

---

## Deployment Steps

### Step 1: Prepare Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Step 2: Clone & Configure

```bash
cd /var/www
git clone https://github.com/your-org/restoku.git
cd restoku

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Generate app key
docker-compose run api php artisan key:generate

# Edit .env files with staging values
nano backend/.env
nano frontend/.env
```

### Step 3: Build & Deploy

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Run migrations
docker-compose run api php artisan migrate --force

# Seed database (optional)
docker-compose run api php artisan db:seed --force

# Cache config
docker-compose run api php artisan config:cache
docker-compose run api php artisan route:cache
docker-compose run api php artisan view:cache
```

### Step 4: Setup SSL

```bash
# Install Certbot
sudo apt install certbot -y

# Get certificate
sudo certbot certonly --standalone -d staging-api.restoku.id
sudo certbot certonly --standalone -d staging.restoku.id

# Copy certificates
sudo cp /etc/letsencrypt/live/staging-api.restoku.id/fullchain.pem ./nginx/ssl/api.crt
sudo cp /etc/letsencrypt/live/staging-api.restoku.id/privkey.pem ./nginx/ssl/api.key

# Restart nginx
docker-compose restart nginx
```

### Step 5: Setup Queue Worker

```bash
# Start queue worker
docker-compose run api php artisan queue:work --sleep=3 --tries=3

# Or use supervisor
sudo apt install supervisor -y
```

### Supervisor Config

```ini
; /etc/supervisor/conf.d/restoku-worker.conf
[program:restoku-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/html/artisan queue:work --sleep=3 --tries=3
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/html/storage/logs/worker.log
stopwaitsecs=3600
```

---

## Post-Deployment Verification

### Health Check

```bash
curl https://staging-api.restoku.id/api/v1/health
```

Expected:
```json
{
  "status": "ok",
  "version": "1.0.0"
}
```

### Test Login

```bash
curl -X POST https://staging-api.restoku.id/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@restoku.id","password":"password"}'
```

### Test Frontend

```bash
curl https://staging.restoku.id
```

Expected: HTML response with React app

---

## Rollback Procedure

```bash
# List recent commits
git log --oneline -10

# Rollback to specific commit
git checkout <commit-hash>

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Run migrations (if needed)
docker-compose run api php artisan migrate --force
```

---

## Monitoring

### Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f frontend
docker-compose logs -f nginx
```

### Health Monitoring

```bash
# Check all services
docker-compose ps

# Check resource usage
docker stats
```

---

## Troubleshooting

### Issue: 502 Bad Gateway

```bash
# Check if API is running
docker-compose ps api

# Check API logs
docker-compose logs api

# Restart API
docker-compose restart api
```

### Issue: Database Connection Failed

```bash
# Check PostgreSQL
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Test connection
docker-compose run api php artisan tinker
```

### Issue: Queue Not Processing

```bash
# Check queue worker
docker-compose ps queue-worker

# Restart queue
docker-compose restart queue-worker

# Check failed jobs
docker-compose run api php artisan queue:failed
```

---

## Security Checklist

- [ ] APP_DEBUG=false
- [ ] Strong database password
- [ ] SSL enabled
- [ ] Rate limiting configured
- [ ] CORS configured for staging domain only
- [ ] No sensitive data in logs
- [ ] Regular backups configured
