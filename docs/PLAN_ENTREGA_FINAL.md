# SIGTAU: avance y plan de entrega final

Revisión: 15 de noviembre de 2026. Base: `main`, commit `3b2b502`.
Consigna: Proyecto_Final.pdf, ADS II, UES. Entrega: 20 de noviembre de 2026, 11:55 p. m. (El Salvador).
Este documento es una base de trabajo; no sustituye el PDF final ni acredita pruebas pendientes.

## 1. Estado comprobado por revisión de código

| Componente | Implementación encontrada | Verificación pendiente |
|---|---|---|
| Acceso | Registro de estudiantes, login JWT, contraseñas BCrypt, roles ADMIN/TUTOR/STUDENT | Demostración con cuentas separadas |
| Catálogos | Carreras, materias, modalidades y motivos; formularios y API | Evidencia CRUD en PostgreSQL |
| Usuarios | Administración de usuarios y asignación de rol | Demostrar cambio de rol y acceso denegado |
| Tutorías | Crear, editar, listar, cerrar y eliminar; tutor limitado a las propias | Recorrer formularios con API real |
| Inscripciones | Cupos, duplicados, cruce de horarios, cancelación y bloqueos transaccionales | Concurrencia real sobre PostgreSQL |
| Pruebas | 13 pruebas Java existentes; 4 pruebas de formularios con API simulada | Reejecución actual y archivo de resultados |
| Automatización | Workflow backend/PostgreSQL y frontend | No se encontraron ejecuciones para el commit base consultado |

El backend activo es `backend/sigtau`; `backend/` contiene una plantilla antigua. No arrancar esa plantilla por error.
No se asigna porcentaje de avance: falta contrastar todos los requisitos previos y ejecutar el sistema completo.

## 2. Primer incremento de esta revisión

Problema: la interfaz mostraba tutorías OPEN pasadas como disponibles, mientras el servidor rechazaba inscribirse. También ofrecía cancelar inscripciones cuando su horario ya había comenzado.

Cambios: filtro de tutorías futuras con cupos; etiqueta de iniciada/finalizada; desactivación de inscripción y cancelación al llegar la hora de inicio sin recargar; bloqueo de acciones durante solicitudes; limpieza del motivo al cambiar de inscripción.

La API sigue siendo la autoridad de validación. La fecha/hora actual de la API carece de zona; configurar servidor y equipos de demostración en America/El_Salvador y con reloj sincronizado. Para despliegue multizona deberá definirse un contrato de fecha/hora con zona.

## 3. Plan de pruebas y evidencia

Usar datos ficticios y una base EXCLUSIVA de pruebas. Las pruebas de integración usan create-drop: no ejecutarlas contra datos reales.
Registrar por caso: fecha, ejecutor, ambiente, datos, esperado, observado, estado y ruta de captura/log. Una prueba preparada no cuenta como aprobada.

| ID | Acción | Resultado esperado | Estado al preparar el plan |
|---|---|---|---|
| P01 | Iniciar API y frontend con PostgreSQL | Arranque y tablas disponibles | Pendiente |
| P02 | Registrar estudiante e iniciar sesión | Acceso STUDENT, clave almacenada cifrada | Pendiente en entorno real |
| P03 | Contraseña incorrecta / acceso sin token | 401 sin acceso a tutorías | Pendiente en entorno real |
| P04 | Estudiante intenta administrar usuarios | 403 | Pendiente en entorno real |
| P05 | Crear, consultar, editar y eliminar catálogo sin relaciones | Datos persistidos; formulario inválido rechazado | Pendiente en entorno real |
| P06 | Editar usuario sin cambiar contraseña | Conserva acceso con clave anterior | Pendiente en entorno real |
| P07 | Tutor crea tutoría futura; otro tutor intenta modificarla | Creación válida; modificación ajena denegada | Pendiente en entorno real |
| P08 | Inscripción válida y repetida | Descuenta una vez; duplicado rechazado | Pendiente en entorno real |
| P09 | Inscribirse en horario traslapado | Rechazo sin cambiar cupos | Pendiente en entorno real |
| P10 | Cancelar y repetir cancelación | Restituye exactamente un cupo | Pendiente en entorno real |
| P11 | Dos estudiantes solicitan simultáneamente el último cupo | Solo una inscripción activa y cero cupos | Pendiente PostgreSQL |
| P12 | Tutoría pasada OPEN con cupos | No disponible; botón desactivado al mostrar todas | Pruebas nuevas preparadas |
| P13 | Mantener pantalla abierta hasta inicio | Inscripción/cancelación dejan de habilitarse | Pruebas nuevas preparadas |
| P14 | Reiniciar aplicación tras guardar datos | Datos siguen en PostgreSQL | Pendiente |
| P15 | Respaldar y restaurar en otra base | Recuentos y consultas coinciden | Pendiente |

