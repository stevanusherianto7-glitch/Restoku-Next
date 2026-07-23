#!/bin/bash
# scripts/setup-staging.sh
# Quick setup for staging environment

set -e

echo ""
echo "=========================================="
echo "   Restoku Staging Setup"
echo "=========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed."
    echo "Please install Docker first: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed."
    echo "Please install Docker Compose first."
    exit 1
fi

# Create .env files if they don't exist
if [ ! -f "backend/.env" ]; then
    echo "Creating backend .env file..."
    cp backend/.env.example backend/.env
    echo "Please edit backend/.env with your configuration"
fi

if [ ! -f "frontend/.env" ]; then
    echo "Creating frontend .env file..."
    cp frontend/.env.example frontend/.env
    echo "Please edit frontend/.env with your configuration"
fi

# Build Docker images
echo ""
echo "Building Docker images..."
docker-compose build

# Start services
echo ""
echo "Starting services..."
docker-compose up -d

# Wait for services to start
echo ""
echo "Waiting for services to start..."
sleep 10

# Run migrations
echo ""
echo "Running database migrations..."
docker-compose run api php artisan migrate --force

# Cache config
echo ""
echo "Caching configuration..."
docker-compose run api php artisan config:cache
docker-compose run api php artisan route:cache
docker-compose run api php artisan view:cache

echo ""
echo "=========================================="
echo "   Setup Complete!"
echo "=========================================="
echo ""
echo "Services:"
echo "  - Frontend: http://localhost:3000"
echo "  - API:      http://localhost:8000"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
echo ""
echo "To stop services:"
echo "  docker-compose down"
echo ""
