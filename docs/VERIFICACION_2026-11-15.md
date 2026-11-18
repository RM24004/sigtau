# Verificación del 15 de noviembre de 2026

Base revisada: `3b2b502` de jc21002/sigtau. Entorno: Java 21.0.13 y Node 24.22.1.

| Comprobación | Resultado real |
|---|---|
| Instalación frontend (`npm ci`) | Aprobada: 163 paquetes instalados |
| Pruebas nuevas (`npm run test:unit`) | 7 aprobadas, 0 fallidas |
| ESLint después de los cambios | Aprobado |
| Compilación frontend después de los cambios | Aprobada con Vite 8.0.3 |
| `git diff --check` | Aprobado |
| Backend (`bash mvnw --batch-mode test`) | Bloqueado al resolver Spring Boot 3.5.12: fallo DNS de repo.maven.apache.org. No ejecutó pruebas Java |
| Playwright | Bloqueado al descargar Chromium; 4 pruebas existentes y 2 nuevas pendientes |
| PostgreSQL real / recorrido completo | Pendiente; no se ejecutó base de datos en esta revisión |
| GitHub Actions del commit base | Consulta sin ejecuciones devueltas; no acredita éxito de CI |

Las 13 pruebas aprobadas mencionadas en ENTREGA_GERSON.md son un resultado histórico de otro entorno; no deben presentarse como reejecutadas hoy.

## Casos nuevos automatizados

Pruebas unitarias: tutoría futura, instante exacto de inicio, tutoría pasada que conserva OPEN/cupos, cerrada, sin cupos, fecha inválida y límite de cancelación.

Pruebas de navegador preparadas: filtro de tutorías pasadas y actualización sin recargar; cancelación de tutoría iniciada incluso con confirmación abierta. Emplean API simulada y reloj controlado.

## Siguiente validación

En un equipo con Java 21, Node 22, PostgreSQL y acceso a dependencias, ejecutar los comandos de PLAN_ENTREGA_FINAL.md; guardar salidas reales. Ejecutar P01–P15, incluyendo concurrencia y restauración. Incorporar capturas de la interfaz y datos persistidos al documento final. No declarar el sistema completo validado hasta cerrar estos puntos.
