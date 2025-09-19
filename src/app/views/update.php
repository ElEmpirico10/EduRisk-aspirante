<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edurisk - Iniciar Sesión</title>

    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
    <link rel="stylesheet" href="/public/css/update.css">
    <link rel="stylesheet" href="/public/css/toast.css">

</head>

<body>
    <div class="login-container">
        <div class="logo-container">
            <div class="logo"></div>
            <h1 class="app-name">Actualizar Contraseña</h1>
        </div>

        <form id="formContent">
            <div class="form-group">
                <label for="password">Nueva Contraseña</label>
                <div class="password-wrapper">
                    <input type="password" id="password" name="password" placeholder="Ingrese su nueva contraseña" required>
                    <i class="bi bi-eye toggle-password" id="togglePassword"></i>
                </div>
            </div>
            
            <div class="form-group">
                <label for="passwordConfirmar">Confirmar Contraseña</label>
                <div class="password-wrapper">
                    <input type="password" id="passwordConfirmar" name="passwordConfirmar" placeholder="Confirmar su contraseña" required>
                    <i class="bi bi-eye toggle-password" id="togglePassword"></i>
                </div>
            </div>

            <button type="submit" class="login-btn">Actualizar</button>
        </form>


    </div>

    <footer>
        © 2025 Edurisk. Todos los derechos reservados.
    </footer>

    
    <script src="/public/js/toast.js"></script>
</body>

</html>