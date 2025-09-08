<?php
require_once '../core/jwt_config.php';
require_once '/vendor/autoload.php';

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

    private function validation_typeIdentification($tipoIdentificacion)
    {
        $identificacionFiltrada = strtolower(trim($tipoIdentificacion));
        $identificacionesPermitidas = ['tarjeta de identidad', 'cedula', 'cedula extranjera'];

        if (!empty($identificacionFiltrada) && preg_match('/^[A-Za-z]+$/', $identificacionFiltrada) && in_array($identificacionFiltrada, $identificacionesPermitidas)) {
            return true;
        }

        return false;
    }

    public function login()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $tipoIdentificacion = $_POST['tipoIdentificacion'] ?? '';
            $identificacion = $_POST['identificacion'] ?? '';
            $contrasena = $_POST['contrasena'] ?? '';
            $errors = [];

            if (empty($tipoIdentificacion)) {
                $errors[] = "El tipo de identificación es obligatorio.";
            }

            if (!$this->validation_typeIdentification($tipoIdentificacion)) {
                $errors[] = "El tipo de identificacion elegido no se encuentra en disponibilidad";
            }

            if (!preg_match('/^[0-9]+$/', $identificacion) && empty($identificacion)) {
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
                $userdata = $user->findByUsuario($identificacion);

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
                        'id_user' => $userdata['id'],
                        'usuario' => $userdata['usuario']
                    ]
                ];

                $jwt = JWT::encode($token, JwtConfig::getKey(), 'HS256');
                session_start();
                $_SESSION['id_user'] = $userdata['id'];
                $_SESSION['usuario'] = $userdata['usuario'];

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
}
