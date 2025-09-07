
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
        if (input) input.classList.add('filled');
        if (input) input.classList.remove('error');
    } else {
        if (input) input.classList.remove('filled');
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

    if (!answers[currentQuestion] || answers[currentQuestion].toString().trim() === '') {
        alert("⚠️ Debes responder esta pregunta antes de continuar.");
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

function finishInterview() {
    if (evaluationExpired) return;

    const unanswered = questions.filter((_, i) => {
        return !answers[i] || answers[i].toString().trim() === '';
    });

    if (unanswered.length > 0) {
        alert("⚠️ Debes responder todas las preguntas antes de finalizar.");
        unanswered.forEach(i => {
            const input = document.getElementById(`answer-${i}`);
            if (input) input.classList.add("error");
        });
        return;
    }

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
    if (evaluationExpired) return;
    
    currentQuestion = 0;
    answers = {};
    
    document.querySelectorAll('.answer-input').forEach(input => {
        input.value = '';
        input.classList.remove('filled', 'error');
    });
    
    document.querySelectorAll('.select-input').forEach(select => {
        select.selectedIndex = 0;
        select.classList.remove('filled', 'error');
    });
    
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
        radio.closest('.radio-option').classList.remove('selected');
    });
    
    document.getElementById('summary').classList.remove('active');
    document.querySelector('.form-container').style.display = 'block';
    document.querySelector('.progress-container').style.display = 'block';
    
    timeLeft = 30 * 60;
    clearInterval(timerInterval);
    startTimer();
    
    showQuestion(0);
}

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
    
    if (timeLeft <= 300) {
        timerContainer.classList.add('timer-critical');
        timerContainer.classList.remove('timer-warning');
    } else if (timeLeft <= 600) {
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
    
    document.querySelector('.header').style.display = 'none';
    document.querySelector('.progress-container').style.display = 'none';
    document.querySelector('.form-container').style.display = 'none';
    document.querySelector('#summary').style.display = 'none';
    
    document.getElementById('expired-container').style.display = 'block';
    document.removeEventListener('keydown', handleKeyDown);
}

function disableCopyPaste() {
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'a')) {
            e.preventDefault();
            return false;
        }
    });
    
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    document.addEventListener('selectstart', function(e) {
        if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') {
            return true;
        }
        e.preventDefault();
        return false;
    });
}

function preventNavigation() {
    window.addEventListener('beforeunload', function(e) {
        if (!evaluationExpired) {
            e.preventDefault();
            e.returnValue = '¿Está seguro de que desea salir? Se perderá su progreso.';
            return '¿Está seguro de que desea salir? Se perderá su progreso.';
        }
    });
    
    document.addEventListener('keydown', function(e) {
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

document.getElementById('prev-btn').addEventListener('click', prevQuestion);
document.getElementById('next-btn').addEventListener('click', nextQuestion);
document.getElementById('finish-btn').addEventListener('click', finishInterview);
document.addEventListener('keydown', handleKeyDown);
window.addEventListener('load', initializeInterview);
