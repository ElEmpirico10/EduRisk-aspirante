<?php
require_once __DIR__ . "/../../core/Database.php";
class Users
{
    private $conn;

    public function __construct()
    {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function create($data)
    {
        try {
            $sql = "INSERT INTO usuarios (nombre,apellido,usuario,email,contrasena,programa)
            VALUES (:nombre, :apellido, :usuario, :email, :contrasena, :programa)";
            $stmt = $this->conn->prepare($sql);
            return $stmt->execute([
                ':nombre' => $data["nombre"],
                ':apellido' => $data['apellido'],
                ':usuario' => $data['usuario'],
                'email' => $data['email'],
                ':contrasena' => $data['contrasena'],
                ':programa' => $data['programa'],
            ]);
        } catch (PDOException $e) {
            return $e->getMessage();
        }
    }

    public function updatePassword($email, $contrasena)
    {
        $sql = "UPDATE usuarios SET contrasena = :contrasena WHERE email = :email";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            ":contrasena" => $contrasena,
            "email" => $email
        ]);

    }

    public function findByusuario($usuario)
    {
        $sql = "SELECT * FROM usuarios WHERE usuario = :usuario";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([':usuario' => $usuario]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function findByEmail($email)
    {
        $sql = "SELECT * FROM usuarios WHERE email = :email";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([':email' => $email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

}
?>