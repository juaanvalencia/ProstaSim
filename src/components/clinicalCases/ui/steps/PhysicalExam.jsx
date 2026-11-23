import { CheckCircle2, ClipboardCheck, Hand, Info, XCircle } from "lucide-react";

import { isPalpationComplete } from "../../logic/palpation";

export function PalpationReview({ graded }) {
  return (
    <ul className="cases-exam-review">
      {graded.findings.map((finding) => (
        <li key={finding.id} className={finding.correct ? "correct" : "wrong"}>
          {finding.correct ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          <span>
            <strong>{finding.label}:</strong> {finding.chosen ?? "Sin respuesta"}
            {!finding.correct && <em> · Correcto: {finding.answer}</em>}
            <small>{finding.why}</small>
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function PhysicalExam({
  palpation,
  stage,
  answers,
  graded,
  blocked,
  onStart,
  onAnswer,
  onSubmit,
}) {
  const complete = isPalpationComplete(palpation, answers);

  return (
    <div className="cases-block cases-exam">
      <h3>
        <Hand size={16} /> Examen físico · Tacto rectal
      </h3>

      {stage === "pending" && (
        <>
          <p className="cases-exam-instruction">{palpation.instruction}</p>
          <button type="button" className="cases-exam-start" onClick={onStart}>
            <Hand size={15} />
            Realizar el tacto
          </button>
        </>
      )}

      {stage === "form" && (
        <form
          className="cases-exam-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (complete) onSubmit();
          }}
        >
          <p className="cases-exam-instruction">Describe lo que palpaste.</p>

          {palpation.findings.map((finding) => (
            <fieldset key={finding.id} className="cases-exam-finding">
              <legend>{finding.label}</legend>
              <div className="cases-exam-options">
                {finding.options.map((option) => (
                  <label
                    key={option}
                    className={`cases-option ${answers[finding.id] === option ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name={`palpation-${finding.id}`}
                      value={option}
                      checked={answers[finding.id] === option}
                      onChange={() => onAnswer(finding.id, option)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}

          <button type="submit" className="cases-exam-start" disabled={!complete}>
            <ClipboardCheck size={15} />
            Registrar hallazgos
          </button>
        </form>
      )}

      {stage === "done" && graded && (
        <>
          <p className="cases-exam-instruction">
            Coincidiste en {graded.correct} de {graded.total} hallazgos. Este
            ejercicio no cambia tu resultado del caso.
          </p>
          <PalpationReview graded={graded} />
        </>
      )}

      {blocked && stage !== "done" && (
        <p className="cases-exam-alert" role="alert">
          <Info size={15} />
          Completa el tacto rectal y registra tus hallazgos antes de continuar.
        </p>
      )}
    </div>
  );
}
