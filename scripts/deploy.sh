#!/bin/bash

# Restoku Deployment Script
# Usage: ./deploy.sh [environment]

set -e

ENVIRONMENT=${1:-staging}
APP_NAME="restoku"

echo "Deploying $APP_NAME to $ENVIRONMENT..."

# Check if environment is valid
if [[ ! "$ENVIRONMENT" =~ ^(staging|production)$ ]]; then
  echo "Error: Invalid environment. Use 'staging' or 'production'"
  exit 1
fi

# Build for production
echo "Building for production..."
npm run build

# Deploy based on environment
if [ "$ENVIRONMENT" = "staging" ]; then
  echo "Deploying to staging server..."
  # Add your staging deployment commands here
  # Example: rsync -avz dist/ user@staging-server:/var/www/restoku-staging/
  
elif [ "$ENVIRONMENT" = "production" ]; then
  echo "Deploying to production server..."
  # Add your production deployment commands here
  # Example: rsync -avz dist/ user@production-server:/var/www/restoku/
fi

echo "Deployment to $ENVIRONMENT complete!"
