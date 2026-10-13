# ERP Cafetería El Grano

**Gabriel Emiliano Gonzalez Camacho · Grupo 7A1**  
Práctica 8: Autenticación y autorización. Proyecto basado en el avance Angular entregado por el alumno.

## Qué incluye

- Angular con login como pantalla inicial, `home` y `sin-acceso`.
- API Node.js / Express organizada en configuración, modelos, servicios, middleware y rutas.
- MySQL con **una sola tabla: `usuarios`**. No se crean tablas de ventas, compras, inventario, empleados ni contabilidad.
- Contraseñas protegidas con bcrypt, JWT de 30 minutos y revocación de sesiones al cerrar sesión.
- Guardián de autenticación, guardián de permisos e interceptor HTTP.
- Comprobación real de estado y rol en el servidor en cada solicitud protegida.
- Pantallas del avance: ventas, compras, inventario, RRHH, contabilidad y acerca de.
- README, esquema SQL, pruebas y verificación automática de GitHub Actions.

## Alcance de esta entrega

La autenticación es persistente en MySQL. Los módulos conservados del ERP muestran datos **de demostración en memoria** para cumplir el requisito de una única tabla. El administrador puede consultar esos módulos y simular un cobro; el pedido se pierde al reiniciar la API. El total de ese cobro se calcula en el servidor con los precios del catálogo y 10 % de descuento.

Los botones de altas de órdenes, insumos y empleados están desactivados y señalados como demostración. Exportar CSV sí funciona en inventario y contabilidad. Esta entrega no implementa un ERP productivo ni facturación fiscal. El cajero inicia sesión correctamente, ve sus datos en `sin-acceso` y no puede abrir el panel administrativo ni los módulos.

## Requisitos

- Node.js **24.19 o posterior dentro de la rama 24**, con npm.
- MySQL 8 y su servicio encendido (también puede utilizarse el servicio MariaDB de XAMPP).
- Git, únicamente para subir el código.

No hace falta instalar Angular CLI globalmente: los comandos usan la versión del proyecto. Las versiones exactas de las dependencias quedan en ambos `package-lock.json`.

## Instalación en Windows / Visual Studio Code

1. Extrae el ZIP. Abre la carpeta `erp` en Visual Studio Code; debe verse `package.json` en la raíz.
2. En una terminal abierta en esa carpeta instala Angular y el backend:

```powershell
npm ci
npm ci --prefix back-erp
```

3. Enciende MySQL. Copia `back-erp/.env.example` como `back-erp/.env`:

```powershell
Copy-Item back-erp/.env.example back-erp/.env
```

En macOS/Linux el comando equivalente es `cp back-erp/.env.example back-erp/.env`.

4. Abre `back-erp/.env` y ajusta `DB_USER`, `DB_PASSWORD` y `DB_PORT` a tu instalación. Para una instalación local de XAMPP suele utilizarse `root` sin contraseña. La base nueva se llama `erp_autenticacion`: no se utiliza ni se borra la base del avance anterior.

5. Ejecuta la preparación:

```powershell
npm run setup --prefix back-erp
```

Este comando genera un secreto JWT aleatorio si no existe uno válido, crea la base, crea la única tabla y registra las dos cuentas con contraseñas protegidas mediante hash. Si `.env` no existe, también lo crea automáticamente. El usuario de MySQL necesita permiso para crear la base; como alternativa, créala previamente con una cuenta autorizada. El script no borra información ni restablece contraseñas de usuarios existentes.

6. En esa misma terminal inicia el backend:

```powershell
npm start --prefix back-erp
```

7. Abre **otra terminal** en la raíz `erp` e inicia Angular:

```powershell
npm start
```

8. Abre **http://localhost:4200**. Mantén abiertas ambas terminales. Angular redirige las solicitudes `/api` a `http://localhost:3000` mediante `proxy.conf.json`.

## Cuentas de prueba

| Correo | Contraseña | Rol | Resultado |
| --- | --- | --- | --- |
| admin@elgrano.com | Admin123! | administrador | `/home` y acceso a módulos |
| cajero@elgrano.com | Cajero123! | cajero | `/sin-acceso`, con sus datos registrados |

Son cuentas académicas de demostración, no credenciales para publicar un sistema productivo. Ni la contraseña ni su hash aparecen en respuestas de la API, JWT o pantallas. Ambos usuarios ven ID, nombre, correo, rol y estado.

## Prueba rápida para presentar la práctica

1. Abre `/home` sin sesión: debe llevarte a `/login`.
2. Ingresa una contraseña incorrecta: debe aparecer un error sin acceso.
3. Inicia con administrador: debe verse el mensaje de bienvenida y sus datos.
4. Abre los módulos y prueba exportar CSV o simular un cobro.
5. Recarga la página: la sesión de esa pestaña se conserva mientras sea válida.
6. Cierra sesión e ingresa como cajero: debe abrir `sin-acceso`.
7. Escribe `/home` o `/ventas` directamente como cajero: debe regresar a `sin-acceso`.
8. Cierra sesión y regresa con el botón Atrás: no debe permitir acceso protegido.
9. Para comprobar vencimiento, cambia temporalmente `JWT_EXPIRES_IN=10s`, reinicia la API e inicia de nuevo. La interfaz vuelve al login al vencer el token. Después restablece `30m`.

El cierre de sesión incrementa `session_version`, por lo que invalida los JWT anteriores del usuario, incluso en otras pestañas. Los intentos de acceso incorrectos están limitados a 20 por IP cada 15 minutos. Reiniciar la API local reinicia el contador de intentos, pero no recupera tokens revocados en MySQL.

## Base de datos

