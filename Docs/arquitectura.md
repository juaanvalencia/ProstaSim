# Arquitectura

PROSTA-SIM sigue una arquitectura cliente-servidor organizada en capas. El cliente es la aplicación React que corre en el navegador, y el servidor es Supabase. Como no tenemos un backend propio, la autenticación, la base de datos y las reglas de seguridad viven allá.

Dentro del cliente, a su vez, el código se divide en cuatro capas. Cada una tiene una responsabilidad propia y, por lo tanto, solo habla con las que le corresponden.

| Capa | Responsabilidad | Dónde está |
| --- | --- | --- |
| Presentación | Pantallas, componentes y el visor 3D. Muestra datos y recibe acciones del usuario | `src/pages/`, `src/components/*/` y `src/components/*/ui/` |
| Lógica | Reglas del simulador: cómo se califica un caso y cómo se genera un paciente | `src/components/clinicalCases/logic/` |
| Integración | Lo único que sale a internet. Hoy solo Supabase; después, el Tutor IA | `src/services/` |
| Datos | Contenido educativo y casos clínicos, más las tablas en Supabase | `src/components/*/data/` y Supabase |

## Reglas que seguimos

Ningún componente importa el cliente de Supabase. Si una pantalla necesita datos de la base, los pide a una función de `src/services/`. Hoy solo dos archivos tocan Supabase: `authService.js` y `clinicalCasesService.js`. Así, si mañana cambia la base de datos o se agrega un backend, solo hay que modificar esa carpeta.

La lógica no conoce React ni Supabase. `scoring.js` y `caseVariants.js` son funciones puras: reciben datos y devuelven resultados. Por eso se pueden probar con tests automáticos sin abrir el navegador.

El contenido, por su parte, no se programa. Las unidades de Aprendizaje, los órganos del modelo 3D y los casos clínicos están en archivos de datos. Para agregar un caso o una unidad nueva no hace falta tocar componentes.

## Estructura de carpetas

```text
src/
├── main.jsx                    Punto de entrada: monta la aplicación con sus proveedores
├── App.jsx                     Rutas: bienvenida, ingreso y registro sin sesión; panel con sesión
├── Dashboard.jsx               Panel principal: menú lateral agrupado y cambio entre módulos
├── index.css                   Estilos base de la aplicación
├── styles/
│   └── theme.css               Colores, tipografías y medidas de los temas claro y oscuro
├── context/
│   ├── AuthContext.jsx         Estado de la sesión (usuario y perfil)
│   ├── ThemeContext.jsx        Tema elegido (claro, oscuro o del sistema)
│   ├── themeContext.js         Opciones del tema y clave donde se guarda
│   └── useTheme.js             Acceso al tema desde cualquier componente
├── pages/                      Ingreso y registro
│   └── AuthShell.jsx           Diseño común de las dos pantallas
├── services/                   Integración con Supabase
│   ├── supabase.js             Cliente de Supabase
│   ├── authService.js          Sesión, registro, inicio de sesión y perfil
│   └── clinicalCasesService.js Guardar y consultar intentos de casos
└── components/
    ├── brand/                  Logo de PROSTA-SIM
    ├── landing/                Página de bienvenida
    ├── profile/                Menú de perfil (tema y cierre de sesión)
    ├── theme/                  Selector de tema
    ├── learning/               Aprendizaje
    │   └── data/               Contenido de las seis unidades
    ├── anatomy/                Anatomía 3D
    │   ├── AnatomyScene.jsx    Escena 3D reutilizable (modelo, luces y cámara)
    │   └── anatomyData.js      Órganos y posiciones de cámara
    └── clinicalCases/          Casos clínicos
        ├── ui/                 Pantallas, pasos del caso y visor 3D
        ├── logic/              Calificación, generación de pacientes y examen físico
        └── data/               Plantillas de casos y zonas de la próstata

public/
├── favicon.svg                 Ícono de la pestaña
└── models/prostata.glb         Modelo 3D de la pelvis masculina

supabase/
└── clinical_case_attempts.sql  Tabla de intentos de casos clínicos y sus reglas de seguridad
```

## Decisiones

### React Three Fiber en lugar de Unity

Al principio pensamos en Unity para el modelo 3D. Sin embargo, elegimos React Three Fiber porque corre dentro de la misma aplicación React: no hay que cargar un motor aparte, el modelo responde directamente al estado de la pantalla y todo el equipo trabaja con el mismo lenguaje. El visor de Anatomía 3D (`AnatomyScene.jsx`) se reutiliza en Casos clínicos.

### El 3D se carga solo cuando se usa

Three.js pesa cerca de 1 MB. Anatomía 3D y el visor de los casos se cargan de forma diferida, así que el estudiante que solo abre Aprendizaje no lo descarga. Con eso la carga inicial pasó de 1.557 KB a 561 KB.

### La IA no inventa casos

Los casos clínicos los escribe el equipo a partir de guías publicadas (PI-RADS v2.1 y las guías de la Asociación Europea de Urología). La aplicación puede variar el nombre, la edad o el lado de una lesión, pero nunca los valores clínicos ni las respuestas correctas. De esa forma evitamos enseñar algo incorrecto.
