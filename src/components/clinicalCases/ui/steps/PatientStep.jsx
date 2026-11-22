import { BookMarked, HeartPulse, User } from "lucide-react";

export default function PatientStep({ clinicalCase }) {
  const { patient } = clinicalCase;

  return (
    <section className="cases-panel">
      <div className="cases-reason">
        <span>Motivo de consulta</span>
        <p>“{clinicalCase.reason}”</p>
      </div>

      <div className="cases-block">
        <h3>
          <User size={16} /> Datos del paciente
        </h3>
        <dl className="cases-data">
          <div>
            <dt>Edad</dt>
            <dd>{patient.age} años</dd>
          </div>
          <div>
            <dt>Ocupación</dt>
            <dd>{patient.occupation}</dd>
          </div>
          {clinicalCase.vitals.map((vital) => (
            <div key={vital.label}>
              <dt>{vital.label}</dt>
              <dd>{vital.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="cases-block">
        <h3>
          <HeartPulse size={16} /> Síntomas
        </h3>
        <ul className="cases-list">
          {clinicalCase.symptoms.map((symptom) => (
            <li key={symptom}>{symptom}</li>
          ))}
        </ul>
      </div>

      <div className="cases-block">
        <h3>
          <BookMarked size={16} /> Antecedentes
        </h3>
        <ul className="cases-list">
          {clinicalCase.history.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="cases-goal">
        <strong>Objetivo del caso:</strong> {clinicalCase.learningGoal}
      </div>
    </section>
  );
}
