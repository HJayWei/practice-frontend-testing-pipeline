# Base：PHP 8.3 含 PostgreSQL 擴充套件
FROM php:8.3-fpm-alpine AS base
RUN apk add --no-cache libpq-dev \
    && docker-php-ext-install pdo_pgsql pgsql pcntl opcache

# Development：掛載 host 原始碼，啟動 artisan serve
FROM base AS development
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
WORKDIR /var/www/html
EXPOSE 8000
CMD ["sh", "-c", "composer install && php artisan serve --host=0.0.0.0 --port=8000"]

# Builder：安裝 production 依賴
FROM base AS builder
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
WORKDIR /var/www/html
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts
COPY . .
RUN composer run-script post-autoload-dump 2>/dev/null || true

# Production：複製完整應用與 vendor
FROM base AS production
WORKDIR /var/www/html
COPY --from=builder /var/www/html .
EXPOSE 8000
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
