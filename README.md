# Laboratorio PHP

Este repositorio contiene un laboratorio de desarrollo en PHP diseñado para aprender y experimentar con las funcionalidades del lenguaje. El proyecto está configurado para ejecutarse fácilmente usando Docker y Docker Compose.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado en tu sistema:

- **Git** - Para clonar el repositorio
- **Docker** - Para ejecutar los contenedores
- **Docker Compose** - Para orquestar los servicios

### Verificar Instalaciones

Ejecuta los siguientes comandos para verificar que tienes todo instalado:

```bash
git --version
docker --version
docker-compose --version
```

## 🚀 Instalación y Configuración

### Paso 1: Clonar el Repositorio

```bash
# Clona el repositorio
git clone https://github.com/Wuubzi/lab-php.git

# Navega al directorio del proyecto
cd lab-php
```

### Paso 2: Construir y Ejecutar con Docker

```bash
# Construye y ejecuta todos los servicios en segundo plano
docker-compose up -d --build
```

Este comando:
- `up`: Inicia los servicios
- `-d`: Ejecuta en modo detached (segundo plano)
- `--build`: Reconstruye las imágenes antes de iniciar

## 🐳 Guía de Docker

### Estructura del Proyecto

```
laboratorio-php/
├── docker-compose.yml
├── Dockerfile
├── src/
│   └── index.php
├── config/
│   └── php.ini
└── README.md
```

### Servicios Incluidos

El `docker-compose.yml` incluye los siguientes servicios:

- **PHP-FPM**: Servidor PHP 8.x
- **Nginx**: Servidor web
- **MySQL**: Base de datos
- **phpMyAdmin**: Interfaz web para MySQL

### Comandos Docker Útiles

```bash
# Ver el estado de los contenedores
docker-compose ps

# Ver logs de todos los servicios
docker-compose logs

# Ver logs de un servicio específico
docker-compose logs php

# Detener todos los servicios
docker-compose down

# Reiniciar un servicio específico
docker-compose restart php

# Ejecutar comandos dentro del contenedor PHP
docker-compose exec php bash

# Acceder al contenedor de MySQL
docker-compose exec mysql mysql -u root -p
```

## 📁 Dependencias

### Dependencias de PHP

Las principales dependencias están definidas en `composer.json`:

```json
{
    "require": {
        "php": ">=8.0",
        "ext-pdo": "*",
        "ext-mysql": "*"
    },
    "require-dev": {
        "phpunit/phpunit": "^9.0"
    }
}
```

### Instalar Dependencias con Composer

```bash
# Instalar dependencias usando Docker
docker-compose exec php composer install

# O si tienes Composer instalado localmente
composer install
```

## 🌐 Acceso a la Aplicación

Una vez que los contenedores estén ejecutándose, puedes acceder a:

- **Aplicación PHP**: http://localhost:8080
- **phpMyAdmin**: http://localhost:8081
  - Usuario: `root`
  - Contraseña: `root` (definida en docker-compose.yml)

## 🛠️ Desarrollo

### Estructura de Archivos

```
src/
├── index.php          # Punto de entrada
├── config/
│   └── database.php   # Configuración de BD
├── models/            # Modelos de datos
├── views/             # Plantillas
└── controllers/       # Lógica de controladores
```


## 🔧 Configuración Avanzada

## 🚨 Solución de Problemas

### Problemas Comunes

1. **Puerto ocupado**: Si el puerto 8080 está en uso:
   ```bash
   # Cambiar puerto en docker-compose.yml
   ports:
     - "8081:80"  # Usar puerto 8081 en lugar de 8080
   ```

2. **Permisos de archivos**:
   ```bash
   # Dar permisos de escritura
   sudo chmod -R 755 src/
   ```

3. **Limpiar contenedores**:
   ```bash
   # Eliminar todos los contenedores y volúmenes
   docker-compose down -v --remove-orphans
   ```

### Logs de Depuración

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de errores de PHP
docker-compose exec php tail -f /var/log/php_errors.log
```

## 📝 Scripts Útiles

Puedes crear scripts en `package.json` o `Makefile`:

```makefile
# Makefile
start:
	docker-compose up -d --build

stop:
	docker-compose down

restart:
	docker-compose restart

logs:
	docker-compose logs -f

clean:
	docker-compose down -v --remove-orphans
	docker system prune -f
```



## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.



---

¡Feliz codificación! 🎉
