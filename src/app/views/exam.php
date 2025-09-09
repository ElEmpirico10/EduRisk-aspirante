<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EduRisk - Evaluación ADSO</title>
    <link rel="stylesheet" href="public/css/exam.css">
    <link rel="stylesheet" href="public/css/toast.css">

</head>

<body>
    <div class="container">
        <div class="header">
            <h1>EduRisk - Evaluación ADSO</h1>
            <p>Sistema de Evaluación de Riesgo Educativo</p>
        </div>

        <div class="progress-container">
            <div class="timer-container">
                <div class="timer-icon">⏰</div>
                <div class="timer-text">
                    <span>Tiempo restante: </span>
                    <span id="timer">30:00</span>
                </div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <div class="progress-text">
                <span id="current-question">1</span> de <span id="total-questions">27</span>
            </div>
        </div>

        <div class="form-container">
            <div id="questions-container">
                <!-- Las preguntas se generarán aquí -->
            </div>

            <div class="navigation">
                <button class="btn btn-secondary" id="prev-btn" disabled>Anterior</button>
                <button class="btn btn-primary" id="next-btn">Siguiente</button>
                <button class="btn btn-primary" id="finish-btn" style="display: none;">Finalizar Evaluación</button>
            </div>
        </div>

        <div class="summary" id="summary">
            <h2>¡Evaluación Completada!</h2>
            <div class="summary-stats">
                <p><strong>Preguntas respondidas:</strong> <span id="answered-count">0</span> de 27</p>
                <p><strong>Porcentaje de completitud:</strong> <span id="completion-percentage">0</span>%</p>
            </div>

            <button class="btn btn-secondary" onclick="restartInterview()" style="margin-left: 10px;">Reiniciar</button>
        </div>

        <div class="expired-container" id="expired-container" style="display: none;">
            <div class="expired-content">
                <div class="expired-icon">⏰</div>
                <h1>Tiempo Expirado</h1>
                <p>Su tiempo para contestar la evaluación ha expirado.</p>
                <p>La evaluación se ha cerrado automáticamente.</p>
                <div class="expired-info">
                    <p><strong>Tiempo límite:</strong> 30 minutos</p>
                    <p><strong>Estado:</strong> Evaluación no completada</p>
                    
                </div>
                <button class="btn btn-primary" id="regresar-btn">Regresar al Login</button>
                
            </div>
        </div>
    </div>
    <script src="/public/js/toast.js"></script>
    <script src="/public/js/exam.js"></script>
</body>

</html>