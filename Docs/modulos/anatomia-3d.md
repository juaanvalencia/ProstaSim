# Anatomía 3D

Muestra un modelo 3D de la pelvis masculina con nueve estructuras: próstata, nódulo patológico, vejiga, uretra, recto, vesículas seminales, testículos y epidídimo, conductos deferentes, y pene y glande.

## Qué puede hacer el estudiante

* Rotar el modelo arrastrando, acercarse con la rueda del mouse y desplazarlo con clic derecho.
* Saltar a una vista fija: frontal, sagital o posterior. «Reset» vuelve a la vista inicial, igual que hacer doble clic sobre el modelo.
* Tocar un órgano para resaltarlo y leer su descripción en el panel derecho.
* Ocultar o mostrar cada órgano desde la lista. «Solo próstata» deja únicamente la glándula y «Mostrar todo» devuelve el resto.
* Bajar la opacidad de las estructuras que rodean al órgano seleccionado, para ver lo que hay dentro, como la uretra atravesando la próstata.

## Archivos

| Archivo | Qué contiene |
| --- | --- |
| `public/models/prostata.glb` | El modelo 3D. Cada órgano es una malla con nombre propio (`Prostate`, `Bladder`…) |
| `anatomyData.js` | Nombre y descripción de cada órgano y posiciones de cámara |
| `AnatomyScene.jsx` | La escena: carga el modelo, aplica visibilidad y opacidad, y anima la cámara |
| `Anatomy3D.jsx` | La pantalla del módulo: lista de órganos, botones y panel de información |

`AnatomyScene.jsx` es reutilizable. Casos clínicos la usa con dos opciones que este módulo no necesita: `transforms`, para agrandar la próstata o mover el nódulo según el paciente, y `views`, para acercar la cámara.

## Limitaciones del modelo

Es un modelo estilizado y de poco detalle: la próstata tiene unos 2.500 vértices. Por eso sirve para entender dónde está cada órgano y cómo se relacionan, pero no para estudiar el detalle anatómico fino. Además, la próstata es una sola pieza, sin división en zonas, así que las zonas que se ven en Casos clínicos se dibujan aparte, por código.

Más adelante, una mejora posible sería generar el modelo a partir de resonancias reales. El dataset *Medical Segmentation Decathlon* (tarea Prostate) trae la glándula segmentada en zona periférica y zona de transición, con licencia CC-BY-SA.
