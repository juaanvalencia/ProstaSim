# Casos clínicos

El estudiante atiende pacientes ficticios: lee la consulta, decide qué pruebas pedir, ve los hallazgos sobre el modelo 3D, responde preguntas y al final compara sus decisiones con las de un experto.

## Los casos

Hay seis y cada uno enseña una decisión distinta.

| Caso | Dificultad | Qué enseña |
| --- | --- | --- |
| Hiperplasia prostática benigna | Básico | No todo crecimiento de la próstata es cáncer. Interpretar el puntaje IPSS |
| Cáncer con nódulo palpable | Intermedio | La resonancia orienta y la biopsia confirma. Ante PI-RADS 4 o 5 se pide biopsia dirigida |
| Cáncer con tacto rectal normal | Intermedio | Un tacto normal no descarta cáncer si el PSA y la resonancia son sospechosos |
| PSA alto por próstata grande | Avanzado | La densidad de PSA y la resonancia evitan biopsias innecesarias |
| Prostatitis bacteriana aguda | Intermedio | Un PSA alto durante una infección no indica cáncer. Se trata la infección y el PSA se repite después |
| PI-RADS 3 indeterminado | Avanzado | Cuando la imagen no alcanza para decidir, la densidad de PSA define si hacer biopsia |

El criterio clínico sale de PI-RADS v2.1 (Turkbey y colaboradores, *European Urology*, 2019), de la guía práctica de resonancia de próstata de Sánchez-Oro y colaboradores (*Radiología*, 2020) y de las guías de la Asociación Europea de Urología sobre cáncer de próstata, síntomas urinarios e infecciones urológicas. Aun así, el contenido todavía tiene que revisarlo un profesional de la salud.

## Cómo se juega un caso

Un caso tiene cuatro pasos. El modelo 3D del paciente queda a la izquierda durante todo el recorrido.

**1. Paciente.** Motivo de consulta, edad, ocupación, signos vitales, síntomas y antecedentes.

**2. Pruebas.** El estudiante marca las que quiere pedir y presiona «Solicitar pruebas». Cada caso mezcla pruebas necesarias con otras que no corresponden; por ejemplo, una gammagrafía ósea antes de confirmar el cáncer. Los resultados traen su valor de referencia y una etiqueta: normal, atención o alterado. Si sigue adelante sin pedir alguna prueba necesaria, la aplicación muestra igual su resultado, para que pueda responder, pero la cuenta como no solicitada.

El modelo 3D muestra una próstata de referencia hasta que se pide la prueba que revela el hallazgo. Entonces aparece la lesión, o la próstata se agranda, y se resalta la zona afectada. En el cáncer con tacto normal el nódulo solo aparece con la resonancia, justamente porque no se palpa.

**3. Preguntas.** Tres preguntas de selección múltiple por caso. Cada una tiene dos pistas, de lo general a lo específico, y cada pista usada descuenta un 25 % del valor de esa pregunta. Al final hay un campo opcional para explicarle al paciente, con palabras sencillas, qué tiene y qué sigue.

**4. Retroalimentación.** El puntaje, qué pruebas estuvieron bien, cuáles faltaron y cuáles sobraron (cada una con su porqué), la explicación de cada respuesta, el análisis del caso, la explicación al paciente al lado de una explicación modelo, una rúbrica de cuatro criterios para revisarla y las fuentes.

## Cómo se calcula el puntaje

```
puntaje = 70 % preguntas + 30 % pruebas
```

En las preguntas, cada respuesta correcta vale 1, menos 0,25 por cada pista usada. En cambio, una respuesta incorrecta vale 0 aunque se hayan usado pistas.

En las pruebas, se suma 1 por cada prueba necesaria que se pidió y se resta 0,5 por cada prueba innecesaria. El resultado se divide por el número de pruebas necesarias y nunca baja de 0.

Por ejemplo: todas las preguntas bien, sin pistas, pidiendo las 3 pruebas necesarias más 1 innecesaria. Las pruebas dan (3 − 0,5) / 3 = 83 %, y el total, 0,7 × 100 + 0,3 × 83 = 95 %.

La explicación al paciente no suma puntos por ahora. Se guarda con el intento para que más adelante la califique el Tutor IA.

## Pacientes distintos en cada intento

