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
            $usuario = $_POST['usuario'] ?? '';
            $contrasena = $_POST['contrasena'] ?? '';
            $errors = [];

            if (empty($usuario)) {
                $errors[] = "El username no es válido.";
            }

            if (strlen($contrasena) < 6) {
                $errors[] = "La contraseña debe tener al menos 6 caracteres.";
            }

            if (empty($errors)) {
                $user = $this->model('Users');
                $userdata = $user->findByUsuario($usuario);

                if (!$userdata || !password_verify($contrasena, $userdata['contrasena'])) {
                    return $this->jsonResponse([
                        'status' => 'error',
                        'message' => 'Credenciales inválidas.'
                    ], 401);
                }

                session_start();
                $_SESSION['id_user'] = $userdata['id'];
                $_SESSION['usuario'] = $userdata['usuario'];

                return $this->jsonResponse([
                    'status' => 'success',
                    'message' => 'Login correcto',
                    'id_user' => $userdata['id'],
                    'usuario' => $userdata['usuario'],
                ]);
            }

            return $this->jsonResponse([
                'status' => 'error',
                'errors' => $errors
            ], 400);
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
}