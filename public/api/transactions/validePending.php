<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');

require_once __DIR__ . '/../../utils/Session.php';//TODO A FAIRE
require_once __DIR__ . '/../../db.php';

session_start();
$userId = class_exists('Session') ? Session::id() : ($_SESSION['user_id'] ?? null);

if (!$userId) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Non authentifié']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$traId = isset($input['id']) ? (int)$input['id'] : 0;

if (!$traId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID transaction manquant']);
    exit;
}

try {
    $db = getDB();
    $stmt = $db->prepare('
        UPDATE FIN_TRANSACTION 
        SET TRA_EST_A_PRELEVER = 0 
        WHERE TRA_ID = ? AND TRA_USE_ID = ?
    ');
    $stmt->execute([$traId, $userId]);

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
