<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edurisk - Iniciar Sesión</title>

    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
    <link rel="stylesheet" href="/public/css/login.css">

</head>

<body>
    <div class="login-container">
        <div class="logo-container">
            <div class="logo"></div>
            <h1 class="app-name">EDURISK</h1>
        </div>

        <form id="formContent">
            <div class="form-group">
                <label for="document-type">Tipo de Documento</label>
                <select id="documentType__selected-id" id="document-type" name="document_type" required>
                    <option value="">Seleccione tipo de documento</option>
                    <option value="tarjeta_identidad">Tarjeta de Identidad</option>
                    <option value="cedula">Cédula</option>
                    <option value="cedula_extranjera">Cédula Extranjera</option>
                </select>
            </div>

            <div class="form-group">
                <label for="document-number">Número de Documento</label>
                <input type="text" id="document-number" name="document-number"
                    placeholder="Ingrese su número de documento" required>
            </div>

            <div class="form-group">
                <label for="password">Contraseña</label>
                <div class="password-wrapper">
                    <input type="password" id="password" name="password" placeholder="Ingrese su contraseña" required>
                    <i class="bi bi-eye toggle-password" id="togglePassword"></i>
                </div>
            </div>

            <button  type="submit" class="login-btn">Iniciar Sesión</button>
        </form>


    </div>

    <footer>
        © 2025 Edurisk. Todos los derechos reservados.
    </footer>

    <script>
        // Animación suave al cargar la página
        document.addEventListener('DOMContentLoaded', function () {
            const container = document.querySelector('.login-container');
            container.style.opacity = '0';
            container.style.transform = 'translateY(20px)';

            setTimeout(() => {
                container.style.transition = 'all 0.6s ease';
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }, 100);
        });

        // Validación básica del formulario
        document.querySelector('form').addEventListener('submit', function (e) {
            const documentType = document.getElementById('document-type').value;
            const documentNumber = document.getElementById('document-number').value;
            const password = document.getElementById('password').value;

            if (!documentType || !documentNumber || !password) {
                e.preventDefault();
                alert('Por favor, complete todos los campos obligatorios.');
                return;
            }

            if (documentNumber.length < 6) {
                e.preventDefault();
                alert('El número de documento debe tener al menos 6 caracteres.');
                return;
            }
        });

        // Mostrar/Ocultar contraseña
        const togglePassword = document.getElementById('togglePassword');
        const passwordField = document.getElementById('password');

        togglePassword.addEventListener('click', () => {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            togglePassword.classList.toggle('bi-eye');
            togglePassword.classList.toggle('bi-eye-slash');
        });
    </script>

    <script src="/public/js/login.js"></script>
</body>

</html>