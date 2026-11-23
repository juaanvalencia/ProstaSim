// Fictional educational case templates. Clinical criteria are based on published sources
// (see `sources` in each case) and must be reviewed by a health professional.
// To add a new case, append a template with the same shape; no code changes needed.
//
// Each template becomes a concrete case through buildCaseVariant() (logic/caseVariants.js):
// patient name, age, occupation, nodule side and answer order vary; clinical values,
// indicated tests and correct answers never do.
// Text tokens: {nombre} patient name, {lado} izquierda/derecha, {lado_m} izquierdo/derecho.
//
// tests[].indicated: whether ordering the test is appropriate for this patient.
// model.revealedBy: id of the test that reveals the finding on the 3D model.
// model.zone: prostate zone highlighted once revealed (see prostateZones.js).
// Model coordinates: +x is the patient's left, -z is posterior (towards the rectum).

export const caseTemplates = [
  {
    id: "ernesto-hpb",
    patient: {
      names: ["Don Ernesto", "Don Gustavo", "Don Hernando", "Don Fabio"],
      ageRange: [62, 72],
      occupations: ["Conductor pensionado", "Carpintero", "Agricultor"],
    },
    topic: "Hiperplasia prostática benigna",
    difficulty: "Básico",
    duration: "10 min",
    reason:
      "Consulta porque se levanta varias veces en la noche a orinar y siente que el chorro es débil.",
    learningGoal:
      "Reconocer los síntomas urinarios bajos de la HPB e interpretar la escala IPSS.",
    symptoms: [
      "Nicturia: se levanta 3 veces por noche a orinar.",
      "Chorro urinario débil e intermitente desde hace 1 año.",
      "Sensación de vaciamiento incompleto.",
      "Urgencia ocasional, sin dolor ni sangre en la orina.",
    ],
    history: [
      "Hipertensión arterial controlada.",
      "Sin antecedentes familiares de cáncer de próstata.",
      "No fuma. Consume café en la tarde.",
    ],
    vitals: [
      { label: "Presión arterial", value: "132/84 mmHg" },
      { label: "Temperatura", value: "36,6 °C" },
    ],
    model: {
      zone: "transition",
      revealedBy: "dre",
      prostateScale: 1.3,
      nodule: null,
      finding:
        "Próstata aumentada de tamaño de forma difusa, sin nódulos. El crecimiento de la zona de transición comprime la uretra.",
    },
    tests: [
      {
        id: "dre",
        name: "Tacto rectal",
        purpose: "Palpar tamaño, consistencia y superficie de la próstata.",
        indicated: true,
        rationale: "Es parte básica de la evaluación de síntomas urinarios bajos.",
        value: "Próstata aumentada de tamaño, lisa, elástica, sin nódulos",
        reference: "Superficie lisa, sin nódulos",
        status: "attention",
        note: "Aumento de tamaño sin hallazgos sospechosos.",
      },
      {
        id: "psa",
        name: "PSA total",
        purpose: "Proteína producida por la próstata; se mide en sangre.",
        indicated: true,
        rationale: "Ayuda a descartar sospecha de cáncer y estima el volumen prostático.",
        value: "2,8 ng/mL",
        reference: "Interpretar según edad y contexto",
        status: "normal",
        note: "Valor sin elevación relevante para su edad.",
      },
      {
        id: "ipss",
        name: "Cuestionario IPSS",
        purpose: "Puntaje de 0 a 35 que mide la intensidad de los síntomas urinarios.",
        indicated: true,
        rationale: "Cuantifica los síntomas y permite medir la respuesta al tratamiento.",
        value: "19 / 35",
        reference: "0-7 leve · 8-19 moderado · 20-35 severo",
        status: "attention",
        note: "Síntomas moderados en el límite superior.",
      },
      {
        id: "urinalysis",
        name: "Uroanálisis",
        purpose: "Examen de orina para buscar infección o sangre.",
        indicated: true,
        rationale: "Descarta infección o hematuria como causa de los síntomas.",
        value: "Sin leucocitos, sin nitritos, sin sangre",
        reference: "Negativo",
        status: "normal",
        note: "Descarta infección urinaria como causa.",
      },
      {
        id: "ultrasound",
        name: "Ecografía prostática",
        purpose: "Mide el volumen de la próstata y la orina que queda tras orinar.",
        indicated: true,
        rationale: "El volumen y el residuo posmiccional orientan el tratamiento.",
        value: "Volumen 55 mL · residuo posmiccional 80 mL",
        reference: "Volumen aproximado 20-30 mL",
        status: "attention",
        note: "Próstata agrandada con vaciamiento incompleto.",
      },
      {
        id: "mri",
        name: "Resonancia multiparamétrica",
        purpose: "Imagen detallada para buscar lesiones sospechosas de cáncer.",
        indicated: false,
        rationale:
          "No está indicada: no hay sospecha de cáncer (PSA sin elevación relevante y tacto sin nódulos).",
        value: "Próstata aumentada, sin lesiones sospechosas · PI-RADS 2",
        reference: "PI-RADS 1-2 baja probabilidad · 3 intermedia · 4-5 alta",
        status: "normal",
        note: "Hallazgos de crecimiento benigno.",
      },
      {
        id: "bone-scan",
        name: "Gammagrafía ósea",
        purpose: "Busca lesiones en los huesos.",
        indicated: false,
        rationale:
          "No está indicada: se usa para estadificar un cáncer ya confirmado de riesgo alto.",
        value: "Sin captaciones patológicas",
        reference: "Sin captaciones",
        status: "normal",
        note: "Estudio normal.",
      },
    ],
    questions: [
      {
        id: "q1",
        prompt: "¿Cuál es el diagnóstico más probable?",
        hints: [
          "Fíjate si hay signos de infección (fiebre, dolor) o de malignidad (nódulos, PSA muy alto).",
          "Síntomas urinarios progresivos con una próstata grande, lisa y elástica orientan a una causa benigna.",
        ],
        options: [
          { id: "a", text: "Hiperplasia prostática benigna" },
          { id: "b", text: "Prostatitis aguda" },
          { id: "c", text: "Cáncer de próstata localizado" },
          { id: "d", text: "Infección urinaria baja" },
        ],
        correctOptionId: "a",
        feedback:
          "Síntomas urinarios bajos progresivos, próstata aumentada lisa y elástica, PSA sin elevación relevante y uroanálisis negativo orientan a HPB. La ausencia de fiebre y dolor descarta prostatitis aguda.",
      },
      {
        id: "q2",
        prompt: "¿Cómo se interpreta un IPSS de 19 puntos?",
        hints: [
          "Revisa la referencia que trae el resultado del IPSS.",
          "El IPSS tiene tres rangos: 0-7, 8-19 y 20-35.",
        ],
        options: [
          { id: "a", text: "Síntomas leves" },
          { id: "b", text: "Síntomas moderados" },
          { id: "c", text: "Síntomas severos" },
          { id: "d", text: "El IPSS no aplica en este caso" },
        ],
        correctOptionId: "b",
        feedback:
          "El IPSS clasifica los síntomas en leves (0-7), moderados (8-19) y severos (20-35). Con 19 puntos el paciente está en el rango moderado, en su límite superior.",
      },
      {
        id: "q3",
        prompt: "¿Cuál es la conducta inicial más adecuada?",
        hints: [
          "¿Hay algún hallazgo que haga sospechar cáncer o una complicación urgente?",
          "Sin sospecha de cáncer ni complicaciones, se empieza por lo menos invasivo.",
        ],
        options: [
          {
            id: "a",
            text: "Medidas generales y tratamiento médico con seguimiento por urología",
          },
          { id: "b", text: "Biopsia de próstata inmediata" },
          { id: "c", text: "Cirugía prostática inmediata" },
          { id: "d", text: "No requiere ningún seguimiento" },
        ],
        correctOptionId: "a",
        feedback:
          "Con síntomas moderados que afectan su calidad de vida, sin hallazgos sospechosos de cáncer ni complicaciones, se inicia con medidas generales (por ejemplo, reducir líquidos y cafeína en la noche) y tratamiento médico, con seguimiento. La biopsia no está indicada sin sospecha de cáncer.",
      },
    ],
    analysis:
      "{nombre} presenta el cuadro típico de HPB: síntomas obstructivos e irritativos progresivos, próstata agrandada y lisa al tacto y PSA sin elevación relevante. El IPSS permite cuantificar los síntomas y hacer seguimiento a la respuesta al tratamiento. El residuo posmiccional elevado indica vaciamiento incompleto y justifica el seguimiento.",
    patientExplanation:
      "{nombre}, su próstata creció con los años, algo muy común a su edad. Ese crecimiento aprieta el conducto por donde sale la orina, y por eso se levanta de noche y el chorro es débil. Los exámenes no muestran señales de cáncer. Vamos a empezar con algunos cambios de hábitos y un medicamento, y lo revisaremos para ver cómo responde.",
    keyLearning:
      "No todo crecimiento prostático es cáncer: el tacto liso y el PSA sin elevación relevante orientan a una causa benigna.",
    sources: [
      "EAU Guidelines on Management of Non-neurogenic Male LUTS.",
      "International Prostate Symptom Score (IPSS).",
    ],
  },
  {
    id: "alberto-cancer",
    patient: {
      names: ["Don Alberto", "Don Ramiro", "Don Octavio", "Don Germán"],
      ageRange: [65, 72],
      occupations: ["Docente pensionado", "Abogado pensionado", "Comerciante"],
    },
    topic: "Cáncer de próstata",
    difficulty: "Intermedio",
    duration: "12 min",
    reason:
      "Asiste a su control anual. Se siente bien, pero su médico quiere revisar su próstata por sus antecedentes.",
    learningGoal:
      "Integrar tacto rectal, PSA y resonancia para decidir la conducta ante una lesión sospechosa.",
    symptoms: [
      "Asintomático desde el punto de vista urinario.",
      "Sin dolor óseo ni pérdida de peso.",
    ],
    history: [
      "Padre con diagnóstico de cáncer de próstata a los 70 años.",
      "Diabetes tipo 2 controlada.",
      "PSA de hace 2 años: 4,1 ng/mL.",
    ],
    vitals: [
      { label: "Presión arterial", value: "128/80 mmHg" },
      { label: "Temperatura", value: "36,5 °C" },
    ],
    model: {
      zone: "peripheral",
      revealedBy: "dre",
      prostateScale: 1,
      nodule: { scale: 1.6 },
      finding:
        "Nódulo en la zona periférica posterior {lado}. Por estar en la cara posterior, cerca del recto, se puede palpar en el tacto rectal.",
    },
    palpation: {
      instruction:
        "Toca el punto marcado en la cara posterior del modelo, la que se alcanza en el tacto rectal, y describe lo que palpas.",
      findings: [
        {
          id: "size",
          label: "Tamaño",
          options: ["Normal", "Aumentado"],
          answer: "Normal",
          why: "La glándula no está agrandada: el problema es un nódulo, no el volumen.",
        },
        {
          id: "consistency",
          label: "Consistencia",
          options: ["Elástica", "Dura"],
          answer: "Dura",
          why: "El nódulo es duro, pétreo; el tejido sano se siente elástico.",
        },
        {
          id: "surface",
          label: "Superficie",
          options: ["Lisa", "Irregular"],
          answer: "Irregular",
          why: "El nódulo duro e irregular está en la zona periférica, justo la que alcanza el dedo.",
        },
        {
          id: "location",
          label: "Ubicación del hallazgo",
          options: ["Lado izquierdo", "Lado derecho"],
          answer: "Lado {lado_m}",
          why: "El nódulo está en el lóbulo {lado_m}, en la cara posterior que da al recto.",
        },
      ],
    },
    tests: [
      {
        id: "dre",
        name: "Tacto rectal",
        purpose: "Palpar tamaño, consistencia y superficie de la próstata.",
        indicated: true,
        rationale: "Es el examen físico básico; en este paciente revela el hallazgo principal.",
        value: "Nódulo duro e irregular en el lóbulo {lado_m}",
        reference: "Superficie lisa, sin nódulos",
        status: "alert",
        note: "Hallazgo sospechoso de malignidad.",
      },
      {
        id: "psa",
        name: "PSA total",
        purpose: "Proteína producida por la próstata; se mide en sangre.",
        indicated: true,
        rationale: "Permite comparar con su control previo y estimar la sospecha.",
        value: "9,8 ng/mL",
        reference: "Interpretar según edad y contexto",
        status: "alert",
        note: "Elevado y en aumento respecto al control previo (4,1 ng/mL).",
      },
      {
        id: "mri",
        name: "Resonancia multiparamétrica",
        purpose: "Imagen detallada para buscar lesiones sospechosas de cáncer.",
        indicated: true,
        rationale: "Ante sospecha de cáncer, localiza la lesión y permite dirigir la biopsia.",
        value: "Lesión de 1,8 cm en zona periférica posterior {lado} · PI-RADS 5",
        reference: "PI-RADS 1-2 baja probabilidad · 3 intermedia · 4-5 alta",
        status: "alert",
        note: "Restricción marcada en difusión (DWI) y señal baja en el mapa ADC.",
      },
      {
        id: "ipss",
        name: "Cuestionario IPSS",
        purpose: "Puntaje de 0 a 35 que mide la intensidad de los síntomas urinarios.",
        indicated: false,
        rationale: "No aporta a la decisión: el paciente no tiene síntomas urinarios.",
        value: "3 / 35",
        reference: "0-7 leve · 8-19 moderado · 20-35 severo",
        status: "normal",
        note: "Síntomas leves.",
      },
      {
        id: "bone-scan",
        name: "Gammagrafía ósea",
        purpose: "Busca lesiones en los huesos.",
        indicated: false,
        rationale:
          "Todavía no: la estadificación se decide después de confirmar el cáncer con la biopsia y conocer su riesgo.",
        value: "Sin captaciones patológicas",
        reference: "Sin captaciones",
        status: "normal",
        note: "Estudio normal.",
      },
    ],
    questions: [
      {
        id: "q1",
        prompt: "¿Cuál es el hallazgo más relevante del examen físico?",
        hints: [
          "Piensa qué hallazgo del examen sería anormal en una próstata sana.",
          "Una próstata sana se siente lisa y elástica al tacto.",
        ],
        options: [
          { id: "a", text: "Nódulo duro e irregular al tacto rectal" },
          { id: "b", text: "Presión arterial normal" },
          { id: "c", text: "Ausencia de síntomas urinarios" },
          { id: "d", text: "Temperatura normal" },
        ],
        correctOptionId: "a",
        feedback:
          "Un nódulo duro e irregular al tacto rectal es sospechoso de malignidad, independientemente del valor del PSA y de que el paciente no tenga síntomas.",
      },
      {
        id: "q2",
        prompt: "¿Qué significa una lesión PI-RADS 5?",
        hints: [
          "PI-RADS es una escala de probabilidad de 1 a 5.",
          "Recuerda la diferencia entre sospechar un diagnóstico y confirmarlo.",
        ],
        options: [
          { id: "a", text: "Muy baja probabilidad de cáncer clínicamente significativo" },
          { id: "b", text: "Probabilidad intermedia, resultado indeterminado" },
          { id: "c", text: "Muy alta probabilidad de cáncer clínicamente significativo" },
          { id: "d", text: "Confirma el diagnóstico de cáncer" },
        ],
        correctOptionId: "c",
        feedback:
          "PI-RADS 5 indica una probabilidad muy alta de cáncer clínicamente significativo. Sin embargo, la resonancia no confirma el diagnóstico: la confirmación es histológica, mediante biopsia.",
      },
      {
        id: "q3",
        prompt: "¿Cuál es la conducta más adecuada?",
        hints: [
          "Con PI-RADS 5 y un nódulo palpable, ¿qué prueba confirma el diagnóstico?",
          "La confirmación del cáncer requiere una muestra de tejido.",
        ],
        options: [
          { id: "a", text: "Biopsia dirigida a la lesión" },
          { id: "b", text: "Repetir la resonancia en 6 meses" },
          { id: "c", text: "Vigilancia activa sin biopsia" },
          { id: "d", text: "Repetir solo el PSA en un año" },
        ],
        correctOptionId: "a",
        feedback:
          "Nódulo sospechoso, PSA elevado en aumento, antecedente familiar y PI-RADS 5: todo apunta a una biopsia dirigida. La vigilancia activa solo se considera después de confirmar un cáncer de bajo riesgo.",
      },
    ],
    analysis:
      "{nombre} reúne varios factores que aumentan la sospecha: edad, antecedente familiar de primer grado, PSA elevado y en aumento, nódulo duro al tacto y una lesión PI-RADS 5. La resonancia localiza la lesión y permite dirigir la biopsia, que es la prueba que confirma el diagnóstico.",
    patientExplanation:
      "{nombre}, en el examen encontramos una zona dura en la próstata, y la resonancia muestra una lesión que debemos estudiar. Esto no confirma que sea cáncer: para saberlo necesitamos tomar una pequeña muestra con una biopsia dirigida a esa zona. Con ese resultado decidiremos juntos el mejor tratamiento.",
    keyLearning:
      "La resonancia orienta y localiza; la biopsia confirma. Ante PI-RADS 4-5 la conducta indicada es la biopsia dirigida.",
    sources: [
      "Turkbey B, et al. PI-RADS v2.1. Eur Urol. 2019.",
      "Sánchez-Oro R, et al. Resonancia magnética de próstata: guía práctica. Radiología. 2020.",
      "EAU Guidelines on Prostate Cancer.",
    ],
  },
  {
    id: "jorge-cancer",
    patient: {
      names: ["Don Jorge", "Don Mauricio", "Don Andrés", "Don Camilo"],
      ageRange: [56, 64],
      occupations: ["Contador", "Ingeniero civil", "Administrador"],
    },
    topic: "Cáncer de próstata",
    difficulty: "Intermedio",
    duration: "12 min",
    reason:
      "Viene por resultados de exámenes de rutina. Se siente bien y no tiene molestias.",
    learningGoal:
      "Entender que un tacto rectal normal no descarta cáncer cuando el PSA y la resonancia son sospechosos.",
    symptoms: ["Asintomático.", "Sin cambios en el hábito urinario."],
    history: [
      "Sin antecedentes familiares conocidos.",
      "Dislipidemia en tratamiento.",
      "Primer control de PSA de su vida.",
    ],
    vitals: [
      { label: "Presión arterial", value: "124/78 mmHg" },
      { label: "Temperatura", value: "36,4 °C" },
    ],
    model: {
      zone: "peripheral",
      revealedBy: "mri",
      prostateScale: 1,
      nodule: { scale: 1.1 },
      finding:
        "Lesión pequeña en la zona periférica posterior {lado}. Por su tamaño no se palpa en el tacto rectal: solo la muestra la resonancia.",
    },
    palpation: {
      instruction:
        "Toca el punto marcado en la cara posterior del modelo, la que se alcanza en el tacto rectal, y describe lo que palpas.",
      findings: [
        {
          id: "size",
          label: "Tamaño",
          options: ["Normal", "Aumentado"],
          answer: "Normal",
          why: "La glándula tiene un tamaño normal para su edad.",
        },
        {
          id: "consistency",
          label: "Consistencia",
          options: ["Elástica", "Dura"],
          answer: "Elástica",
          why: "Se siente elástica, como el tejido prostático sano.",
        },
        {
          id: "surface",
          label: "Superficie",
          options: ["Lisa", "Irregular"],
          answer: "Lisa",
          why: "La superficie posterior es lisa, sin irregularidades.",
        },
        {
          id: "nodule",
          label: "¿Palpaste algún nódulo?",
          options: ["Sí", "No"],
          answer: "No",
          why: "La lesión mide 1,2 cm y no se alcanza con el dedo. Un tacto normal no descarta el cáncer.",
        },
      ],
    },
    tests: [
      {
        id: "psa",
        name: "PSA total (repetido)",
        purpose: "Proteína producida por la próstata; se mide en sangre.",
        indicated: true,
        rationale: "Un PSA elevado debe confirmarse con una segunda medición.",
        value: "7,2 ng/mL y 7,5 ng/mL",
        reference: "Interpretar según edad y contexto",
        status: "alert",
        note: "Elevación confirmada en dos mediciones.",
      },
      {
        id: "dre",
        name: "Tacto rectal",
        purpose: "Palpar tamaño, consistencia y superficie de la próstata.",
        indicated: true,
        rationale: "Es parte de la evaluación básica, aunque en este caso sea normal.",
        value: "Próstata de tamaño normal, lisa, sin nódulos",
        reference: "Superficie lisa, sin nódulos",
        status: "normal",
        note: "Sin hallazgos palpables.",
      },
      {
        id: "mri",
        name: "Resonancia multiparamétrica",
        purpose: "Imagen detallada para buscar lesiones sospechosas de cáncer.",
        indicated: true,
        rationale: "Con PSA elevado confirmado, es el siguiente paso antes de decidir una biopsia.",
        value: "Lesión de 1,2 cm en zona periférica posterior {lado} · PI-RADS 4",
        reference: "PI-RADS 1-2 baja probabilidad · 3 intermedia · 4-5 alta",
        status: "alert",
        note: "Lesión no palpable por su tamaño.",
      },
      {
        id: "psa-density",
        name: "Densidad de PSA",
        purpose: "Relaciona el PSA con el volumen de la próstata.",
        indicated: true,
        rationale: "Ayuda a saber si el PSA se explica por el tamaño de la glándula.",
        value: "0,18 ng/mL/cc",
        reference: "Mayor a 0,15 aumenta la sospecha",
        status: "alert",
        note: "Elevada para el volumen de la glándula.",
      },
      {
        id: "ct",
        name: "TAC abdominopélvico",
        purpose: "Tomografía para ver ganglios y órganos del abdomen.",
        indicated: false,
        rationale: "No está indicada para el diagnóstico; no muestra bien la próstata y expone a radiación.",
        value: "Sin adenopatías ni hallazgos relevantes",
        reference: "Sin hallazgos",
        status: "normal",
        note: "Estudio normal.",
      },
      {
        id: "bone-scan",
        name: "Gammagrafía ósea",
        purpose: "Busca lesiones en los huesos.",
        indicated: false,
        rationale: "No está indicada sin un diagnóstico confirmado de cáncer de riesgo alto.",
        value: "Sin captaciones patológicas",
        reference: "Sin captaciones",
        status: "normal",
        note: "Estudio normal.",
      },
    ],
    questions: [
      {
        id: "q1",
        prompt: "El tacto rectal es normal. ¿Qué se concluye?",
        hints: [
          "¿Qué parte de la próstata se alcanza a palpar en el tacto rectal?",
          "Una lesión pequeña puede no palparse aunque exista.",
        ],
        options: [
          { id: "a", text: "Se descarta el cáncer de próstata" },
          { id: "b", text: "No descarta el cáncer; hay que integrarlo con PSA e imagen" },
          { id: "c", text: "El PSA elevado debe ignorarse" },
          { id: "d", text: "Se debe repetir el tacto hasta encontrar un nódulo" },
        ],
        correctOptionId: "b",
        feedback:
          "El tacto rectal solo palpa la cara posterior de la glándula y no detecta lesiones pequeñas o anteriores. Un tacto normal no descarta cáncer cuando el PSA o la imagen son sospechosos.",
      },
      {
        id: "q2",
        prompt: "¿Qué dato aumenta la sospecha además del PSA total?",
        hints: [
          "Busca un dato que relacione el PSA con el tamaño de la próstata.",
          "Revisa la referencia de la densidad de PSA en las pruebas.",
        ],
        options: [
          { id: "a", text: "Presión arterial normal" },
          { id: "b", text: "Densidad de PSA de 0,18 ng/mL/cc" },
          { id: "c", text: "Antecedente de dislipidemia" },
          { id: "d", text: "Ser asintomático" },
        ],
        correctOptionId: "b",
        feedback:
          "La densidad de PSA relaciona el PSA con el volumen prostático. Valores mayores a 0,15 sugieren que el PSA no se explica solo por el tamaño de la glándula.",
      },
      {
        id: "q3",
        prompt: "¿Cuál es la conducta más adecuada?",
        hints: [
          "Integra todos los datos, no solo el tacto rectal.",
          "PI-RADS 4 indica alta probabilidad de cáncer clínicamente significativo.",
        ],
        options: [
          { id: "a", text: "Tranquilizar al paciente porque el tacto es normal" },
          { id: "b", text: "Biopsia dirigida a la lesión PI-RADS 4" },
          { id: "c", text: "Vigilancia activa sin biopsia" },
          { id: "d", text: "Repetir la resonancia en 6 meses" },
        ],
        correctOptionId: "b",
        feedback:
          "Con PSA elevado confirmado, densidad de PSA alta y una lesión PI-RADS 4, la conducta indicada es la biopsia dirigida, aunque el tacto sea normal.",
      },
    ],
    analysis:
      "{nombre} muestra por qué no se debe decidir con un solo examen. El tacto es normal porque la lesión es pequeña, pero el PSA elevado en dos mediciones, la densidad de PSA alta y la lesión PI-RADS 4 en resonancia justifican la biopsia dirigida.",
    patientExplanation:
      "{nombre}, aunque en el examen físico no se sintió nada, su PSA salió alto en dos ocasiones y la resonancia muestra una lesión pequeña. Por su tamaño no se alcanza a palpar. Para saber qué es, el siguiente paso es una biopsia dirigida a esa zona. Es un procedimiento corto y nos dará una respuesta clara.",
    keyLearning: "Un tacto rectal normal no descarta cáncer de próstata.",
    sources: [
      "Turkbey B, et al. PI-RADS v2.1. Eur Urol. 2019.",
      "EAU Guidelines on Prostate Cancer.",
    ],
  },
  {
    id: "luis-control",
    patient: {
      names: ["Don Luis", "Don Álvaro", "Don Rodrigo", "Don Iván"],
      ageRange: [52, 60],
      occupations: ["Comerciante", "Taxista", "Profesor de música"],
    },
    topic: "Cáncer de próstata (sospecha)",
    difficulty: "Avanzado",
    duration: "12 min",
    reason:
      "Le encontraron el PSA un poco alto en un chequeo y está preocupado por tener cáncer.",
    learningGoal:
      "Evitar biopsias innecesarias cuando la resonancia no muestra lesiones sospechosas.",
    symptoms: [
      "Chorro un poco más lento que antes.",
      "Sin dolor, fiebre ni sangre en la orina.",
    ],
    history: [
      "Sin antecedentes familiares de cáncer de próstata.",
      "Sin enfermedades crónicas.",
    ],
    vitals: [
      { label: "Presión arterial", value: "120/76 mmHg" },
      { label: "Temperatura", value: "36,5 °C" },
    ],
    model: {
      zone: "transition",
      revealedBy: "dre",
      prostateScale: 1.25,
      nodule: null,
      finding:
        "Próstata aumentada de tamaño, lisa y sin lesiones sospechosas. El crecimiento benigno explica el PSA levemente elevado.",
    },
    tests: [
      {
        id: "psa",
        name: "PSA total (repetido)",
        purpose: "Proteína producida por la próstata; se mide en sangre.",
        indicated: true,
        rationale: "Un PSA levemente elevado debe confirmarse antes de tomar decisiones.",
        value: "4,6 ng/mL y 4,3 ng/mL",
        reference: "Interpretar según edad y contexto",
        status: "attention",
        note: "Levemente elevado y estable.",
      },
      {
        id: "dre",
        name: "Tacto rectal",
        purpose: "Palpar tamaño, consistencia y superficie de la próstata.",
        indicated: true,
        rationale: "Es parte de la evaluación básica de un PSA elevado.",
        value: "Próstata aumentada, lisa, elástica, sin nódulos",
        reference: "Superficie lisa, sin nódulos",
        status: "attention",
        note: "Crecimiento compatible con HPB.",
      },
      {
        id: "mri",
        name: "Resonancia multiparamétrica",
        purpose: "Imagen detallada para buscar lesiones sospechosas de cáncer.",
        indicated: true,
        rationale: "Con PSA elevado, permite decidir si la biopsia es necesaria.",
        value: "Sin lesiones sospechosas · PI-RADS 2",
        reference: "PI-RADS 1-2 baja probabilidad · 3 intermedia · 4-5 alta",
        status: "normal",
        note: "Cambios de crecimiento benigno en la zona de transición.",
      },
      {
        id: "psa-density",
        name: "Densidad de PSA",
        purpose: "Relaciona el PSA con el volumen de la próstata.",
        indicated: true,
        rationale: "Ayuda a saber si el PSA se explica por el tamaño de la glándula.",
        value: "0,08 ng/mL/cc (volumen 60 mL)",
        reference: "Mayor a 0,15 aumenta la sospecha",
        status: "normal",
        note: "El PSA se explica por el tamaño de la glándula.",
      },
      {
        id: "ct",
        name: "TAC abdominopélvico",
        purpose: "Tomografía para ver ganglios y órganos del abdomen.",
        indicated: false,
        rationale: "No está indicada: no aporta al diagnóstico y expone a radiación.",
        value: "Sin hallazgos relevantes",
        reference: "Sin hallazgos",
        status: "normal",
        note: "Estudio normal.",
      },
      {
        id: "bone-scan",
        name: "Gammagrafía ósea",
        purpose: "Busca lesiones en los huesos.",
        indicated: false,
        rationale: "No está indicada: no hay diagnóstico de cáncer.",
        value: "Sin captaciones patológicas",
        reference: "Sin captaciones",
        status: "normal",
        note: "Estudio normal.",
      },
    ],
    questions: [
      {
        id: "q1",
        prompt: "¿Qué explica mejor el PSA levemente elevado de {nombre}?",
        hints: [
          "Compara el PSA con el tamaño de la próstata.",
          "Una densidad de PSA baja indica que el PSA se explica por el volumen de la glándula.",
        ],
        options: [
          { id: "a", text: "Un cáncer de próstata avanzado" },
          { id: "b", text: "El aumento de tamaño de la glándula" },
          { id: "c", text: "Un error de laboratorio" },
          { id: "d", text: "Una infección urinaria activa" },
        ],
        correctOptionId: "b",
        feedback:
          "La densidad de PSA es baja (0,08): el PSA se explica por el volumen prostático de 60 mL. Una próstata agrandada produce más PSA sin que exista cáncer.",
      },
      {
        id: "q2",
        prompt: "¿Qué significa una resonancia PI-RADS 2?",
        hints: [
          "PI-RADS va de 1 (muy baja) a 5 (muy alta probabilidad).",
          "Una probabilidad baja no es lo mismo que descartar por completo.",
        ],
        options: [
          { id: "a", text: "Baja probabilidad de cáncer clínicamente significativo" },
          { id: "b", text: "Alta probabilidad de cáncer" },
          { id: "c", text: "Confirma que no hay cáncer" },
          { id: "d", text: "El estudio no es válido" },
        ],
        correctOptionId: "a",
        feedback:
          "PI-RADS 2 indica baja probabilidad de cáncer clínicamente significativo. No lo descarta por completo, por eso se mantiene el seguimiento.",
      },
      {
        id: "q3",
        prompt: "¿Cuál es la conducta más adecuada?",
        hints: [
          "Compara los riesgos de una biopsia con su beneficio en este paciente.",
          "Con baja probabilidad de cáncer y PSA estable, el seguimiento es razonable.",
        ],
        options: [
          { id: "a", text: "Biopsia inmediata para tranquilizar al paciente" },
          { id: "b", text: "No hacer biopsia y continuar control con PSA" },
          { id: "c", text: "Cirugía prostática" },
          { id: "d", text: "Suspender todo seguimiento" },
        ],
        correctOptionId: "b",
        feedback:
          "Con PI-RADS 2, densidad de PSA baja y PSA estable, se puede evitar la biopsia y continuar el seguimiento. Una biopsia innecesaria expone al paciente a riesgos como sangrado e infección.",
      },
    ],
    analysis:
      "{nombre} tiene un PSA levemente elevado que se explica por el tamaño de su próstata. La densidad de PSA baja y la resonancia PI-RADS 2 permiten evitar una biopsia innecesaria y continuar el control. Explicarle esto al paciente ayuda a reducir su ansiedad.",
    patientExplanation:
      "{nombre}, entiendo su preocupación. Su PSA está un poco alto porque su próstata es grande, no porque haya cáncer: la resonancia no muestra lesiones sospechosas. Por eso no es necesario hacer una biopsia ahora. Vamos a controlar el PSA periódicamente, y si algo cambia, lo estudiaremos.",
    keyLearning:
      "Un PSA elevado no siempre significa cáncer: la resonancia y la densidad de PSA ayudan a no pedir biopsias de más.",
    sources: [
      "Turkbey B, et al. PI-RADS v2.1. Eur Urol. 2019.",
      "EAU Guidelines on Prostate Cancer.",
    ],
  },
  {
    id: "prostatitis-aguda",
    patient: {
      names: ["Don Raúl", "Don Felipe", "Don Óscar", "Don Javier"],
      ageRange: [42, 56],
      occupations: ["Mensajero en moto", "Vendedor", "Técnico electricista"],
    },
    topic: "Prostatitis bacteriana aguda",
    difficulty: "Intermedio",
    duration: "12 min",
    reason:
      "Llega con fiebre desde ayer, ardor al orinar y dolor entre los testículos y el ano. Ayer en urgencias le midieron el PSA y salió alto.",
    learningGoal:
      "Reconocer que un PSA elevado durante una infección no indica cáncer y no justifica una biopsia.",
    symptoms: [
      "Fiebre de 38,9 °C con escalofríos.",
      "Ardor al orinar y ganas de orinar muy seguidas.",
      "Dolor en el periné (entre los testículos y el ano).",
      "Malestar general desde hace 2 días.",
    ],
    history: [
      "Sin enfermedades crónicas.",
      "Sin antecedentes familiares de cáncer de próstata.",
      "PSA tomado ayer en urgencias: 18 ng/mL. Nunca se lo había medido.",
    ],
    vitals: [
      { label: "Presión arterial", value: "118/72 mmHg" },
      { label: "Temperatura", value: "38,9 °C" },
      { label: "Frecuencia cardiaca", value: "104 lpm" },
    ],
    model: {
      zone: null,
      revealedBy: "dre",
      prostateScale: 1.15,
      nodule: null,
      finding:
        "Próstata inflamada de forma difusa: aumentada, caliente y muy dolorosa. No hay un nódulo: toda la glándula está comprometida por la infección.",
    },
    palpation: {
      instruction:
        "Toca el punto marcado en la cara posterior del modelo, la que se alcanza en el tacto rectal, y describe lo que palpas.",
      findings: [
        {
          id: "size",
          label: "Tamaño",
          options: ["Normal", "Aumentado"],
          answer: "Aumentado",
          why: "La inflamación agranda toda la glándula de forma difusa.",
        },
        {
          id: "pain",
          label: "Dolor al tacto",
          options: ["No duele", "Muy doloroso"],
          answer: "Muy doloroso",
          why: "La próstata inflamada es muy sensible; incluso un tacto suave causa dolor intenso.",
        },
        {
          id: "temperature",
          label: "Temperatura",
          options: ["Normal", "Caliente"],
          answer: "Caliente",
          why: "La infección aguda aumenta el flujo de sangre y la glándula se siente caliente.",
        },
        {
          id: "maneuver",
          label: "Maniobra correcta",
          options: ["Palpación suave", "Masaje prostático"],
          answer: "Palpación suave",
          why: "El masaje prostático está contraindicado: puede diseminar la infección a la sangre.",
        },
      ],
    },
    tests: [
      {
        id: "dre",
        name: "Tacto rectal (suave)",
        purpose: "Palpar tamaño, consistencia y sensibilidad de la próstata.",
        indicated: true,
        rationale:
          "Confirma la inflamación. Debe ser suave: el masaje prostático está contraindicado porque puede diseminar la infección.",
        value: "Próstata aumentada, caliente, muy dolorosa al tacto",
        reference: "Superficie lisa, no dolorosa",
        status: "alert",
        note: "Hallazgo típico de prostatitis aguda.",
      },
      {
        id: "urinalysis",
        name: "Uroanálisis",
        purpose: "Examen de orina para buscar infección o sangre.",
        indicated: true,
        rationale: "Confirma rápidamente la infección urinaria.",
        value: "Leucocitos abundantes, nitritos positivos",
        reference: "Negativo",
        status: "alert",
        note: "Compatible con infección bacteriana.",
      },
      {
        id: "urine-culture",
        name: "Urocultivo",
        purpose: "Identifica la bacteria y a qué antibióticos responde.",
        indicated: true,
        rationale: "Permite ajustar el antibiótico a la bacteria responsable.",
        value: "Escherichia coli > 100.000 UFC/mL",
        reference: "Sin crecimiento",
        status: "alert",
        note: "Germen más frecuente en esta infección.",
      },
      {
        id: "blood-count",
        name: "Hemograma",
        purpose: "Cuenta glóbulos blancos y rojos en sangre.",
        indicated: true,
        rationale: "Evalúa la respuesta inflamatoria en un paciente con fiebre.",
        value: "Leucocitos 15.800/mm³ con neutrofilia",
        reference: "4.500 - 11.000/mm³",
        status: "alert",
        note: "Leucocitosis por la infección.",
      },
      {
        id: "psa",
        name: "PSA total (repetirlo ahora)",
        purpose: "Proteína producida por la próstata; se mide en sangre.",
        indicated: false,
        rationale:
          "No aporta durante la infección: la inflamación eleva el PSA. Se repite varias semanas después de terminar el tratamiento.",
        value: "17,4 ng/mL",
        reference: "Interpretar según edad y contexto",
        status: "alert",
        note: "Sigue elevado por la inflamación activa.",
      },
      {
        id: "mri",
        name: "Resonancia multiparamétrica",
        purpose: "Imagen detallada para buscar lesiones sospechosas de cáncer.",
        indicated: false,
        rationale:
          "No está indicada: la inflamación altera la imagen y no hay sospecha de cáncer que estudiar ahora.",
        value: "Señal alterada difusa por inflamación, sin lesión focal",
        reference: "PI-RADS 1-2 baja probabilidad · 3 intermedia · 4-5 alta",
        status: "attention",
        note: "Estudio difícil de interpretar durante la infección.",
      },
      {
        id: "ultrasound",
        name: "Ecografía transrectal",
        purpose: "Imagen de la próstata a través del recto.",
        indicated: false,
        rationale:
          "No de entrada: se reserva para buscar un absceso si el paciente no mejora con el antibiótico.",
        value: "Próstata aumentada, sin colecciones",
        reference: "Sin colecciones",
        status: "attention",
        note: "Sin absceso.",
      },
    ],
    questions: [
      {
        id: "q1",
        prompt: "¿Cuál es el diagnóstico más probable?",
        hints: [
          "Fíjate en la fiebre y en cómo se siente la próstata al tacto.",
          "Revisa el uroanálisis y el urocultivo.",
        ],
        options: [
          { id: "a", text: "Prostatitis bacteriana aguda" },
          { id: "b", text: "Cáncer de próstata avanzado" },
          { id: "c", text: "Hiperplasia prostática benigna" },
          { id: "d", text: "Cálculo en el riñón" },
        ],
        correctOptionId: "a",
        feedback:
          "Fiebre, síntomas urinarios, dolor perineal, próstata caliente y muy dolorosa, y orina con signos de infección: es el cuadro típico de prostatitis bacteriana aguda.",
      },
      {
        id: "q2",
        prompt: "¿Qué se debe hacer con el PSA de 18 ng/mL?",
        hints: [
          "¿Qué le pasa al PSA cuando la próstata está inflamada?",
          "El PSA se interpreta cuando la inflamación ya pasó.",
        ],
        options: [
          { id: "a", text: "Pedir una biopsia urgente por sospecha de cáncer" },
          {
            id: "b",
            text: "Repetirlo varias semanas después de terminar el tratamiento",
          },
          { id: "c", text: "Pedir una resonancia de inmediato" },
          { id: "d", text: "Olvidarlo: el PSA no sirve en este paciente" },
        ],
        correctOptionId: "b",
        feedback:
          "La inflamación de la próstata eleva el PSA aunque no haya cáncer. Por eso no se interpreta durante la infección: se repite varias semanas después del tratamiento. Si sigue elevado, ahí sí se estudia.",
      },
      {
        id: "q3",
        prompt: "¿Cuál es la conducta más adecuada?",
        hints: [
          "Primero hay que tratar la causa de la fiebre.",
          "Hay maniobras que pueden diseminar la infección y deben evitarse.",
        ],
        options: [
          {
            id: "a",
            text: "Antibiótico ajustado al urocultivo, hidratación y control de la evolución",
          },
          { id: "b", text: "Masaje prostático para obtener una muestra" },
          { id: "c", text: "Biopsia de próstata" },
          { id: "d", text: "Solo analgésicos y esperar" },
        ],
        correctOptionId: "a",
        feedback:
          "El tratamiento es antibiótico, guiado por el urocultivo, con medidas generales y control. El masaje prostático está contraindicado y la biopsia, además de innecesaria, es riesgosa con la glándula infectada.",
      },
    ],
    analysis:
      "{nombre} tiene una prostatitis bacteriana aguda: fiebre, síntomas urinarios, dolor perineal y una próstata caliente y muy dolorosa, con orina y hemograma que confirman la infección. El PSA de 18 ng/mL no indica cáncer: la inflamación lo eleva. Pedir una biopsia o una resonancia en este momento sería un error. Se trata la infección y el PSA se controla después.",
    patientExplanation:
      "{nombre}, tiene una infección en la próstata, y eso explica la fiebre y el dolor. La infección también hace que el PSA suba, así que ese resultado no significa que tenga cáncer. Vamos a tratarlo con antibiótico según el resultado del cultivo. Cuando termine el tratamiento repetiremos el PSA para confirmar que volvió a la normalidad.",
    keyLearning:
      "Un PSA alto durante una infección no significa cáncer: se trata la infección y el PSA se repite después.",
    sources: [
      "EAU Guidelines on Urological Infections (bacterial prostatitis).",
      "EAU Guidelines on Prostate Cancer (factores que elevan el PSA).",
    ],
  },
  {
    id: "pirads3-indeterminado",
    patient: {
      names: ["Don Mario", "Don Eduardo", "Don Guillermo", "Don Arturo"],
      ageRange: [60, 68],
      occupations: ["Arquitecto", "Panadero", "Funcionario público"],
    },
    topic: "Cáncer de próstata (resultado indeterminado)",
    difficulty: "Avanzado",
    duration: "15 min",
    reason:
      "Su médico le pidió una resonancia porque el PSA salió alto en dos controles. Viene a conocer el resultado.",
    learningGoal:
      "Decidir ante una resonancia PI-RADS 3 usando la densidad de PSA, cuando la imagen sola no basta.",
    symptoms: ["Asintomático.", "Sin cambios en el hábito urinario."],
    history: [
      "Sin antecedentes familiares de cáncer de próstata.",
      "Hipertensión arterial controlada.",
      "PSA de hace 1 año: 4,8 ng/mL.",
    ],
    vitals: [
      { label: "Presión arterial", value: "130/82 mmHg" },
      { label: "Temperatura", value: "36,5 °C" },
    ],
    model: {
      zone: "peripheral",
      revealedBy: "mri",
      prostateScale: 0.9,
      nodule: { scale: 0.8 },
      finding:
        "Lesión pequeña de aspecto dudoso en la zona periférica posterior {lado}. La resonancia no permite decir si es sospechosa o no.",
    },
    tests: [
      {
        id: "psa",
        name: "PSA total (repetido)",
        purpose: "Proteína producida por la próstata; se mide en sangre.",
        indicated: true,
        rationale: "Confirma la elevación y permite calcular la densidad de PSA.",
        value: "6,1 ng/mL y 5,9 ng/mL",
        reference: "Interpretar según edad y contexto",
        status: "attention",
        note: "Elevado y en aumento respecto al año anterior.",
      },
      {
        id: "dre",
        name: "Tacto rectal",
        purpose: "Palpar tamaño, consistencia y superficie de la próstata.",
        indicated: true,
        rationale: "Es parte de la evaluación básica de un PSA elevado.",
        value: "Próstata pequeña, lisa, sin nódulos",
        reference: "Superficie lisa, sin nódulos",
        status: "normal",
        note: "Sin hallazgos palpables.",
      },
      {
        id: "mri",
        name: "Resonancia multiparamétrica",
        purpose: "Imagen detallada para buscar lesiones sospechosas de cáncer.",
        indicated: true,
        rationale: "Con PSA elevado confirmado, es el estudio que orienta la decisión.",
        value: "Lesión de 0,9 cm en zona periférica posterior {lado} · PI-RADS 3 · volumen 29 mL",
        reference: "PI-RADS 1-2 baja probabilidad · 3 intermedia · 4-5 alta",
        status: "attention",
        note: "Resultado indeterminado: la imagen sola no define la conducta.",
      },
      {
        id: "psa-density",
        name: "Densidad de PSA",
        purpose: "Relaciona el PSA con el volumen de la próstata.",
        indicated: true,
        rationale: "En un PI-RADS 3 es el dato que más ayuda a decidir si hacer biopsia.",
        value: "0,21 ng/mL/cc",
        reference: "Menor a 0,15 baja sospecha · mayor a 0,20 alta sospecha",
        status: "alert",
        note: "Alta para una próstata pequeña.",
      },
      {
        id: "ct",
        name: "TAC abdominopélvico",
        purpose: "Tomografía para ver ganglios y órganos del abdomen.",
        indicated: false,
        rationale: "No está indicada para el diagnóstico; no muestra bien la próstata y expone a radiación.",
        value: "Sin hallazgos relevantes",
        reference: "Sin hallazgos",
        status: "normal",
        note: "Estudio normal.",
      },
      {
        id: "bone-scan",
        name: "Gammagrafía ósea",
        purpose: "Busca lesiones en los huesos.",
        indicated: false,
        rationale: "No está indicada sin un diagnóstico confirmado de cáncer de riesgo alto.",
        value: "Sin captaciones patológicas",
        reference: "Sin captaciones",
        status: "normal",
        note: "Estudio normal.",
      },
    ],
    questions: [
      {
        id: "q1",
        prompt: "¿Qué significa una lesión PI-RADS 3?",
        hints: [
          "PI-RADS 3 está justo en la mitad de la escala.",
          "Un resultado intermedio no permite decidir solo con la imagen.",
        ],
        options: [
          { id: "a", text: "Que no hay cáncer" },
          {
            id: "b",
            text: "Probabilidad intermedia: la imagen no permite decidir sola",
          },
          { id: "c", text: "Cáncer confirmado" },
          { id: "d", text: "Que la resonancia quedó mal hecha" },
        ],
        correctOptionId: "b",
        feedback:
          "PI-RADS 3 es un resultado equívoco: la presencia de cáncer clínicamente significativo es incierta. Por eso hay que apoyarse en otros datos para decidir.",
      },
      {
        id: "q2",
        prompt: "¿Qué dato ayuda más a decidir en este caso?",
        hints: [
          "Busca el dato que relaciona el PSA con el volumen de la próstata.",
          "Revisa la referencia de la densidad de PSA: menor a 0,15 y mayor a 0,20.",
        ],
        options: [
          { id: "a", text: "La densidad de PSA de 0,21 ng/mL/cc" },
          { id: "b", text: "La presión arterial" },
          { id: "c", text: "Que el paciente no tiene síntomas" },
          { id: "d", text: "El tacto rectal normal" },
        ],
        correctOptionId: "a",
        feedback:
          "En lesiones PI-RADS 3, la densidad de PSA permite separar a quienes pueden evitar la biopsia (valores bajos, menores a 0,15) de quienes tienen mayor riesgo (valores altos, mayores a 0,20).",
      },
      {
        id: "q3",
        prompt: "¿Cuál es la conducta más adecuada?",
        hints: [
          "¿La densidad de PSA de este paciente es baja o alta?",
          "Con PI-RADS 3 y densidad mayor a 0,20, el riesgo justifica confirmar con tejido.",
        ],
        options: [
          { id: "a", text: "Biopsia dirigida a la lesión" },
          { id: "b", text: "Alta sin seguimiento" },
          { id: "c", text: "Gammagrafía ósea para estadificar" },
          { id: "d", text: "Repetir solo el PSA en dos años" },
        ],
        correctOptionId: "a",
        feedback:
          "Con un PI-RADS 3 y una densidad de PSA alta (0,21), el riesgo es suficiente para indicar biopsia dirigida. Si la densidad hubiera sido baja, el seguimiento con PSA y nueva resonancia sería una opción razonable.",
      },
    ],
    analysis:
      "{nombre} tiene una lesión PI-RADS 3, el resultado más difícil de manejar: la resonancia no dice si es sospechosa o no. Aquí la decisión la define la densidad de PSA: con 0,21 ng/mL/cc en una próstata pequeña, el PSA no se explica por el tamaño de la glándula y se indica la biopsia dirigida.",
    patientExplanation:
      "{nombre}, la resonancia muestra una zona pequeña que no podemos clasificar con seguridad: no es claramente benigna ni claramente sospechosa. Al comparar su PSA con el tamaño de su próstata, el valor sale alto. Por eso le recomiendo una biopsia dirigida a esa zona, para salir de la duda y decidir con información segura.",
    keyLearning:
      "Ante un PI-RADS 3, no decidas solo con la imagen: la densidad de PSA ayuda a definir si hacer biopsia o seguimiento.",
    sources: [
      "Turkbey B, et al. PI-RADS v2.1. Eur Urol. 2019.",
      "EAU Guidelines on Prostate Cancer (biopsia en PI-RADS 3 según densidad de PSA).",
    ],
  },
];
