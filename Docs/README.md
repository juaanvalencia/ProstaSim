# Qué es PROSTA-SIM

PROSTA-SIM es una aplicación web para estudiar la próstata y sus enfermedades más frecuentes. En ella se puede leer la teoría, recorrer un modelo 3D de la pelvis masculina y practicar con casos clínicos ficticios en los que se toman decisiones y se recibe retroalimentación.

El proyecto nació en la asignatura Gestión de Proyectos TI, del programa de Ingeniería de Sistemas, y lo desarrollamos en equipo.

{% hint style="warning" %}
Es una herramienta educativa. Los pacientes son ficticios y la aplicación no diagnostica ni reemplaza la valoración de un profesional de la salud.
{% endhint %}

## Qué se puede hacer hoy

| Módulo | Para qué sirve | Estado |
| --- | --- | --- |
| Aprendizaje | Seis unidades de teoría, desde la anatomía hasta la detección | Disponible |
| Anatomía 3D | Rotar el modelo, ocultar órganos y ver la descripción de cada estructura | Disponible |
| Casos clínicos | Atender pacientes ficticios: pedir pruebas, responder y recibir retroalimentación | Disponible |
| Tutor IA | Resolver dudas sobre la próstata con un asistente | En desarrollo |
| Evaluaciones | Cuestionarios por unidad con calificación automática | En desarrollo |
| Mi progreso | Avance, calificaciones e historial del estudiante | En desarrollo |

## Con qué está hecha

La interfaz está hecha con React 19 y Vite. Para el modelo 3D usamos React Three Fiber (Three.js), mientras que Supabase se encarga del inicio de sesión y de la base de datos. El código está en [GitHub](https://github.com/juaanvalencia/ProstaSim).

## Por dónde empezar

Si vas a correr el proyecto en tu computador, empieza por [Primeros pasos](primeros-pasos.md). En cambio, si quieres entender cómo está organizado el código, lee [Arquitectura](arquitectura.md).