Esquema: `back-erp/database/schema.sql`. La preparación se ejecuta con `npm run setup --prefix back-erp`.

| Campo | Tipo | Función |
| --- | --- | --- |
| id | INT UNSIGNED, PK | Identificador |
| nombre | VARCHAR(100) | Nombre registrado |
| correo | VARCHAR(150), UNIQUE | Identificador del login |
| password_hash | VARCHAR(255) | Hash bcrypt |
| rol | ENUM | administrador o cajero |
| estado | ENUM | activo o inactivo |
| session_version | INT UNSIGNED | Revocación de tokens |

Consulta de comprobación, sin exponer los hashes:

```sql
USE erp_autenticacion;
SHOW TABLES;
SELECT id, nombre, correo, rol, estado, session_version FROM usuarios;
```

## Arquitectura

- `src/app/components`: pantallas Angular; se conservaron los módulos del ZIP base.
- `src/app/core/auth`: servicio de sesión, interceptor y guardianes.
- `src/app/core/services`: clientes HTTP del avance.
- `back-erp/config`: variables de entorno y pool MySQL.
- `back-erp/models`: consultas SQL parametrizadas a usuarios.
- `back-erp/services`: comprobación de credenciales y JWT.
- `back-erp/middleware`: autenticación y autorización.
- `back-erp/routes`: endpoints de autenticación y datos demo.
- `back-erp/database`: única tabla de la práctica.
- `back-erp/scripts`: preparación de base y cuentas.
- `back-erp/test`: pruebas de comportamiento de la API.

Angular funciona como SPA. Se retiró el servidor SSR del avance para tener un solo backend Express independiente en `back-erp`.

## API

Las rutas protegidas reciben `Authorization: Bearer <token>`.

| Método | Ruta | Permiso / respuesta |
| --- | --- | --- |
| GET | /api/health | Estado de la conexión MySQL |
| POST | /api/auth/login | `{correo,password}` → token, usuario público y expiresAt |
| GET | /api/auth/me | Cualquier usuario activo con sesión válida |
| POST | /api/auth/logout | Revoca sesiones del usuario autenticado |
| GET | /api/auth/home | Solo administrador; mensaje y datos |
| GET | /api/ventas/productos | Administrador; catálogo demo |
| GET / POST | /api/ventas/facturas | Administrador; consultar / simular pedido |
| GET | /api/compras/ordenes | Administrador; órdenes demo |
| GET | /api/compras/proveedores | Administrador; proveedores demo |
| GET | /api/inventario/insumos | Administrador; insumos demo |
| GET | /api/rrhh/empleados | Administrador; personal demo |
| GET | /api/contabilidad/movimientos | Administrador; movimientos demo |

Estados relevantes: 400 datos inválidos, 401 sin sesión/credenciales inválidas/token vencido, 403 sin permisos y 429 exceso de intentos. Cambiar el rol guardado en el navegador no cambia el rol registrado en el servidor.

El JWT se conserva en `sessionStorage` y se elimina al cerrar sesión o vencer. Es accesible al JavaScript de esta aplicación; una publicación real requiere revisar la estrategia de sesión, usar HTTPS y retirar las cuentas de demostración. `.env` nunca debe subirse a GitHub.

## Compilación y pruebas

```powershell
npm run build
npm test
npm run test:api
```

La compilación se genera en `dist/mi-proyecto/browser`. GitHub Actions ejecuta compilación y pruebas al hacer push. Las pruebas automáticas de API usan un repositorio de usuarios en memoria: comprueban HTTP, roles y JWT, pero no sustituyen la prueba de conexión con tu MySQL.

## Subir a GitHub

Crea un repositorio vacío en GitHub, sin README inicial. Desde la carpeta `erp` ejecuta, sustituyendo la URL de ejemplo por la de tu repositorio:

```powershell
git init
git add .
git commit -m "ERP Angular con autenticacion JWT y roles"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```

El archivo `.gitignore` excluye `node_modules`, `.angular`, `dist`, archivos `.env` y registros. Sí se incluyen los dos `package-lock.json` y `.env.example`. No subas el ZIP como sustituto del código: extrae su contenido y sube la carpeta del proyecto.

GitHub aloja el código. **GitHub Pages por sí solo no ejecuta Node.js ni MySQL**. Para desplegar el sistema completo se necesita un servidor para la API y una base de datos; en producción `/api` debe apuntar al backend mediante un proxy del servidor web. El proxy de Angular incluido funciona en desarrollo con `npm start`.

## Solución de problemas

- `ECONNREFUSED` / API sin conexión: enciende MySQL, revisa puerto y ejecuta el backend.
- `Access denied`: corrige usuario y contraseña MySQL en `back-erp/.env`.
- Error de base/tabla inexistente: ejecuta `npm run setup --prefix back-erp`.
- Error de JWT_SECRET: vuelve a ejecutar setup; genera el secreto si falta o es demasiado corto. Si lo cambias, las sesiones anteriores dejarán de servir.
- Puerto 3000 ocupado: ajusta `PORT` y el destino de `proxy.conf.json` de forma consistente.
- Abres localhost:3000 y no aparece la página: la interfaz se abre en localhost:4200.
- Error por versión de Node: usa Node 24.19 y vuelve a ejecutar `npm ci`.

## Cambios respecto al avance

Se conservaron los estilos y pantallas principales del ERP. Se reemplazó la antigua carpeta `api` y su esquema de múltiples tablas por `back-erp` y la única tabla `usuarios`; se añadieron las pantallas de autenticación, protección de rutas, sesión JWT, manejo de errores, exportación CSV, documentación y pruebas. Los registros empresariales de muestra se sirven en memoria y se identifican explícitamente como demostración.
