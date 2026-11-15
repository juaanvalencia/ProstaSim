
import { useState } from "react";
import {
  BookOpen,
  Activity,
  HeartPulse,
  Microscope,
  ShieldCheck,
  ChevronRight,
  GraduationCap,
  Clock,
} from "lucide-react";

import "./Learning.css";

const topics = [
  {
    id: 1,
    title: "Introducción a la próstata",
    subtitle: "Conceptos fundamentales",
    icon: BookOpen,
    duration: "10 minutos",
    content: [
      {
        heading: "¿Qué es la próstata?",
        text: "La próstata es una glándula del aparato reproductor masculino. Se encuentra debajo de la vejiga urinaria y rodea la primera porción de la uretra.",
      },
      {
        heading: "¿Cuál es su función?",
        text: "Produce parte del líquido seminal, que contribuye a transportar y proteger los espermatozoides durante la reproducción.",
      },
      {
        heading: "Importancia de su estudio",
        text: "Conocer su anatomía y funcionamiento permite comprender las principales alteraciones que pueden afectar esta glándula.",
      },
    ],
  },
  {
    id: 2,
    title: "Anatomía y ubicación",
    subtitle: "Estructura anatómica",
    icon: Activity,
    duration: "15 minutos",
    content: [
      {
        heading: "Ubicación anatómica",
        text: "La próstata está situada en la pelvis masculina, debajo de la vejiga, delante del recto y alrededor de la uretra prostática.",
      },
      {
        heading: "Zonas prostáticas",
        text: "Se describen principalmente las zonas periférica, central y de transición, además del estroma fibromuscular anterior.",
      },
      {
        heading: "Relaciones anatómicas",
        text: "Su proximidad con la vejiga, la uretra, el recto y las estructuras neurovasculares es importante para comprender su evaluación y tratamiento.",
      },
    ],
  },
  {
    id: 3,
    title: "Funciones de la próstata",
    subtitle: "Fisiología prostática",
    icon: HeartPulse,
    duration: "12 minutos",
    content: [
      {
        heading: "Producción del líquido prostático",
        text: "La glándula produce una secreción que forma parte del semen y contiene sustancias que contribuyen a las condiciones necesarias para la función espermática.",
      },
      {
        heading: "Participación reproductiva",
        text: "Sus secreciones se incorporan al semen durante la eyaculación y participan en el entorno que facilita la función de los espermatozoides.",
      },
    ],
  },
  {
    id: 4,
    title: "Patologías prostáticas",
    subtitle: "Alteraciones frecuentes",
    icon: Microscope,
    duration: "18 minutos",
    content: [
      {
        heading: "Hiperplasia prostática benigna",
        text: "Es un crecimiento no canceroso del tejido prostático que puede comprimir la uretra y ocasionar síntomas urinarios.",
      },
      {
        heading: "Prostatitis",
        text: "Es la inflamación de la próstata. Puede relacionarse con infecciones u otras causas y presentarse de diferentes maneras.",
      },
      {
        heading: "Cáncer de próstata",
        text: "Es una enfermedad en la que células prostáticas presentan un crecimiento maligno. Su comportamiento y evolución pueden variar entre pacientes.",
      },
    ],
  },
  {
    id: 5,
    title: "Cáncer de próstata",
    subtitle: "Características y factores asociados",
    icon: ShieldCheck,
    duration: "20 minutos",
    content: [
      {
        heading: "Concepto",
        text: "El cáncer de próstata se origina cuando algunas células de la glándula desarrollan alteraciones que provocan un crecimiento descontrolado.",
      },
      {
        heading: "Factores asociados",
        text: "La edad, los antecedentes familiares y determinados factores genéticos se relacionan con el riesgo de desarrollar esta enfermedad.",
      },
      {
        heading: "Manifestaciones",
        text: "En etapas iniciales puede no producir síntomas. Cuando aparecen, las manifestaciones urinarias no son exclusivas del cáncer de próstata.",
      },
    ],
  },
  {
    id: 6,
    title: "Detección y diagnóstico",
    subtitle: "Evaluación clínica",
    icon: GraduationCap,
    duration: "15 minutos",
    content: [
      {
        heading: "Antígeno prostático específico",
        text: "El PSA es una proteína producida por la próstata que puede medirse mediante un análisis de sangre. Sus valores deben interpretarse en contexto clínico.",
      },
      {
        heading: "Tacto rectal",
        text: "Es una exploración física que permite valorar determinadas características de la próstata mediante el recto.",
      },
      {
        heading: "Estudios complementarios",
        text: "Según cada situación, la evaluación puede incluir resonancia magnética, biopsia y otros estudios indicados por profesionales de salud.",
      },
    ],
  },
];

export default function Learning() {
  const [selectedTopic, setSelectedTopic] = useState(null);

  const currentTopic = topics.find(
    (topic) => topic.id === selectedTopic
  );

  return (
    <section className="learning-container">
      <div className="learning-header">
        <span className="learning-eyebrow">CENTRO DE CONOCIMIENTO</span>
        <h2>Módulo de aprendizaje</h2>
        <p>
          Explora los fundamentos anatómicos, fisiológicos y
          patológicos de la próstata mediante unidades educativas.
        </p>
      </div>

      {!currentTopic ? (
        <>
          <div className="learning-summary">
            <div className="learning-summary-icon">
              <BookOpen size={25} />
            </div>
            <div>
              <strong>Ruta de aprendizaje</strong>
              <p>
                6 unidades educativas para fortalecer tus conocimientos.
              </p>
            </div>
          </div>

          <div className="learning-topics">
            {topics.map((topic, index) => {
              const Icon = topic.icon;

              return (
                <button
                  key={topic.id}
                  className="learning-topic"
                  onClick={() => setSelectedTopic(topic.id)}
                >
                  <div className="learning-topic-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="learning-topic-icon">
                    <Icon size={23} />
                  </div>

                  <div className="learning-topic-info">
                    <h3>{topic.title}</h3>
                    <p>{topic.subtitle}</p>
                    <span>
                      <Clock size={13} />
                      {topic.duration}
                    </span>
                  </div>

                  <ChevronRight
                    className="learning-topic-arrow"
                    size={20}
                  />
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <article className="learning-lesson">
          <button
            className="learning-back"
            onClick={() => setSelectedTopic(null)}
          >
            ← Volver a las unidades
          </button>

          <div className="learning-lesson-heading">
            <span>UNIDAD {String(currentTopic.id).padStart(2, "0")}</span>
            <h2>{currentTopic.title}</h2>
            <p>{currentTopic.subtitle}</p>
          </div>

          <div className="learning-lesson-content">
            {currentTopic.content.map((section, index) => (
              <section key={index}>
                <h3>{section.heading}</h3>
                <p>{section.text}</p>
              </section>
            ))}
          </div>

          <div className="learning-disclaimer">
            Contenido educativo. Esta información no sustituye
            una valoración ni una orientación médica profesional.
          </div>

          <button
            className="learning-complete"
            onClick={() => setSelectedTopic(null)}
          >
            Volver a las unidades
          </button>
        </article>
      )}
    </section>
  );
}