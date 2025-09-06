const questions = [
    {
        text: "¿Por qué elegiste estudiar ADSO?",
        type: "textarea",
        placeholder: "Explica las razones que te motivaron a elegir Análisis y Desarrollo de Software..."
    },
    {
        text: "¿Te gustaría trabajar en desarrollo de software en el futuro?",
        type: "radio",
        options: ["Sí", "No", "Tal vez"]
    },
    {
        text: "¿Ya has tenido experiencias previas con programación?",
        type: "radio",
        options: ["Sí", "No", "Tal vez"]
    },
    {
        text: "¿Qué tanto disfrutas resolver problemas o retos lógicos?",
        type: "select",
        options: [
            "Me encanta, es lo que más disfruto",
            "Me gusta bastante",
            "Me gusta moderadamente",
            "No me gusta mucho",
            "No me gusta para nada"
        ]
    },
    {
        text: "¿Lees o investigas sobre tecnología por cuenta propia?",
        type: "radio",
        options: ["Sí", "No", "Tal vez"]
    },
    {
        text: "¿Tienes metas claras relacionadas con tu formación en ADSO?",
        type: "textarea",
        placeholder: "Describe qué metas específicas tienes con esta formación y cómo planeas alcanzarlas..."
    },
    {
        text: "¿Con quién vives actualmente?",
        type: "select",
        options: [
            "Con mis padres/familia completa",
            "Solo con mi madre",
            "Solo con mi padre", 
            "Con otros familiares (abuelos, tíos, etc.)",
            "Con mi pareja",
            "Vivo solo/a",
            "Con amigos/compañeros",
            "Otro"
        ]
    },
    {
        text: "¿Tus padres/familiares apoyan tu decisión de estudiar ADSO?",
        type: "radio",
        options: ["Sí", "No", "Tal vez"]
    },
    {
        text: "¿Tus familiares entienden la importancia de la formación técnica/profesional?",
        type: "radio",
        options: ["Sí", "No", "Tal vez"]
    },
    {
        text: "¿Cuentas con alguien cercano que pueda motivarte si piensas abandonar?",
        type: "radio",
        options: ["Sí", "No", "Tal vez"]
    },
    {
        text: "¿Tus amigos o entorno social valoran el estudio como una prioridad?",
        type: "radio",
        options: ["Sí", "No", "Tal vez"]
    },
    {
        text: "¿Actualmente trabajas?",
        type: "radio",
        options: ["Sí", "No", "Tal vez"]
    },
    {
        text: "Si trabajas, ¿cuántas horas a la semana dedicas al trabajo?",
        type: "select",
        options: [
            "No trabajo",
            "Menos de 20 horas",
            "Entre 20-30 horas",
            "Entre 30-40 horas",
            "Más de 40 horas"
        ]
    },
    {
        text: "¿Tus ingresos o los de tu familia cubren tus necesidades básicas (transporte, alimentación, materiales)?",
        type: "radio",
        options: ["Sí", "No", "Tal vez"]
    },
    {
        text: "¿El trabajo que realizas interfiere con tus estudios?",
        type: "radio",
        options: ["Sí", "No", "Tal vez"]
    },
    {
        text: "¿Dependes económicamente de alguien más para poder estudiar?",
        type: "radio",
        options: ["Sí", "No", "Tal vez"]
    },
    {
        text: "¿Has tenido que abandonar estudios anteriores por motivos económicos?",
        type: "radio",
        options: ["Sí", "No", "Tal vez"]
    },
    {
        text: "¿Cuántas horas al día puedes dedicar exclusivamente al estudio fuera de clase?",
        type: "select",
        options: [
            "Menos de 1 hora",
            "1-2 horas",
            "2-3 horas",
            "3-4 horas",
            "Más de 4 horas"
        ]
    },
    {
        text: "¿Tienes un espacio tranquilo y adecuado en casa para estudiar?",
        type: "radio",
        options: ["Sí", "No", "Tal vez"]
    },
    {
        text: "¿Sueles organizar tus horarios para cumplir con las actividades académicas?",
        type: "radio",
        options: ["Sí", "No", "Tal vez"]
    },
    {
        text: "¿Qué tan fácil es para ti concentrarte durante varias horas seguidas?",
        type: "select",
        options: [
            "Muy fácil, puedo concentrarme por horas",
            "Bastante fácil",
            "Moderadamente fácil",
            "Difícil, me distraigo",
            "Muy difícil, no puedo concentrarme"
        ]
    },
    {
        text: "¿Usas herramientas o métodos de organización (agenda, apps, recordatorios)?",
        type: "radio",
        options: ["Sí", "No", "Tal vez"]
    },
    {
        text: "¿Estás dispuesto a sacrificar parte de tu tiempo libre para cumplir con el programa?",
        type: "radio",
        options: ["Sí", "No", "Tal vez"]
    },
    {
        text: "¿Qué tan seguro estás de terminar el programa ADSO?",
        type: "select",
        options: [
            "Completamente seguro/a",
            "Muy seguro/a",
            "Moderadamente seguro/a",
            "Poco seguro/a",
            "Nada seguro/a"
        ]
    },
    {
        text: "¿Qué harías si sientes que el programa es más difícil de lo que esperabas?",
        type: "textarea",
        placeholder: "Describe qué estrategias utilizarías para superar las dificultades académicas..."
    },
    {
        text: "¿Qué nivel de estrés manejas actualmente en tu vida?",
        type: "select",
        options: ["Bajo", "Medio-bajo", "Medio", "Medio-alto", "Alto"]
    },
    {
        text: "¿Sueles abandonar proyectos o compromisos cuando se vuelven difíciles?",
        type: "radio",
        options: ["Sí", "No", "Tal vez"]
    },
    {
        text: "¿Cómo manejas la frustración cuando algo no te sale a la primera?",
        type: "textarea",
        placeholder: "Describe cómo reaccionas y qué haces cuando enfrentas dificultades o fracasos..."
    },
    {
        text: "¿Te consideras una persona perseverante y constante?",
        type: "radio",
        options: ["Sí", "No", "Tal vez"]
    }
];

