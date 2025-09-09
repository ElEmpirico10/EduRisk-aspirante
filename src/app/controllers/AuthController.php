<?php
require_once __DIR__ . '/../../core/jwt_config.php';



use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthController extends Controller
{
    private function jsonResponse($data, $statusCode = 200)
    {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }

    

    public function validationToken($token)
    {
        try {
            $decode = JWT::decode($token, new Key(JwtConfig::getKey(), 'HS256'));
            return $this->jsonResponse(['status' => 'success', 'message' => 'Acceso permitido']);
        } catch (\Throwable $err) {
            return $this->jsonResponse(['status' => 'error', 'message' => 'Acceso no autorizado: ' . $err->getMessage()], 401);
        }
    }

    public function login()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            $tipoIdentificacion = $_POST['tipoIdentificacion'] ?? '';
            $identificacion = $_POST['document-number'] ?? '';
            $contrasena = $_POST['password'] ?? '';
            $errors = [];

            if (empty($tipoIdentificacion)) {
                $errors[] = "El tipo de identificación es obligatorio.";
            }

            if (!preg_match('/^[0-9]+$/', $identificacion) && empty($identificacion)) {
                $errors[] = "Campo de identificacion no valido";
            }

            if (empty($contrasena)) {
                $errors[] = "Asegurate de digitar tu respectiva contraseña";
            }

            if (!strlen($contrasena) < 6) {
                $errors[] = "La contraseña debe tener al menos 6 caracteres.";
            }

            if (empty($errors)) {
                $user = $this->model('Users');
                $userdata = $user->findByUsuario($tipoIdentificacion,$identificacion);

                if (!$userdata || !password_verify($contrasena, $userdata['contrasena'])) {
                    return $this->jsonResponse([
                        'status' => 'error',
                        'message' => 'Contreña incorrecta.'
                    ], 401);
                }

                $token = [
                    'iss' => JwtConfig::getIssuer(),
                    'aud' => JwtConfig::getAudience(),
                    'iat' => JwtConfig::getIssueAt(),
                    'exp' => JwtConfig::expirationTime(),
                    'data' => [
                        'id_user' => $userdata['id_aspirante'],
                        'usuario' => $userdata['numero_tarjeta']
                    ]
                ];

                $jwt = JWT::encode($token, JwtConfig::getKey(), 'HS256');
                session_start();
                $_SESSION['id_user'] = $userdata['id_aspirante'];
                $_SESSION['usuario'] = $userdata['numero_tarjeta'];

                return $this->jsonResponse([
                    'status' => 'success',
                    'message' => 'Login correcto',
                    'token' => $jwt
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

    public function index(){
         $this->view('login');

    }
}
