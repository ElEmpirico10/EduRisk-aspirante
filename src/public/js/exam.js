let questions = [];
let currentQuestion = 0;
let answers = {};
let timeLeft = 60 * 30; // tiempo de prueba
let timerInterval;
let evaluationExpired = false;

const regresarbtn = document.getElementById("regresar-btn");

regresarbtn.addEventListener("click", () => {
  window.location.href = "/auth/login";
});

async function loadQuestions() {
  try {
    const examStatus = localStorage.getItem("examStatus");

    if (examStatus === "finished") {
      document.querySelector(".form-container").style.display = "none";
      document.querySelector(".progress-container").style.display = "none";
      document.querySelector(".header").style.display = "none";
      document.getElementById("expired-container").style.display = "none";
      document.getElementById("summary").classList.add("active");

      // 🔥 Recuperar datos del resumen
      const answeredCount = localStorage.getItem("answeredCount") || 0;
      const totalQuestions = localStorage.getItem("totalQuestions") || 0;
      const completionPercentage =
        localStorage.getItem("completionPercentage") || 0;

      document.getElementById("answered-count").textContent = answeredCount;
      document.getElementById("total-questions-finished").textContent =
        totalQuestions;
      document.getElementById("completion-percentage").textContent =
        completionPercentage;

      return;
    }

    if (examStatus === "expired") {
      // ⏰ Mostrar pantalla de expirado
      document.querySelector(".form-container").style.display = "none";
      document.querySelector(".progress-container").style.display = "none";
      document.querySelector(".header").style.display = "none";
      document.getElementById("summary").style.display = "none";
      document.getElementById("expired-container").style.display = "block";
      return;
    }

    // ⚡ Si no está ni finalizado ni expirado -> cargar preguntas normalmente
    const id_aspirante = localStorage.getItem("id_aspirante");
    const response = await fetch(`/exam/getExam?id_aspirante=${id_aspirante}`);
    const data = await response.json();
    console.log(data);
    questions = data.preguntas;
    console.log(questions);
    initializeInterview();
  } catch (error) {
    console.error("Error cargando preguntas:", error);
    alert("No se pudieron cargar las preguntas.");
  }
}

function initializeInterview() {
  document.getElementById("total-questions").textContent = questions.length;
  generateQuestions();
  showQuestion(0);
  updateNavigation();
  startTimer();
  disableCopyPaste();
  preventNavigation();
}

function generateQuestions() {
  const container = document.getElementById("questions-container");
  container.innerHTML = "";

  questions.forEach((question, index) => {
    const questionCard = document.createElement("div");
    questionCard.className = "question-card";
    questionCard.id = `question-${index}`;

    let inputHTML = "";

    switch (question.tipo_pregunta) {
      case "textarea":
        inputHTML = `
          <textarea 
            class="answer-input" 
            id="answer-${index}"
            placeholder="${question.contenido || ""}"
            oninput="saveAnswer(${index}, this.value)"
            onpaste="return false"
            oncontextmenu="return false"
          ></textarea>
        `;
        break;

      case "select":
        let selectOptions = [];
        try {
          selectOptions = JSON.parse(question.contenido);
        } catch {
          selectOptions = [];
        }
        inputHTML = `
          <select 
            class="select-input" 
            id="answer-${index}"
            onchange="saveAnswer(${index}, this.value)"
          >
            <option value="">-- Selecciona una opción --</option>
            ${selectOptions
              .map((option) => `<option value="${option}">${option}</option>`)
              .join("")}
          </select>
        `;
        break;

      case "radio":
        let radioOptions = [];
        try {
          radioOptions = JSON.parse(question.contenido);
        } catch {
          radioOptions = [];
        }
        inputHTML = `
          <div class="radio-group">
            ${radioOptions
              .map(
                (option) => `
                <label class="radio-option">
                  <input 
                    type="radio" 
                    name="question-${index}" 
                    value="${option}"
                    onchange="saveAnswer(${index}, this.value); updateRadioStyles(${index})"
                  >
                  ${option}
                </label>
              `
              )
              .join("")}
          </div>
        `;
        break;
    }

    questionCard.innerHTML = `
      <div class="question-number">Pregunta ${index + 1}</div>
      <div class="question-text">${question.texto_pregunta}</div>
      ${inputHTML}
    `;

    container.appendChild(questionCard);
  });
}

