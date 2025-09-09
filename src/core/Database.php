<?php
class Conexion {
    private $host = "db"; // nombre del servicio en docker-compose
    private $db = "EduRisk";
    private $user = "postgres";
    private $pass = "admin";
    private $conn;

    public function getConnection() {
        try {
            $this->conn = new PDO("pgsql:host={$this->host};dbname={$this->db}", $this->user, $this->pass);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            error_log("Conexión exitosa a PostgreSQL");

            return $this->conn;
        } catch (PDOException $e) {
            die("Error de conexión: " . $e->getMessage());
        }
    }

    public function getConexion() {
        return $this->conn;
    }
}
?>
