# PROSTA-SIM

Plataforma web de aprendizaje y simulación educativa sobre la próstata y sus patologías. Reúne contenidos teóricos, exploración anatómica, casos clínicos ficticios y evaluación de conocimientos.

> Proyecto con fines exclusivamente educativos. Los casos y contenidos no sustituyen la orientación de un profesional de la salud.

## Estado de los módulos

| Módulo | Descripción | Estado |
| --- | --- | --- |
| Autenticación | Registro, inicio y cierre de sesión con rutas protegidas | Implementado |
| Inicio (Dashboard) | Panel principal con acceso a los módulos | Implementado |
| Aprendizaje | Contenidos educativos organizados por temas | Implementado |
| Anatomía 3D | Exploración de las estructuras anatómicas de la próstata | Implementado |
| Casos clínicos | Escenarios clínicos ficticios con toma de decisiones | Implementado |
| Tutor IA | Acompañamiento educativo asistido por inteligencia artificial | En desarrollo |
| Evaluaciones | Medición de conocimientos adquiridos | En desarrollo |
| Mi progreso | Seguimiento del avance académico del estudiante | En desarrollo |

## Tecnologías

- [React 19](https://react.dev) con [Vite](https://vite.dev)
- [React Router](https://reactrouter.com) para la navegación
- [Supabase](https://supabase.com) para autenticación y base de datos (PostgreSQL)
- [React Three Fiber](https://r3f.docs.pmnd.rs) (Three.js) para los modelos 3D
- [Lucide React](https://lucide.dev) para los íconos
- [Vitest](https://vitest.dev) para las pruebas automáticas
- ESLint para el análisis estático del código

## Requisitos

- Node.js 22 (la versión exacta está en `.nvmrc`)
- npm
- Un proyecto de Supabase con su URL y su clave pública (anon key)

## Instalación y ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con las credenciales del proyecto de Supabase

# 3. Ejecutar en modo desarrollo
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

### Variables de entorno

| Variable | Descripción |
| --- | --- |
| `VITE_SUPABASE_URL` | URL del proyecto de Supabase |
| `VITE_SUPABASE_ANON_KEY` | Clave pública (anon key) del proyecto |

Si alguna de las dos falta, la aplicación muestra un error al iniciar.

### Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la versión de producción en `dist/` |
| `npm run preview` | Sirve localmente la versión de producción |
| `npm run lint` | Ejecuta ESLint sobre el proyecto |
| `npm test` | Ejecuta las pruebas automáticas con Vitest |
| `npm run test:coverage` | Corre las pruebas y genera el reporte de cobertura en `coverage/` |

## Estructura del proyecto

El código sigue una arquitectura cliente-servidor organizada en capas: presentación, lógica, integración y datos. La explicación completa, con el detalle de cada carpeta, está en la documentación ([`Docs/arquitectura.md`](Docs/arquitectura.md)).

```text
src/
├── App.jsx                  # Rutas y protección de rutas privadas
├── Dashboard.jsx            # Panel principal y navegación entre módulos
├── context/                 # Estado de la sesión
├── pages/                   # Inicio de sesión y registro
├── services/                # Única capa que se comunica con Supabase
└── components/
    ├── learning/            # Aprendizaje
    ├── anatomy/             # Anatomía 3D
    └── clinicalCases/       # Casos clínicos (ui, logic y data)
```

## Documentación

La documentación completa está en la carpeta `Docs/` y se publica en GitBook.

## Base de datos

La aplicación no tiene un backend propio: el frontend se comunica directamente con Supabase.

- **Autenticación:** se usa Supabase Auth. Los usuarios se almacenan en `auth.users` y el nombre completo se guarda en los metadatos del usuario al registrarse.
- **Tabla `profiles`:** contiene la información de perfil de cada estudiante y se consulta por el `id` del usuario autenticado.
- **Tabla `clinical_case_attempts`:** guarda cada intento de un caso clínico. Se crea con el script `supabase/clinical_case_attempts.sql`.
- **Seguridad:** como la clave pública viaja en el frontend, cada tabla debe tener habilitado Row Level Security (RLS) con políticas que limiten a cada estudiante a su propia información.

Los contenidos de Aprendizaje y las plantillas de Casos clínicos están en archivos de datos dentro de cada módulo.

## Próximos pasos

- Registrar los resultados de las actividades en la base de datos para alimentar el módulo Mi progreso.
- Versionar el esquema de la base de datos mediante migraciones de Supabase dentro del repositorio.
