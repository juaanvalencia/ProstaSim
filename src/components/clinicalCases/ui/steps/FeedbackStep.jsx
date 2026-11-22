import {
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  MessageSquareText,
  Stethoscope,
  XCircle,
} from "lucide-react";

const saveMessages = {
  saving: "Guardando tu intento...",
  saved: "Intento guardado en tu historial.",
  error: "No fue posible guardar el intento. Tu retroalimentación sigue disponible.",
};

const EXPLANATION_RUBRIC = [
  "Claridad: dice qué tiene el paciente en una o dos frases.",
  "Sin tecnicismos: evita siglas y términos que el paciente no conoce.",
  "Próximo paso: explica qué se va a hacer y por qué.",
  "Empatía: reconoce la preocupación del paciente y le da tranquilidad.",
];

export default function FeedbackStep({
  clinicalCase,
  answers,
  explanation,
  result,
  saveStatus,
}) {
  const { questions } = clinicalCase;
  const { hits, missed, unnecessary } = result.tests;

  return (
    <section className="cases-panel">
      <div className="cases-score">
        <div className="cases-score-value">{result.score}%</div>
        <div>
          <h3>Resultado del caso</h3>
          <p className="cases-score-breakdown">
            Preguntas: {result.correct} de {result.total} ({result.questionsScore}%) ·
            Pruebas: {result.testsScore}%
            {result.hintsUsed > 0 &&
              ` · Pistas usadas: ${result.hintsUsed}`}
          </p>
          <p>{saveMessages[saveStatus]}</p>
        </div>
      </div>

      <div className="cases-block">
        <h3>Uso de pruebas</h3>
        <ul className="cases-test-review">
          {hits.map((test) => (
            <li key={test.id} className="correct">
              <CheckCircle2 size={16} />
              <span>
                <strong>{test.name}</strong> — {test.rationale}
              </span>
            </li>
          ))}
          {missed.map((test) => (
            <li key={test.id} className="wrong">
              <XCircle size={16} />
              <span>
                <strong>{test.name} (faltó solicitarla)</strong> — {test.rationale}
              </span>
            </li>
          ))}
          {unnecessary.map((test) => (
            <li key={test.id} className="warning">
              <AlertTriangle size={16} />
              <span>
                <strong>{test.name} (innecesaria)</strong> — {test.rationale}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="cases-review">
        {questions.map((question, index) => {
          const chosen = question.options.find(
            (option) => option.id === answers[question.id]
          );
          const correctOption = question.options.find(
            (option) => option.id === question.correctOptionId
          );
          const isCorrect = chosen?.id === correctOption.id;

          return (
            <div
              key={question.id}
              className={`cases-review-item ${isCorrect ? "correct" : "wrong"}`}
            >
              <div className="cases-review-title">
                {isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                <strong>
                  {index + 1}. {question.prompt}
                </strong>
              </div>

              <p>
                Tu respuesta: <em>{chosen?.text}</em>
              </p>
              {!isCorrect && (
                <p>
                  Respuesta correcta: <em>{correctOption.text}</em>
                </p>
              )}
              <p className="cases-review-feedback">{question.feedback}</p>
            </div>
          );
        })}
      </div>

      <div className="cases-block cases-analysis">
        <h3>
          <Stethoscope size={16} /> Análisis del caso
        </h3>
        <p>{clinicalCase.analysis}</p>
      </div>

      <div className="cases-block cases-explanation-review">
        <h3>
          <MessageSquareText size={16} /> Explicación al paciente
        </h3>

        <div className="cases-explanation-compare">
          <div>
            <span>Tu explicación</span>
            <p className={explanation ? "" : "cases-empty"}>
              {explanation || "No escribiste una explicación en este intento."}
            </p>
          </div>
          <div>
            <span>Explicación modelo</span>
            <p>{clinicalCase.patientExplanation}</p>
          </div>
        </div>

        <div className="cases-rubric">
          <span>Revisa tu explicación con estos 4 criterios</span>
          <ul>
            {EXPLANATION_RUBRIC.map((criterion) => (
              <li key={criterion}>{criterion}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="cases-key">
        <Lightbulb size={18} />
        <p>
          <strong>Para recordar:</strong> {clinicalCase.keyLearning}
        </p>
      </div>

      <div className="cases-sources">
        <span>Fuentes</span>
        <ul>
          {clinicalCase.sources.map((source) => (
            <li key={source}>{source}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
