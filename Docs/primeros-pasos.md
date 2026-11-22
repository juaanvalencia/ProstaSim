# Primeros pasos

## Lo que necesitas

* Node.js 22.23.5. Es la versión que está en el archivo `.nvmrc`. Si usas nvm, basta con correr `nvm use` en la carpeta del proyecto.
* npm, que viene con Node.
* Acceso al proyecto de Supabase del equipo, o uno propio, para tener la URL y la clave pública.

## Instalación

```bash
git clone https://github.com/juaanvalencia/ProstaSim.git
cd ProstaSim
npm install
```

Después copia el archivo de ejemplo de variables de entorno y complétalo con los datos de Supabase:

```bash
cp .env.example .env
```

| Variable | Qué va ahí |
| --- | --- |
| `VITE_SUPABASE_URL` | La URL del proyecto, con la forma `https://<id>.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | La clave pública (anon o publishable) |

Las dos están en Supabase, en **Project Settings → API**. Si falta alguna, la aplicación no arranca y muestra el error «Faltan las credenciales de Supabase».

{% hint style="danger" %}
Nunca pongas en el `.env` la clave `service_role` (o `sb_secret_…`). Esa clave salta todas las reglas de seguridad de la base de datos y, como el frontend se publica, cualquiera podría verla. El `.env` tampoco se sube a GitHub: ya está en el `.gitignore`.
{% endhint %}

## Correr la aplicación

```bash
npm run dev
```

Queda disponible en `http://localhost:5173`. La primera vez tienes que crear una cuenta desde la pantalla de registro. La contraseña debe tener al menos 8 caracteres.

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Levanta el servidor de desarrollo con recarga automática |
| `npm run build` | Genera la versión de producción en `dist/` |
| `npm run preview` | Sirve en local la versión de producción, para revisarla antes de publicar |
| `npm run lint` | Revisa el código con ESLint |
| `npm test` | Corre las pruebas automáticas con Vitest |

## Si algo falla

Si al abrir Anatomía 3D aparece el error `Failed to resolve import "@react-three/fiber"`, la instalación de esa librería quedó incompleta. Se arregla borrando la carpeta y reinstalando:

```bash
rm -rf node_modules/@react-three node_modules/.vite
npm install
```

Si olvidaste tu contraseña, no se puede recuperar: Supabase solo la guarda cifrada. Crea otra cuenta o pide a quien administra el proyecto que la restablezca desde **Authentication → Users**.
