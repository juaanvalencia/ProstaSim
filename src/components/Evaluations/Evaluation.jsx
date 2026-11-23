import { useState } from "react";
import "./Evaluation.css";

const questions = [
  {
    question: "¿Cuál es el peso aproximado de una próstata sana en un hombre adulto?",
    options: ["20 gramos", "80 gramos", "150 gramos", "300 gramos"],
    answer: "20 gramos",
  },
  {
    question: "¿Cuál sustancia se utiliza como marcador para detectar alteraciones prostáticas?",
    options: ["PSA", "Insulina", "Hemoglobina", "Colágeno"],
    answer: "PSA",
  },
  {
    question: "¿Qué parte del sistema reproductor masculino rodea la próstata?",
    options: ["La uretra", "Los testículos", "El epidídimo", "El pene"],
    answer: "La uretra",
  },
  {
    question: "¿Cuál es la función principal del líquido prostático?",
    options: [
      "Nutrir y proteger los espermatozoides",
      "Transportar oxígeno",
      "Regular la temperatura corporal",
      "Producir hormonas",
    ],
    answer: "Nutrir y proteger los espermatozoides",
  },
  {
    question: "¿Qué enfermedad se caracteriza por el crecimiento no canceroso de la próstata?",
    options: [
      "Hiperplasia Prostática Benigna",
      "Prostatitis aguda",
      "Cáncer metastásico",
      "Insuficiencia renal",
    ],
    answer: "Hiperplasia Prostática Benigna",
  },
  {
    question: "¿Qué examen permite medir los niveles de PSA?",
    options: [
      "Análisis de sangre",
      "Radiografía",
      "Ecografía abdominal",
      "Tomografía cerebral",
    ],
    answer: "Análisis de sangre",
  },
  {
    question: "¿Cuál de los siguientes síntomas puede asociarse con problemas prostáticos?",
    options: [
      "Dificultad para orinar",
      "Pérdida de visión",
      "Dolor en los dientes",
      "Pérdida auditiva",
    ],
    answer: "Dificultad para orinar",
  },
  {
    question: "¿Qué examen físico es utilizado frecuentemente para evaluar la próstata?",
    options: [
      "Tacto rectal",
      "Electrocardiograma",
      "Audiometría",
      "Espirometría",
    ],
    answer: "Tacto rectal",
  },
  {
    question: "¿En qué rango de edad aumenta el riesgo de padecer cáncer de próstata?",
    options: [
      "Mayores de 50 años",
      "Menores de 10 años",
      "Entre 15 y 20 años",
      "Entre 20 y 30 años",
    ],
    answer: "Mayores de 50 años",
  },
  {
    question: "¿Cuál es la localización anatómica correcta de la próstata?",
    options: [
      "Debajo de la vejiga y delante del recto",
      "Dentro del hígado",
      "Detrás del corazón",
      "Debajo del estómago",
    ],
    answer: "Debajo de la vejiga y delante del recto",
  },
];

export default function Evaluation() {
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  const handleSelect = (questionIndex, option) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: option,
    }));
  };

  const [grade, setGrade] = useState(null);

   const calculateScore = () => {
  let correctAnswers = 0;

  questions.forEach((question, index) => {
    if (answers[index] === question.answer) {
      correctAnswers++;
    }
  });

  setScore(correctAnswers);

  const finalGrade = (
    1 + (correctAnswers / questions.length) * 4
  ).toFixed(1);

  setGrade(finalGrade);
};

  return (
    <div className="evaluation-container">
      <h2>Evaluación de Conocimientos</h2>

      {questions.map((question, index) => (
        <div key={index} className="question-card">
          <h3>
            {index + 1}. {question.question}
          </h3>

          {question.options.map((option, optionIndex) => (
            <label key={optionIndex} className="option">
              <input
                type="radio"
                name={`question-${index}`}
                value={option}
                checked={answers[index] === option}
                onChange={() => handleSelect(index, option)}
              />
              {option}
            </label>
          ))}
        </div>
      ))}

      
      <button
        className="evaluation-btn"
        onClick={calculateScore}
      >
        Finalizar Evaluación
      </button>
      {score !== null && (
        <div className="result">
          
          <h3>
            Resultado: {score} / {questions.length}
            </h3>
          <h3>
             Nota: {grade} / 5.0
             </h3>

          <p>
            {grade >= 3.0
              ? "✅ Aprobaste la evaluación."
              : "❌ Debes repasar el contenido del módulo de aprendizaje."}
          </p>
        </div>
      )}
    </div>
  );
}