Los casos son plantillas. Cada vez que se abre uno, la aplicación genera un paciente a partir de una semilla aleatoria: cambian el nombre, la edad (dentro de un rango coherente con el caso), la ocupación, el lado del nódulo y el orden de las opciones. Sin embargo, los valores clínicos, las pruebas necesarias y las respuestas correctas no cambian nunca.

La semilla se guarda con cada intento, de modo que con ella se puede reconstruir exactamente el paciente que vio el estudiante, lo que sirve para revisar un reporte de error.

## Cómo agregar un caso

Basta con agregar una plantilla al final de `src/components/clinicalCases/data/casesData.js`. No hay que modificar ningún componente: el visor, el puntaje y las variantes se aplican solos.

```js
{
  id: "nombre-del-caso",
  patient: {
    names: ["Don Mario", "Don Eduardo"],   // se elige uno al azar
    ageRange: [60, 68],
    occupations: ["Arquitecto", "Panadero"],
  },
  topic: "Cáncer de próstata",
  difficulty: "Intermedio",
  duration: "12 min",
  reason: "Motivo de consulta",
  learningGoal: "Qué debe aprender el estudiante",
  symptoms: ["..."],
  history: ["..."],
  vitals: [{ label: "Presión arterial", value: "130/82 mmHg" }],
  model: {
    zone: "peripheral",        // zona que se resalta: peripheral, transition, central o null
    revealedBy: "mri",         // id de la prueba que revela el hallazgo
    prostateScale: 1,          // 1.3 = próstata agrandada
    nodule: { scale: 1.2 },    // o null si no hay nódulo
    finding: "Texto que se muestra al revelar el hallazgo",
  },
  tests: [
    {
      id: "mri",
      name: "Resonancia multiparamétrica",
      purpose: "Para qué sirve, en una línea",
      indicated: true,         // ¿corresponde pedirla en este caso?
      rationale: "Por qué sí o por qué no",
      value: "Resultado",
      reference: "Valor de referencia",
      status: "alert",         // normal, attention o alert
      note: "Interpretación breve",
    },
  ],
  questions: [
    {
      id: "q1",
      prompt: "Pregunta",
      hints: ["Pista general", "Pista más específica"],
      options: [{ id: "a", text: "..." }, { id: "b", text: "..." }],
      correctOptionId: "a",
      feedback: "Por qué esa es la respuesta",
    },
  ],
  analysis: "Análisis del caso",
  patientExplanation: "{nombre}, ...",
  keyLearning: "La idea que debe quedar",
  sources: ["Referencia bibliográfica"],
}
```

En los textos se pueden usar tres marcadores que se reemplazan al generar el paciente: `{nombre}` (por ejemplo «Don Mario»), `{lado}` («izquierda» o «derecha») y `{lado_m}` («izquierdo» o «derecho»). Si el caso tiene nódulo, los textos que mencionan su ubicación deben usar `{lado}` o `{lado_m}`, para que coincidan con lo que muestra el modelo.

## Las zonas de la próstata

Como el modelo 3D no viene dividido en zonas, el módulo las dibuja encima: la zona periférica es una capa en la cara posterior, hacia el recto; la de transición, un anillo alrededor de la uretra; y la central, una cuña en la base. Por lo tanto, son esquemáticas y no salen de una segmentación real. Están definidas en `data/prostateZones.js` y se dibujan en `ui/ProstateZones.jsx`.

## Archivos del módulo

| Capa | Archivo | Qué hace |
| --- | --- | --- |
| Presentación | `ui/ClinicalCases.jsx` | Lista de casos. Genera los pacientes y guarda los intentos |
| | `ui/CaseSession.jsx` | Controla los cuatro pasos y el estado del intento |
| | `ui/steps/*.jsx` | Cada paso: paciente, pruebas, preguntas y retroalimentación |
| | `ui/CaseModelViewer.jsx` | Visor 3D del caso, con vistas, transparencia y zonas |
| Lógica | `logic/scoring.js` | Cálculo del puntaje |
| | `logic/caseVariants.js` | Generación del paciente a partir de la plantilla y la semilla |
| Datos | `data/casesData.js` | Las seis plantillas de casos |
| | `data/prostateZones.js` | Forma, color y descripción de cada zona |
| Integración | `src/services/clinicalCasesService.js` | Guarda y consulta intentos en Supabase |
