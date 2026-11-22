# Aprendizaje

Es la parte teórica del simulador y, por eso, conviene recorrerla antes de los casos. Tiene seis unidades que se recorren en orden, cada una con una duración estimada de lectura:

| # | Unidad | Duración |
| --- | --- | --- |
| 1 | Introducción a la próstata | 10 minutos |
| 2 | Anatomía y ubicación | 15 minutos |
| 3 | Funciones de la próstata | 12 minutos |
| 4 | Patologías prostáticas | 18 minutos |
| 5 | Cáncer de próstata | 20 minutos |
| 6 | Detección y diagnóstico | 15 minutos |

Al abrir una unidad se ven sus secciones; por ejemplo, la unidad 4 trata la hiperplasia prostática benigna, la prostatitis y el cáncer de próstata. Al final, todas incluyen un aviso de que el contenido es educativo.

## Cómo agregar o editar una unidad

El contenido está en `src/components/learning/data/learningTopics.js`. Cada unidad tiene esta forma:

```js
{
  id: 7,
  title: "Tratamientos",
  subtitle: "Opciones según el diagnóstico",
  icon: Pill,            // ícono de lucide-react
  duration: "15 minutos",
  content: [
    { heading: "Vigilancia activa", text: "..." },
  ],
}
```

Si usas un ícono nuevo, impórtalo al comienzo del mismo archivo. En cambio, el componente `Learning.jsx` no hay que tocarlo.
