<?php

class AuthController extends Controller
{
    private function jsonResponse($data, $statusCode = 200)
    {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }


    public function login()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $tipoIdentificacion = $_POST['tipoIdentificacion'] ?? '';
            $identificacion = $_POST['identificacion'] ?? '';
            $contrasena = $_POST['password'] ?? '';
            $errors = [];

            // Validaciones básicas
            if (empty($tipoIdentificacion)) {
                $errors[] = "El tipo de identificación es obligatorio.";
            }
            if (empty($identificacion)) {
                $errors[] = "El número de identificación es obligatorio.";
            }
            if (empty($contrasena)) {
                $errors[] = "Asegúrate de digitar tu respectiva contraseña.";
            }
            if (!empty($contrasena) && strlen($contrasena) < 6) {
                $errors[] = "La contraseña debe tener al menos 6 caracteres.";
            }

            if (!empty($errors)) {
                return $this->jsonResponse([
                    'status' => 'error',
                    'errors' => $errors
                ], 400);
            }

            // Buscar usuario
            $user = $this->model('Users');
            $userdata = $user->findByUsuario($tipoIdentificacion, $identificacion);

            if (!$userdata) {
                return $this->jsonResponse([
                    'status' => 'error',
                    'message' => 'El usuario no está registrado en la base de datos'
                ], 404);
            }

            if (empty($userdata['contrasena'])) {
                return $this->jsonResponse([
                    'status' => 'error',
                    'message' => 'El usuario no tiene contraseña registrada'
                ], 400);
            }

            // Verificar contraseña
            if (!password_verify($contrasena, $userdata['contrasena'])) {
                return $this->jsonResponse([
                    'status' => 'error',
                    'message' => 'Contraseña incorrecta.'
                ], 401);
            }

            session_start();
            $_SESSION['id_user'] = $userdata['id_aspirante'];
            $_SESSION['usuario'] = $userdata['numero_tarjeta'];

            return $this->jsonResponse([
                'status' => 'success',
                'message' => 'Usuario Logeado Correctamente',
                'user' => [
                    'id' => $userdata['id_aspirante'],
                    'nombre' => $userdata['primer_nombre'] . ' ' . $userdata['primer_apellido'],
                    'documento' => $userdata['numero_tarjeta']
                ]
            ]);
        }

        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $data = ['title' => 'Login'];
            return $this->view('login', $data);
        }

        return $this->jsonResponse([
            'status' => 'error',
            'message' => 'Método no permitido'
        ], 405);
    }

    public function index()
    {
        $this->view('login');

    }
}
