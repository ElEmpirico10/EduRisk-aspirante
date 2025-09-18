<?php
class ExamController extends Controller
{
    private function jsonResponse($data, $statusCode = 200)
    {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }

    /**
     * Obtener el examen y sus preguntas
     * Parámetros esperados: id_aspirante
     */
    public function getExam()
    {
        $idAspirante = $_GET['id_aspirante'] ?? null;
        if (!$idAspirante) {
            return $this->jsonResponse([
                'status' => 'error',
                'message' => 'Falta el parámetro id_aspirante'
            ], 400);
        }

        $examModel = $this->model('Exam');


        // Obtener preguntas
        $preguntas = $examModel->getExam($idAspirante);

        return $this->jsonResponse([
            'id_aspirante' => $idAspirante,
            'total' => count($preguntas),
            'preguntas' => $preguntas
        ]);
    }

    public function saveAnswers()
    {
        $input = json_decode(file_get_contents("php://input"), true);

        $idAspirante = $input['id_aspirante'] ?? null;
        $idExamen = $input['id_examen'] ?? null;
        $respuestas = $input['respuestas'] ?? null;

        if (!$idAspirante || !$idExamen || !$respuestas) {
            return $this->jsonResponse([
                'error' => 'Faltan parámetros: id_aspirante, id_examen o respuestas'
            ], 400);
        }

        $examModel = $this->model('Exam');

        // Guardar respuestas
        $okRespuestas = $examModel->guardarRespuestas($idAspirante, $idExamen, $respuestas);

        if (!$okRespuestas) {
            return $this->jsonResponse([
                'success' => false,
                'message' => 'No se pudieron guardar las respuestas'
            ], 500);
        }

        // ✅ Si todo salió bien, responde success true
        return $this->jsonResponse([
            'success' => true,
            'message' => 'Respuestas guardadas correctamente'
        ], 200);
    }

    function index()
    {
        $this->view('exam');
    }

}
