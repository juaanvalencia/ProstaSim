import { Lightbulb, MessageSquareText } from "lucide-react";

export default function QuestionsStep({
  questions,
  answers,
  hintsUsed,
  patientName,
  explanation,
  locked,
  onAnswer,
  onHint,
  onExplain,
}) {
  return (
    <section className="cases-panel">
      <p className="cases-intro">
        Responde con base en los datos del paciente, las pruebas y el modelo 3D.
        Si te trabas, pide una pista: cada una descuenta un 25 % del valor de esa
        pregunta.
      </p>

      <div className="cases-questions">
        {questions.map((question, index) => {
          const used = hintsUsed[question.id] ?? 0;
          const canAskHint = !locked && used < question.hints.length;

          return (
            <fieldset key={question.id} className="cases-question">
              <legend>
                <span>Pregunta {index + 1}</span>
                {question.prompt}
              </legend>

              {question.options.map((option) => (
                <label
                  key={option.id}
                  className={`cases-option ${
                    answers[question.id] === option.id ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option.id}
                    checked={answers[question.id] === option.id}
                    disabled={locked}
                    onChange={() => onAnswer(question.id, option.id)}
                  />
                  <span>{option.text}</span>
                </label>
              ))}

              {used > 0 && (
                <ol className="cases-hints">
                  {question.hints.slice(0, used).map((hint) => (
                    <li key={hint}>
                      <Lightbulb size={14} />
                      <span>{hint}</span>
                    </li>
                  ))}
                </ol>
              )}

              {canAskHint && (
                <button
                  type="button"
                  className="cases-hint-button"
                  onClick={() => onHint(question.id)}
                >
                  <Lightbulb size={14} />
                  {used === 0 ? "Pedir una pista" : "Pedir otra pista"} (
                  {used + 1}/{question.hints.length}) · −25 %
                </button>
              )}
            </fieldset>
          );
        })}

        <div className="cases-question cases-explanation">
          <label htmlFor="patient-explanation">
            <span>
              <MessageSquareText size={14} /> Para terminar (opcional, no suma puntos)
            </span>
            Explícale a {patientName} con tus palabras qué tiene y qué sigue.
          </label>
          <textarea
            id="patient-explanation"
            rows={4}
            maxLength={1000}
            value={explanation}
            disabled={locked}
            placeholder="Usa un lenguaje sencillo, como si hablaras con el paciente en la consulta."
            onChange={(event) => onExplain(event.target.value)}
          />
          <small>{explanation.length}/1000</small>
        </div>
      </div>
    </section>
  );
}
