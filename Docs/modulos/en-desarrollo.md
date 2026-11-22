# Módulos en desarrollo

Por ahora, estos módulos aparecen en el menú, pero todavía muestran un aviso de «en desarrollo». Esto es lo que se planeó para cada uno.

## Tutor IA

Un chat para preguntar sobre la próstata y sobre las unidades. Las respuestas deben basarse en fuentes confiables y el tutor no puede dar diagnósticos de pacientes reales. La conexión con el servicio de IA tiene que pasar por un backend seguro, para que la clave del servicio nunca llegue al navegador.

Para empezar, Casos clínicos ya guarda la explicación que el estudiante escribe para el paciente. El Tutor IA podría calificarla con la misma rúbrica de cuatro criterios que se muestra en la retroalimentación.

## Evaluaciones

Cuestionarios por unidad con preguntas de selección múltiple y de verdadero o falso, calificación automática, retroalimentación e historial de intentos. Los datos se guardarán en Supabase.

## Mi progreso

Porcentaje de avance, unidades completadas, calificaciones, historial de evaluaciones y estadísticas del estudiante. Para mostrar el avance en los casos, el módulo puede leer los intentos directamente de la tabla `clinical_case_attempts`, que ya guarda puntaje, fecha y detalle de cada intento.
