import { FlaskConical, Info } from "lucide-react";

const statusLabels = {
  normal: "Normal",
  attention: "Atención",
  alert: "Alterado",
};

export default function TestsStep({
  tests,
  requestedIds,
  providedIds,
  selection,
  locked,
  onToggle,
}) {
  const visibleIds = new Set([...requestedIds, ...providedIds]);
  const available = tests.filter((test) => !visibleIds.has(test.id));
  const results = tests.filter((test) => visibleIds.has(test.id));

  return (
    <section className="cases-panel">
      <p className="cases-intro">
        Marca las pruebas que quieres pedir y presiona <strong>Solicitar pruebas</strong>.
        Pide solo las necesarias: las pruebas de más también cuentan en tu
        resultado, igual que en la práctica real.
      </p>

      {!locked && available.length > 0 && (
        <div className="cases-block">
          <h3>
            <FlaskConical size={16} /> Pruebas disponibles
          </h3>

          <div className="cases-test-options">
            {available.map((test) => (
              <label
                key={test.id}
                className={`cases-option ${selection.includes(test.id) ? "selected" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={selection.includes(test.id)}
                  onChange={() => onToggle(test.id)}
                />
                <span>
                  <strong>{test.name}</strong>
                  <small>{test.purpose}</small>
                </span>
              </label>
            ))}
          </div>

        </div>
      )}

      {providedIds.length > 0 && (
        <div className="cases-notice">
          <Info size={16} />
          <p>
            Faltaban pruebas necesarias para decidir. Se agregaron sus resultados
            para que puedas continuar, pero cuentan como no solicitadas.
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div className="cases-tests">
          {results.map((test) => (
            <div key={test.id} className={`cases-test ${test.status}`}>
              <div className="cases-test-header">
                <h3>{test.name}</h3>
                <span className={`cases-badge ${test.status}`}>
                  {statusLabels[test.status]}
                </span>
              </div>
              <strong>{test.value}</strong>
              <small>Referencia: {test.reference}</small>
              <p>{test.note}</p>
              {providedIds.includes(test.id) && (
                <span className="cases-provided">No solicitada</span>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
