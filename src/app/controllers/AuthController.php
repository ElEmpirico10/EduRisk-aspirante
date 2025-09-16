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

        header('Access-Control-Allow-Origin: http://localhost');
        header('Access-Control-Allow-Credentials: true');
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            header('Access-Control-Allow-Methods: POST, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type');
            http_response_code(200);
            exit;
        }
        
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            $tipoIdentificacion = $_POST['tipoIdentificacion'] ?? '';
            $identificacion = $_POST['identificacion'] ?? '';
            $contrasena = $_POST['password'] ?? '';
            $errors = [];

            if (empty($tipoIdentificacion)) {
                $errors[] = "El tipo de identificación es obligatorio.";
            }

            if (!preg_match('/^[0-9]+$/', $identificacion)) {
                $errors[] = "Campo de identificacion no valido";
            }

            if (empty($contrasena)) {
                $errors[] = "Asegurate de digitar tu respectiva contraseña";
            }

            if (strlen($contrasena) < 6) {
                $errors[] = "La contraseña debe tener al menos 6 caracteres.";
            }

            if (empty($errors)) {
                $user = $this->model('Users');
                $userdata = $user->findByUsuario($tipoIdentificacion, $identificacion);

                if (!$userdata || !password_verify($contrasena, $userdata['contrasena'])) {
                    return $this->jsonResponse([
                        'status' => 'error',
                        'message' => 'Contreña incorrecta.'
                    ], 401);
                }

                session_start();
                $_SESSION['id_user'] = $userdata['id_aspirante'];
                $_SESSION['usuario'] = $userdata['numero_tarjeta'];
                
                return $this->jsonResponse([
                    'status' => 'success',
                    'message' => 'Sesion iniciada correctamente. Bienvenido!'
                ]);
            }

            return $this->jsonResponse([
                'status' => 'error',
                'message' => $errors
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