function showQuestion(index) {
  document.querySelectorAll(".question-card").forEach((card) => {
    card.classList.remove("active");
  });

  document.getElementById(`question-${index}`).classList.add("active");
  currentQuestion = index;

  document.getElementById("current-question").textContent = index + 1;
  updateProgressBar();
  updateNavigation();
}

function updateProgressBar() {
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  document.querySelector(".progress-fill").style.width = progress + "%";
}

function updateNavigation() {
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const finishBtn = document.getElementById("finish-btn");

  prevBtn.disabled = currentQuestion === 0;

  if (currentQuestion === questions.length - 1) {
    nextBtn.style.display = "none";
    finishBtn.style.display = "inline-block";
  } else {
    nextBtn.style.display = "inline-block";
    finishBtn.style.display = "none";
  }
}

function saveAnswer(questionIndex, value) {
  answers[questionIndex] = value;
  const input = document.getElementById(`answer-${questionIndex}`);

  if (value && value.trim()) {
    if (input) input.classList.add("filled");
    if (input) input.classList.remove("error");
  } else {
    if (input) input.classList.remove("filled");
  }
}

async function sendAnswers() {
  const idAspirante = localStorage.getItem("id_aspirante");
  const idExamen = localStorage.getItem("id_examen");

  const respuestas = questions.map((q, index) => ({
    id_pregunta: q.id_pregunta,
    texto_respuesta: answers[index] || "",
  }));

  const payload = {
    id_aspirante: idAspirante,
    id_examen: idExamen,
    respuestas: respuestas,
  };

  try {
    const res = await fetch("/exam/saveAnswers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("Servidor respondió:", data);

    if (data.success) {
      showToast("✅ Respuestas guardadas correctamente", "green");
    } else {
      showToast("❌ Error al guardar: " + data.message, "red");
    }
  } catch (err) {
    console.error("Error al enviar respuestas:", err);
    showToast("⚠️ Error en la conexión con el servidor", "red");
  }
}

function updateRadioStyles(questionIndex) {
  const radioOptions = document.querySelectorAll(
    `input[name="question-${questionIndex}"]`
  );
  radioOptions.forEach((radio) => {
    const label = radio.closest(".radio-option");
    if (radio.checked) {
      label.classList.add("selected");
    } else {
      label.classList.remove("selected");
    }
  });
}

function nextQuestion() {
  if (evaluationExpired) return;

  const currentQ = questions[currentQuestion];

  // ⚠️ Validar respuesta vacía
  if (
    !answers[currentQuestion] ||
    answers[currentQuestion].toString().trim() === ""
  ) {
    showToast("⚠️ Debes llenar todos los campos", "orange");
    const input = document.getElementById(`answer-${currentQuestion}`);
    if (input) input.classList.add("error");
    return;
  }

  // ⚠️ Validar mínimo de 200 caracteres en preguntas abiertas (textarea)
  if (
    currentQ.tipo_pregunta === "textarea" &&
    answers[currentQuestion].trim().length < 200
  ) {
    showToast("⚠️ Tu respuesta debe tener mínimo 200 caracteres", "orange");
    const input = document.getElementById(`answer-${currentQuestion}`);
    if (input) input.classList.add("error");
    return;
  }

  if (currentQuestion < questions.length - 1) {
    showQuestion(currentQuestion + 1);
  }
}

function prevQuestion() {
  if (evaluationExpired) return;
  if (currentQuestion > 0) {
    showQuestion(currentQuestion - 1);
  }
}

async function finishInterview() {
  if (evaluationExpired) return;

  const unanswered = questions.filter((q, i) => {
    return (
      !answers[i] ||
      answers[i].toString().trim() === "" ||
      (q.tipo_pregunta === "textarea" && answers[i].trim().length < 200)
    ); // 🔍 validar longitud
  });

  if (unanswered.length > 0) {
    showToast(
      "⚠️ Debes responder todas las preguntas (mínimo 200 caracteres en abiertas)",
      "orange"
    );
    unanswered.forEach((i) => {
      const input = document.getElementById(`answer-${i}`);
      if (input) input.classList.add("error");
    });
    return;
  }

  await sendAnswers();

  clearInterval(timerInterval);
  document.querySelector(".form-container").style.display = "none";
  document.querySelector(".progress-container").style.display = "none";
  document.getElementById("summary").classList.add("active");

  const answeredCount = questions.filter((q, i) => {
    const ans = answers[i];
    return ans && ans.toString().trim() !== "";
  }).length;
  const completionPercentage = Math.round(
    (answeredCount / questions.length) * 100
  );

  document.getElementById("answered-count").textContent = answeredCount;
  document.getElementById("total-questions-finished").textContent =
    questions.length;
  document.getElementById("completion-percentage").textContent =
    completionPercentage;
  localStorage.setItem("examStatus", "finished");
  localStorage.setItem("examStatus", "finished");
  localStorage.setItem("answeredCount", answeredCount);
  localStorage.setItem("totalQuestions", questions.length);
  localStorage.setItem("completionPercentage", completionPercentage);
}

async function FinishedSesssion() {
  if (evaluationExpired) return;

  window.onbeforeunload = null;
  window.removeEventListener("beforeunload", () => {});

  await fetch("/auth/logout");
  window.location.href = "/auth/login";
}

function startTimer() {
  timerInterval = setInterval(function () {
    if (timeLeft <= 0) {
      expireEvaluation();
      return;
    }

    updateTimerDisplay();
    timeLeft--;
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerElement = document.getElementById("timer");
  const timerContainer = document.querySelector(".timer-container");

  timerElement.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  if (timeLeft <= 300) {
    timerContainer.classList.add("timer-critical");
    timerContainer.classList.remove("timer-warning");
  } else if (timeLeft <= 600) {
    timerContainer.classList.add("timer-warning");
    timerContainer.classList.remove("timer-critical");
  }
}

async function expireEvaluation() {
  evaluationExpired = true;
  clearInterval(timerInterval);

  document.querySelector(".header").style.display = "none";
  document.querySelector(".progress-container").style.display = "none";
  document.querySelector(".form-container").style.display = "none";
  document.querySelector("#summary").style.display = "none";

  document.getElementById("expired-container").style.display = "block";
  document.removeEventListener("keydown", handleKeyDown);
  localStorage.setItem("examStatus", "expired");
}

function disableCopyPaste() {
  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && ["c", "v", "x", "a"].includes(e.key)) {
      e.preventDefault();
      return false;
    }
  });

  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    return false;
  });

  document.addEventListener("selectstart", function (e) {
    if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") {
      return true;
    }
    e.preventDefault();
    return false;
  });
}

function preventNavigation() {
  document.addEventListener("keydown", function (e) {
    if (
      e.key === "F5" ||
      (e.ctrlKey && e.key === "r") ||
      (e.altKey && e.key === "F4") ||
      (e.ctrlKey && e.key === "w")
    ) {
      e.preventDefault();
      return false;
    }
  });
}

function handleKeyDown(e) {
  if (evaluationExpired) return;

  if (e.ctrlKey && e.key === "ArrowRight") {
    nextQuestion();
  } else if (e.ctrlKey && e.key === "ArrowLeft") {
    prevQuestion();
  }
}

// 📌 Event Listeners
document.getElementById("prev-btn").addEventListener("click", prevQuestion);
document.getElementById("next-btn").addEventListener("click", nextQuestion);
document
  .getElementById("finish-btn")
  .addEventListener("click", finishInterview);
document.addEventListener("keydown", handleKeyDown);

// 🚀 Iniciar
window.addEventListener("load", loadQuestions);
