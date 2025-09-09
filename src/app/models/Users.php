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

    public function findByusuario($tipo_documento,$numero_documento)
    {
        $sql = "SELECT buscar_aspirante(:tipo_documento,:numero_documento)";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([':tipo_documento' => $tipo_documento,
                        ':numero_documento'=>$numero_documento]);
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