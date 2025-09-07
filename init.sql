CREATE DATABASE IF NOT EXISTS adsi;

USE adsi;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100),
  email VARCHAR(100) NOT NULL,
  usuario VARCHAR(100) NOT NULL,
  contrasena VARCHAR(100) NULL, 
  programa VARCHAR(100) NOT NULL,
  calificacion DECIMAL(5,2) DEFAULT 0,
  rol VARCHAR(20) DEFAULT 'usuario',
  profile_url VARCHAR(200)
);

CREATE TABLE if NOT EXISTS historial_cambios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_registro VARCHAR(10) NOT NULL,
    usuario VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    accion ENUM('CREAR', 'MODIFICAR', 'ELIMINAR') NOT NULL,
    fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    tabla_recurso VARCHAR(50) NOT NULL,
    descripcion TEXT NOT NULL,
    ip_address VARCHAR(45),
    valores_anteriores JSON NULL,
    valores_nuevos JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);