#!/bin/sh
set -e

# Run migrations if DB_DATABASE is set
if [ -n "$DB_DATABASE" ]; then
    echo "Running database migrations..."
    php artisan migrate --force
fi

# Cache configuration
echo "Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Create storage link
php artisan storage:link

# Start PHP-FPM
exec "$@"
