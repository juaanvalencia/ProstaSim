# Pruebas

El proyecto combina pruebas automáticas, que se corren con un comando, y pruebas manuales de punta a punta en el navegador. Las automáticas cubren la lógica, mientras que las manuales comprueban lo que ve y hace el estudiante.

## Pruebas automáticas

Usamos [Vitest](https://vitest.dev), que se integra con Vite sin configuración extra. Para correrlas:

```bash
npm test
```

Si además quieres ver el nombre de cada prueba, usa:

```bash
npx vitest run --reporter=verbose
```

Cada línea con `✓` es una prueba que pasó; en cambio, una `×` indica una que falló, y debajo aparece qué se esperaba y qué salió. Al final se muestra el resumen, por ejemplo `Tests 63 passed (63)`.

### Qué se prueba

Las pruebas están junto al código que prueban, en `src/components/clinicalCases/logic/`.

`scoring.test.js` comprueba el cálculo del puntaje. Por ejemplo, verifica que una respuesta correcta con una pista valga 75 %, que una incorrecta valga 0 aunque se hayan pedido pistas y que las pruebas innecesarias resten.

`caseVariants.test.js` comprueba la generación de pacientes. Para eso genera 200 pacientes por cada plantilla y revisa que:

* la misma semilla produzca siempre el mismo paciente;
* la edad, el nombre y la ocupación queden dentro de lo que define la plantilla;
* los valores clínicos, las pruebas necesarias y las respuestas correctas no cambien nunca;
* no quede ningún marcador como `{nombre}` sin reemplazar ni aparezca el nombre de otro paciente;
* el lado del nódulo coincida entre el texto y la posición en el modelo 3D;
* cada pregunta tenga dos pistas y la explicación modelo esté dirigida al paciente generado;
* un intento perfecto dé 100 %, sin importar en qué orden salgan las opciones.

Estas pruebas recorren todas las plantillas automáticamente. Por eso, cuando se agrega un caso nuevo, queda cubierto sin escribir pruebas adicionales: con los seis casos actuales son 63.

### ¿Cómo sabemos que las pruebas sirven?

Una prueba que nunca falla no demuestra nada. Por eso, además de verlas pasar, dañamos el código a propósito y revisamos que fallen. Por ejemplo, al desactivar el reemplazo de marcadores fallaron cinco pruebas; luego, al restaurar el código, volvieron a pasar las 63.

## Pruebas manuales de punta a punta

Cada vez que cambia algo importante del módulo, recorremos los seis casos en el navegador por dos caminos.

En el camino correcto, el estudiante pide solo las pruebas necesarias y responde todo bien. Se espera que el hallazgo no aparezca en el modelo antes de pedir las pruebas, que después se resalte la zona correcta y que el puntaje sea 100 %.

En el camino incorrecto, en cambio, el estudiante sigue sin pedir pruebas y responde todo mal. Se espera que aparezca el aviso de pruebas faltantes, que se muestren exactamente las pruebas necesarias marcadas como «No solicitada», que el puntaje sea 0 % y que «Nuevo paciente» genere otra variante y vuelva al primer paso.

También revisamos la vista en celular (375 px de ancho), donde no debe haber desplazamiento horizontal en ningún paso, y que la consola del navegador no muestre errores.

### Última ejecución

El 22 de noviembre de 2026 los seis casos pasaron los dos caminos. Esa vez encontramos dos problemas, que quedaron corregidos:

* Al marcar pruebas, quedaban seleccionadas pero no solicitadas, y si el estudiante presionaba el botón principal se perdía la selección. Ahora hay un solo botón, «Solicitar pruebas», que cambia según lo que haya hecho.
* Después de que la aplicación agregaba las pruebas faltantes, el botón seguía diciendo «Continuar sin pruebas». Ahora dice «Siguiente».

### Pendiente

Todavía falta probar el guardado real de intentos, porque la tabla `clinical_case_attempts` aún no está creada en Supabase. Mientras tanto, la aplicación funciona igual: avisa que no pudo guardar el intento y muestra la retroalimentación completa.
