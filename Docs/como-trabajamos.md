# Cómo trabajamos

## Ramas

| Rama | Para qué sirve |
| --- | --- |
| `main` | La versión estable, la que se presenta |
| `develop` | Donde se integra el trabajo de todos antes de pasar a `main` |
| `qa/testing` | Pruebas y desarrollo de quien hace de tester |
| `feature/...` | Una rama por módulo o funcionalidad, por ejemplo `feature/clinical-cases` |

Nadie escribe directamente en `main` ni en `develop`. En cambio, cada persona trabaja en su rama y, cuando termina, abre un pull request.

## Pull requests

Un pull request es una solicitud para unir los cambios de una rama con otra. Así, antes de entrar a `develop`, el equipo revisa el código, comenta y pide ajustes si hace falta.

El recorrido normal es este: primero, cada rama de trabajo se une a `develop` mediante un pull request. Después, cuando `develop` está estable para una entrega, se abre otro de `develop` hacia `main`.

Antes de abrir un pull request conviene correr:

```bash
npm run lint
npm test
npm run build
```

Si alguno falla, es mejor arreglarlo antes, porque así quien revisa se concentra en el código y no en errores que la herramienta ya detecta.

## Mensajes de commit

Usamos el formato de [Conventional Commits](https://www.conventionalcommits.org/es/): un prefijo que dice qué tipo de cambio es y, a continuación, una descripción corta.

| Prefijo | Cuándo |
| --- | --- |
| `feat:` | Una funcionalidad nueva |
| `fix:` | La corrección de un error |
| `refactor:` | Un cambio en el código que no altera lo que hace la aplicación |
| `test:` | Pruebas nuevas o modificadas |
| `docs:` | Documentación |
| `chore:` | Mantenimiento, como dependencias o configuración |

La descripción va en español. Por ejemplo: `feat(casos-clinicos): agrega el módulo de casos clínicos con visor 3D` o `docs: agrega la documentación del proyecto`.

## Archivos compartidos

Algunos archivos los tocan varios módulos, como `Dashboard.jsx`, `AuthContext.jsx` o `AnatomyScene.jsx`. Si vas a cambiar uno, avisa al equipo, ya que, si dos personas lo editan a la vez en ramas distintas, el merge va a dar conflictos.

## Documentación

Esta documentación vive en la carpeta `Docs/` del repositorio y GitBook la publica automáticamente. Por lo tanto, para editarla basta con modificar los archivos `.md` y subir los cambios; el índice de la izquierda sale de `Docs/SUMMARY.md`.
