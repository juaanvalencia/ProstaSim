# Pruebas

El proyecto combina pruebas automáticas, que se corren con un comando, y pruebas manuales de punta a punta en el navegador. Las automáticas cubren la lógica, mientras que las manuales comprueban lo que ve y hace el estudiante.

## Pruebas automáticas

Usamos [Vitest](https://vitest.dev), que se integra con Vite y reutiliza su configuración, junto con [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) y jsdom para probar las pantallas como las usaría una persona. Para correrlas:

```bash
npm test
```

Si además quieres ver el nombre de cada prueba, usa:

```bash
npx vitest run --reporter=verbose
```

Cada línea con `✓` es una prueba que pasó; en cambio, una `×` indica una que falló, y debajo aparece qué se esperaba y qué salió. Al final se muestra el resumen, por ejemplo `Tests 175 passed (175)`.

Para ver qué parte del código recorren las pruebas, usa:

```bash
npm run test:coverage
```

El resumen aparece en la terminal y el reporte detallado queda en `coverage/index.html`, donde se ven las líneas que ninguna prueba ejecuta.

### Dónde están

Las pruebas viven en la carpeta `tests/`, separadas del código de la aplicación. Dentro, la estructura repite la de `src/`, así que la prueba de `src/pages/Login.jsx` está en `tests/pages/Login.test.jsx`. En `tests/helpers/` están los simuladores compartidos.

Supabase y el lienzo 3D se reemplazan por simuladores. Así, las pruebas no tocan la base de datos real ni necesitan tarjeta gráfica ni conexión a internet.

### Qué se prueba

| Carpeta | Qué comprueba |
|---|---|
| `tests/pages`, `tests/context`, `tests/App.test.jsx` | Registro, inicio y cierre de sesión, la sesión guardada, el tema y qué pantalla ve cada usuario según tenga sesión o no |
| `tests/services` | El guardado y la consulta de intentos en Supabase, y el aviso cuando falta la configuración de conexión |
| `tests/components/learning` | Las seis unidades de aprendizaje y la navegación entre ellas |
| `tests/components/anatomy` | Los datos de los órganos contra el modelo 3D, las vistas de cámara, la selección, la visibilidad y la opacidad |
| `tests/components/clinicalCases` | La generación de pacientes, la calificación, el examen físico y el recorrido completo de un caso, desde el paciente hasta la retroalimentación |
| `tests/components/landing`, `profile`, `theme`, `tests/Dashboard.test.jsx` | La página de bienvenida, el menú de perfil, el selector de tema y el panel principal con su menú colapsable |

Las pruebas de casos clínicos recorren todas las plantillas automáticamente. Por eso, cuando se agrega un caso nuevo, queda cubierto sin escribir pruebas adicionales.

### ¿Cómo sabemos que las pruebas sirven?

Una prueba que nunca falla no demuestra nada. Por eso, además de verlas pasar, dañamos el código a propósito y revisamos que fallen. Por ejemplo, al cambiar el mínimo de la contraseña de 8 a 7 caracteres, al quitar el cierre del menú de perfil con Escape o al romper el botón de ocultar órganos, falló la prueba correspondiente; al restaurar el código, volvieron a pasar todas.

## Pruebas manuales de punta a punta

Cada vez que cambia algo importante del módulo, recorremos los seis casos en el navegador por dos caminos.

En el camino correcto, el estudiante pide solo las pruebas necesarias y responde todo bien. Se espera que el hallazgo no aparezca en el modelo antes de pedir las pruebas, que después se resalte la zona correcta y que el puntaje sea 100 %.

En el camino incorrecto, en cambio, el estudiante sigue sin pedir pruebas y responde todo mal. Se espera que aparezca el aviso de pruebas faltantes, que se muestren exactamente las pruebas necesarias marcadas como «No solicitada», que el puntaje sea 0 % y que «Nuevo paciente» genere otra variante y vuelva al primer paso.

También revisamos la vista en celular (375 px de ancho), donde no debe haber desplazamiento horizontal en ningún paso, y que la consola del navegador no muestre errores.

### Última ejecución

El 22 de noviembre de 2026 los seis casos pasaron los dos caminos. Esa vez encontramos dos problemas, que quedaron corregidos:

* Al marcar pruebas, quedaban seleccionadas pero no solicitadas, y si el estudiante presionaba el botón principal se perdía la selección. Ahora hay un solo botón, «Solicitar pruebas», que cambia según lo que haya hecho.
* Después de que la aplicación agregaba las pruebas faltantes, el botón seguía diciendo «Continuar sin pruebas». Ahora dice «Siguiente».

### Guardado de intentos en Supabase

El 22 de noviembre de 2026 se creó la tabla `clinical_case_attempts` con el script `supabase/clinical_case_attempts.sql` y se probó el guardado real de punta a punta:

* Sin iniciar sesión, Supabase rechaza guardar un intento por las reglas de seguridad (RLS), así que nadie puede escribir intentos ajenos.
* Con una cuenta, se resolvió un caso clínico completo: la aplicación mostró «Intento guardado en tu historial» y, al recargar la página, la tarjeta del caso apareció como «Completado» con su mejor puntaje y el número de intentos leídos desde la base de datos.
