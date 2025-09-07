FROM php:8.2-apache

# Instalar librerías necesarias para extensiones de PHP
RUN apt-get update && apt-get install -y \
    libzip-dev unzip git curl libpq-dev pkg-config \
    && docker-php-ext-install pdo pdo_pgsql \
    && docker-php-ext-enable pdo pdo_pgsql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Instalar Composer
RUN curl -sS https://getcomposer.org/installer | php \
    && mv composer.phar /usr/local/bin/composer \
    && chmod +x /usr/local/bin/composer

# Copiar configuración de Apache
COPY ./apache-config/000-default.conf /etc/apache2/sites-available/000-default.conf

# Habilitar mod_rewrite
RUN a2enmod rewrite

WORKDIR /var/www/html

# Instalar PHPMailer, Cloudinary y FPDF automáticamente
RUN composer require phpmailer/phpmailer  \
    --no-interaction --prefer-dist --optimize-autoloader