let currentQuestion = 0;
let answers = {};
let timeLeft = 30 * 60; // 30 minutos en segundos
let timerInterval;
let evaluationExpired = false;

function initializeInterview() {
    document.getElementById('total-questions').textContent = questions.length;
    generateQuestions();
    showQuestion(0);
    updateNavigation();
    startTimer();
    disableCopyPaste();
    preventNavigation();
}

function generateQuestions() {
    const container = document.getElementById('questions-container');
    container.innerHTML = '';

    questions.forEach((question, index) => {
        const questionCard = document.createElement('div');
        questionCard.className = 'question-card';
        questionCard.id = `question-${index}`;
        
        let inputHTML = '';
        
        switch(question.type) {
            case 'textarea':
                inputHTML = `
                    <textarea 
                        class="answer-input" 
                        id="answer-${index}"
                        placeholder="${question.placeholder}"
                        oninput="saveAnswer(${index}, this.value)"
                        onpaste="return false"
                        oncontextmenu="return false"
                    ></textarea>
                `;
                break;
                
            case 'select':
                inputHTML = `
                    <select 
                        class="select-input" 
                        id="answer-${index}"
                        onchange="saveAnswer(${index}, this.value)"
                    >
                        <option value="">-- Selecciona una opción --</option>
                        ${question.options.map(option => 
                            `<option value="${option}">${option}</option>`
                        ).join('')}
                    </select>
                `;
                break;
                
            case 'radio':
                inputHTML = `
                    <div class="radio-group">
                        ${question.options.map(option => `
                            <label class="radio-option">
                                <input 
                                    type="radio" 
                                    name="question-${index}" 
                                    value="${option}"
                                    onchange="saveAnswer(${index}, this.value); updateRadioStyles(${index})"
                                >
                                ${option}
                            </label>
                        `).join('')}
                    </div>
                `;
                break;
        }
        
        questionCard.innerHTML = `
            <div class="question-number">Pregunta ${index + 1}</div>
            <div class="question-text">${question.text}</div>
            ${inputHTML}
        `;
        
        container.appendChild(questionCard);
    });
}

function showQuestion(index) {
    document.querySelectorAll('.question-card').forEach(card => {
        card.classList.remove('active');
    });
    
    document.getElementById(`question-${index}`).classList.add('active');
    currentQuestion = index;
    
    document.getElementById('current-question').textContent = index + 1;
    updateProgressBar();
    updateNavigation();
}

function updateProgressBar() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.querySelector('.progress-fill').style.width = progress + '%';
}

function updateNavigation() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const finishBtn = document.getElementById('finish-btn');

    // Habilitar/deshabilitar botón anterior normalmente
    prevBtn.disabled = currentQuestion === 0;
    
    if (currentQuestion === questions.length - 1) {
        nextBtn.style.display = 'none';
        finishBtn.style.display = 'inline-block';
    } else {
        nextBtn.style.display = 'inline-block';
        finishBtn.style.display = 'none';
    }
}

function saveAnswer(questionIndex, value) {
    answers[questionIndex] = value;
    const input = document.getElementById(`answer-${questionIndex}`);
    
    if (value && value.trim()) {
        input.classList.add('filled');
    } else {
        input.classList.remove('filled');
    }
}

function updateRadioStyles(questionIndex) {
    const radioOptions = document.querySelectorAll(`input[name="question-${questionIndex}"]`);
    radioOptions.forEach(radio => {
        const label = radio.closest('.radio-option');
        if (radio.checked) {
            label.classList.add('selected');
        } else {
            label.classList.remove('selected');
        }
    });
}