Comandos:

```bash
# backend/sigtau (Java 21)
bash mvnw --batch-mode test
# frontend/sigtau-frontend
npm ci
npm run test:unit
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

Las pruebas Playwright simulan la API; no prueban conexión real con PostgreSQL.

## 4. Método propuesto de conversión

Propuesta sujeta a validación del equipo: prueba piloto con una carrera y un grupo reducido de tutores/estudiantes. Permite validar disponibilidad, inscripción y capacitación antes de extender SIGTAU. La forma actual de administrar tutorías debe confirmarse con los responsables; no se presupone un sistema previo concreto.

| Método | Consiste en | Ventaja | Riesgo/adecuación |
|---|---|---|---|
| Directa | Sustituir el mecanismo anterior en una fecha | Transición rápida | Interrupción total si falla; no recomendada sin experiencia operativa |
| Paralelo | Mantener ambos mecanismos temporalmente | Comparar resultados y conservar respaldo operativo | Doble registro y divergencias de cupos |
| Piloto | Operar primero en un grupo limitado | Detectar fallos con impacto acotado | Requiere seleccionar usuarios representativos; recomendado |
| Etapas | Incorporar módulos o grupos gradualmente | Distribuir capacitación y carga | Coordinar dependencias entre catálogos, tutorías e inscripciones |

## 5. Cronograma propuesto y responsables

Roles pendientes de asignar a integrantes reales; no implica compromisos aceptados.

| Fecha | Actividad | Responsable propuesto | Evidencia de cierre |
|---|---|---|---|
| 15 nov | Revisar repositorio y corregir disponibilidad | Desarrollo | Rama, pruebas y revisión de cambios |
| 16 nov | Ejecutar PostgreSQL + API + frontend; revisar CRUD | Desarrollo / pruebas | Capturas y resultados P01–P10 |
| 17 nov | Concurrencia, persistencia, respaldo y restauración | Base de datos / pruebas | Resultados P11–P15 y registro de restauración |
| 18 nov | Redactar conversión, riesgos, IA y conclusiones | Documentación / equipo | Borrador coherente con evidencia real |
| 19 nov | Ensayo de demostración y preguntas individuales | Todos | Guion, cuentas de prueba y ensayo cronometrado |
| 20 nov | Verificación final, PDF y entrega antes de 23:55 | Coordinación | PDF revisado y comprobante de entrega |

Conversión de datos: inventariar registros de origen, definir campos y unidades, depurar duplicados, asociar carreras/materias/tutores, importar a entorno de prueba y comparar recuentos. Crear usuarios por los servicios con hash de contraseña; no importar claves en texto plano. No existe importador de datos implementado: definirlo solo si la fuente real lo requiere.

Antes del piloto: respaldo PostgreSQL, restauración probada, catálogos validados, cuentas por rol y capacitación breve. Criterio de salida: todos los casos críticos aprobados, sin sobrecupos ni accesos indebidos, y responsable del piloto conforme. Si falla, detener nuevas inscripciones, registrar operaciones pendientes, recuperar el respaldo validado en entorno aislado y reconciliar los movimientos posteriores antes de retomar; no descartar inscripciones silenciosamente.

| Riesgo | Prevención y respuesta |
|---|---|
| Arrancar la plantilla antigua | Documentar y usar backend/sigtau |
| Fallo de conexión o credenciales | Comprobar variables y conexión antes del ensayo |
| Pérdida de datos | Respaldo, restauración probada y base de pruebas separada |
| Sobrecupo concurrente | Conservar bloqueos y ejecutar P11 en PostgreSQL |
| Desfase de reloj | Equipos sincronizados y misma zona horaria |
| Exposición de cuenta de desarrollo | Cambiar secreto JWT y contraseña inicial antes de publicar |
| Falta de internet en exposición | Dependencias instaladas, PostgreSQL local y ensayo sin descargas |
| Integrante desconoce el sistema | Cada persona practica registro, tutoría, inscripción y explicación técnica |

## 6. Propuesta fundamentada de IA (no implementada)

No se encontró una funcionalidad de IA integrada al producto en los archivos revisados. La consigna permite una propuesta; no es necesario añadir una integración apresurada.

Problema propuesto: facilitar que el estudiante encuentre tutorías relacionadas con una duda escrita en lenguaje natural. Una primera versión sin IA puede buscar por materia, título y horario (el catálogo ya tiene búsqueda textual). Una versión futura podría calcular representaciones semánticas de títulos/descripciones y comparar la consulta para recomendar hasta tres tutorías relevantes.

Integración propuesta: servicio de recomendación de solo lectura detrás del backend; filtrar por estado, fecha y cupos antes de devolver resultados; mostrar motivo de recomendación y permitir búsqueda convencional como alternativa. La IA nunca inscribe automáticamente ni cambia roles o cupos.

Datos mínimos: títulos, materias y descripciones; no enviar nombres, correos, contraseñas ni historial individual a proveedores externos. Evaluar un conjunto de consultas revisadas por tutores, proporción de recomendaciones pertinentes, latencia y costo. Una comparación con la búsqueda actual determinará si añade valor; no se inventan métricas obtenidas.

Beneficios posibles: búsqueda más flexible y apoyo a estudiantes que no conocen el nombre exacto de la materia. Limitaciones: recomendaciones erróneas, costo, dependencia de servicio y necesidad de evaluación humana. Si se usa un modelo preentrenado, aclarar que SIGTAU no entrenó su propio modelo.

Herramientas empleadas en esta revisión: ChatGPT/Codex para análisis de código, propuesta de ajustes y preparación de pruebas/documentación; cambios sujetos a verificación. El equipo debe declarar únicamente herramientas que realmente utilizó.

## 7. Guion de demostración funcional

1. Explicar propósito: organizar tutorías universitarias, horarios e inscripciones por rol.
2. Mostrar PostgreSQL y arranque de API/frontend.
3. ADMIN: crear carrera, materia y tutor; mostrar una validación de formulario.
4. TUTOR: crear tutoría futura con dos cupos.
5. STUDENT: registrarse, buscar e inscribirse; demostrar el descuento y rechazo del duplicado.
6. Cancelar y verificar devolución del cupo; consultar datos persistidos.
7. Mostrar acceso denegado de estudiante a administración y protección de tutorías ajenas.
8. Presentar resultados reales de pruebas, piloto propuesto e IA futura.
9. Cada integrante explica un recorrido y una decisión técnica.

## 8. Documento final pendiente

Estructura sugerida: portada, introducción/objetivos, descripción y arquitectura, pruebas con evidencias, comparación y selección de conversión, cronograma/riesgos, IA y herramientas utilizadas, conclusiones sustentadas y referencias verificadas. Retomar el avance anterior, sin inventar integrantes, capturas ni resultados. Antes de entregar el PDF, confirmar autores, fuentes bibliográficas consultadas y resultados reales.

Conclusión provisional: existe una base funcional implementada en código; falta validar el funcionamiento completo con PostgreSQL y reunir evidencia para afirmar que está lista para exposición.
