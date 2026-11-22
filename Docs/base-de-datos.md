# Base de datos

La base de datos es PostgreSQL, administrada por Supabase. La aplicación se conecta con la clave pública, que viaja en el código del navegador. Por eso cada tabla tiene activada la seguridad por fila (Row Level Security): sin políticas que lo permitan, esa clave no puede leer ni escribir nada.

## Usuarios

Los usuarios los maneja Supabase Auth, en la tabla `auth.users`. Al registrarse, el nombre completo se guarda en los metadatos del usuario (`full_name`).

## `profiles`

Guarda los datos de perfil del estudiante, y la aplicación la consulta con el `id` del usuario que inició sesión.

## `clinical_case_attempts`

Un registro por cada caso clínico que un estudiante termina.

| Columna | Tipo | Contenido |
| --- | --- | --- |
| `id` | `uuid` | Identificador del intento |
| `user_id` | `uuid` | Estudiante. Por defecto, el usuario de la sesión |
| `case_id` | `text` | Plantilla del caso, por ejemplo `alberto-cancer` |
| `score` | `integer` | Puntaje final, de 0 a 100 |
| `correct_answers` | `integer` | Preguntas respondidas bien |
| `total_questions` | `integer` | Preguntas del caso |
| `answers` | `jsonb` | Detalle del intento (ver abajo) |
| `completed_at` | `timestamptz` | Fecha y hora en que terminó el caso |

La columna `answers` guarda:

```json
{
  "questions": { "q1": "a", "q2": "c", "q3": "a" },
  "requestedTests": ["dre", "psa", "mri"],
  "hintsUsed": { "q2": 1 },
  "patientExplanation": "Don Ramiro, encontramos...",
  "seed": 2840193377
}
```

En cuanto a las políticas, cada estudiante puede leer y crear solo sus propios intentos. Como no hay políticas para editar ni borrar, un intento guardado no se puede modificar desde la aplicación.

### Crear la tabla

El script está en `supabase/clinical_case_attempts.sql`. Se ejecuta una sola vez: en Supabase, abre **SQL Editor → New query**, pega el contenido del archivo y presiona **Run**. Debe responder «Success. No rows returned». El script se puede volver a ejecutar sin problema, porque no duplica nada.

Eso sí, hace falta ser miembro del proyecto en Supabase, porque la clave pública no sirve para crear tablas.