function nextQuestion() {
    if (evaluationExpired) return;
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

function finishInterview() {
    if (evaluationExpired) return;
    
    clearInterval(timerInterval);
    document.querySelector('.form-container').style.display = 'none';
    document.querySelector('.progress-container').style.display = 'none';
    document.getElementById('summary').classList.add('active');
    
    const answeredCount = Object.values(answers).filter(answer => answer && answer.toString().trim()).length;
    const completionPercentage = Math.round((answeredCount / questions.length) * 100);
    
    document.getElementById('answered-count').textContent = answeredCount;
    document.getElementById('completion-percentage').textContent = completionPercentage;
}

function downloadAnswers() {
    const data = {
        fecha: new Date().toLocaleString('es-ES'),
        programa: 'ADSO - Análisis y Desarrollo de Software',
        evaluacion: 'EduRisk - Evaluación de Riesgo Educativo',
        duracion_completada: formatTime(30 * 60 - timeLeft),
        respuestas: questions.map((question, index) => ({
            numero: index + 1,
            pregunta: question.text,
            tipo: question.type,
            respuesta: answers[index] || 'Sin respuesta'
        }))
    };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `evaluacion_adso_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function restartInterview() {
    if (evaluationExpired) return; // Solo deshabilitar reinicio si expiró
    
    currentQuestion = 0;
    answers = {};
    
    // Limpiar textarea
    document.querySelectorAll('.answer-input').forEach(input => {
        input.value = '';
        input.classList.remove('filled');
    });
    
    // Limpiar selects
    document.querySelectorAll('.select-input').forEach(select => {
        select.selectedIndex = 0;
        select.classList.remove('filled');
    });
    
    // Limpiar radios
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
        radio.closest('.radio-option').classList.remove('selected');
    });
    
    document.getElementById('summary').classList.remove('active');
    document.querySelector('.form-container').style.display = 'block';
    document.querySelector('.progress-container').style.display = 'block';
    
    // Reiniciar timer
    timeLeft = 30 * 60;
    clearInterval(timerInterval);
    startTimer();
    
    showQuestion(0);
}

// Funciones de timer
function startTimer() {
    timerInterval = setInterval(function() {
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
    const timerElement = document.getElementById('timer');
    const timerContainer = document.querySelector('.timer-container');
    
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Cambiar colores según el tiempo restante
    if (timeLeft <= 300) { // 5 minutos
        timerContainer.classList.add('timer-critical');
        timerContainer.classList.remove('timer-warning');
    } else if (timeLeft <= 600) { // 10 minutos
        timerContainer.classList.add('timer-warning');
        timerContainer.classList.remove('timer-critical');
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function expireEvaluation() {
    evaluationExpired = true;
    clearInterval(timerInterval);
    
    // Ocultar todo el contenido
    document.querySelector('.header').style.display = 'none';
    document.querySelector('.progress-container').style.display = 'none';
    document.querySelector('.form-container').style.display = 'none';
    document.querySelector('#summary').style.display = 'none';
    
    // Mostrar página de expiración
    document.getElementById('expired-container').style.display = 'block';
    
    // Deshabilitar todas las funciones
    document.removeEventListener('keydown', handleKeyDown);
}

// Funciones de seguridad
function disableCopyPaste() {
    // Deshabilitar copiar/pegar con teclado
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'a')) {
            e.preventDefault();
            return false;
        }
    });
    
    // Deshabilitar menú contextual
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Deshabilitar selección de texto
    document.addEventListener('selectstart', function(e) {
        if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') {
            return true; // Permitir selección solo en campos de entrada
        }
        e.preventDefault();
        return false;
    });
}

function preventNavigation() {
    // Prevenir navegación del navegador
    window.addEventListener('beforeunload', function(e) {
        if (!evaluationExpired) {
            e.preventDefault();
            e.returnValue = '¿Está seguro de que desea salir? Se perderá su progreso.';
            return '¿Está seguro de que desea salir? Se perderá su progreso.';
        }
    });
    
    // Deshabilitar teclas de navegación del navegador
    document.addEventListener('keydown', function(e) {
        // Deshabilitar F5, Ctrl+R, Alt+F4, etc.
        if (e.key === 'F5' || 
            (e.ctrlKey && e.key === 'r') || 
            (e.altKey && e.key === 'F4') ||
            (e.ctrlKey && e.key === 'w')) {
            e.preventDefault();
            return false;
        }
    });
}

function handleKeyDown(e) {
    if (evaluationExpired) return;
    
    if (e.ctrlKey && e.key === 'ArrowRight') {
        nextQuestion();
    } else if (e.ctrlKey && e.key === 'ArrowLeft') {
        prevQuestion();
    }
}

// Event listeners
document.getElementById('prev-btn').addEventListener('click', prevQuestion);
document.getElementById('next-btn').addEventListener('click', nextQuestion);
document.getElementById('finish-btn').addEventListener('click', finishInterview);

// Navegación por teclado
document.addEventListener('keydown', handleKeyDown);

// Inicializar la evaluación cuando se carga la página
window.addEventListener('load', initializeInterview);