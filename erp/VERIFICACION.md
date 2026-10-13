# Verificación de la entrega

- Compilación de producción Angular: correcta.
- Pruebas Angular: 6 aprobadas (componentes y guardianes).
- Pruebas API: 11 aprobadas (login, datos públicos, roles, rutas protegidas, entradas inválidas, token manipulado, vencimiento, revocación, cambio de rol, cuenta inactiva y cálculo de pedido).
- Revisión de sintaxis del script de preparación: correcta.

## Límites de la verificación

Las pruebas HTTP usan el servidor Express real con un repositorio de usuarios en memoria. No se ejecutó la preparación sobre un servidor MySQL porque no había uno disponible en este entorno. Debe ejecutarse `npm run setup --prefix back-erp` con el servicio MySQL local activo y las credenciales configuradas.

La compilación y las pruebas de componentes se ejecutaron, pero no se completó una revisión visual con navegador: el navegador de prueba no estuvo disponible. No se incluyen capturas ni evidencias simuladas. El README contiene el recorrido manual para verificar y obtener las evidencias en el equipo de entrega.

El proyecto no fue publicado en GitHub; se entrega el código preparado para que el alumno lo suba a su repositorio.
