
import { useState } from "react";
import { BookOpen, ChevronRight, Clock } from "lucide-react";

import { learningTopics } from "./data/learningTopics";
import "./Learning.css";


export default function Learning() {
  const [selectedTopic, setSelectedTopic] = useState(null);

  const currentTopic = learningTopics.find(
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
            {learningTopics.map((topic, index) => {
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