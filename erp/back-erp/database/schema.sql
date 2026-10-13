-- Ejecutar con npm run setup; solo existe la tabla usuarios.
CREATE TABLE IF NOT EXISTS usuarios (
 id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 nombre VARCHAR(100) NOT NULL,
 correo VARCHAR(150) NOT NULL UNIQUE,
 password_hash VARCHAR(255) NOT NULL,
 rol ENUM('administrador','cajero') NOT NULL,
 estado ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
 session_version INT UNSIGNED NOT NULL DEFAULT 0
);
