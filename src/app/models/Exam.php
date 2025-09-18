<?php
require_once __DIR__ . "/../../core/Database.php";
class Exam
{
    private $conn;

    public function __construct()
    {
        $database = new Conexion();
        $this->conn = $database->getConnection();
    }

    public function haveExam($idAspirante)
    {

        $sql = "SELECT e.id_examen
            FROM Aspirante a
            JOIN Ficha f ON f.id_ficha = a.id_ficha
            JOIN Examen e ON e.id_ficha = f.id_ficha
            WHERE a.id_aspirante = :idAspirante
              AND e.habilitado = TRUE
            LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([':idAspirante' => $idAspirante]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getExam($idAspirante)
    {
        $sql = 'SELECT p.id_pregunta, p.texto_pregunta, p.tipo_pregunta, p.contenido, e.id_examen FROM aspirante a
                JOIN Ficha f ON f.id_ficha = a.id_ficha
                JOIN Examen e ON e.id_ficha = f.id_ficha
                JOIN Examen_pregunta ep ON ep.id_examen = e.id_examen
                JOIN Pregunta p ON  p.id_pregunta = ep.id_pregunta
                WHERE a.id_aspirante = :idAspirante';
        $stmt = $this->conn->prepare($sql);
        $stmt->execute(['idAspirante' => $idAspirante]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function guardarRespuestas($idAspirante, $idExamen, $respuestas)
    {
        if (empty($respuestas) || !is_array($respuestas)) {
            return false;
        }

        try {
            $this->conn->beginTransaction();

            $stmt = $this->conn->prepare("
            INSERT INTO Respuesta (texto_respuesta, id_aspirante, id_pregunta, id_examen)
            VALUES (:texto_respuesta, :id_aspirante, :id_pregunta, :id_examen)
        ");

            foreach ($respuestas as $respuesta) {
                $idPregunta = $respuesta['id_pregunta'] ?? null;
                $textoRespuesta = $respuesta['texto_respuesta'] ?? null;

                if (!$idPregunta || $textoRespuesta === null) {
                    continue; // saltar si falta algo
                }

                $stmt->execute([
                    ':texto_respuesta' => $textoRespuesta,
                    ':id_aspirante' => $idAspirante,
                    ':id_pregunta' => $idPregunta,
                    ':id_examen' => $idExamen
                ]);
            }

            $this->conn->commit();
            return true;
        } catch (Exception $e) {
            $this->conn->rollBack();
            error_log("Error guardando respuestas: " . $e->getMessage());
            return false;
        }
    }


    public function registrarInicioExamen($idAspirante, $idExamen)
    {
        $sql = "INSERT INTO Examen_Aspirante (id_examen, id_aspirante, fecha_realizacion)
            VALUES (:idExamen, :idAspirante,NOW())
            ON CONFLICT (id_examen, id_aspirante) DO NOTHING";

        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            'idExamen' => $idExamen,
            'idAspirante' => $idAspirante
        ]);
    }

    public function yaPresentoExamen($idAspirante, $idExamen)
    {
        $sql = "SELECT *
            FROM Examen_Aspirante
            WHERE id_examen = :idExamen AND id_aspirante = :idAspirante
            LIMIT 1";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            'idExamen' => $idExamen,
            'idAspirante' => $idAspirante
        ]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

}
?>