<?php
require_once __DIR__ . "/../../core/Database.php";
class Users
{
    private $conn;

    public function __construct()
    {
        $database = new Conexion();
        $this->conn = $database->getConnection();
    }

    public function findByusuario($identificacion)
    {
        $sql = "SELECT * FROM usuarios WHERE usuario = :usuario";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([':usuario' => $identificacion]);
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