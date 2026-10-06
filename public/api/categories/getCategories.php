<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');

require_once __DIR__ . '/../db.php';

try {
    $db = getDB();
    $stmt = $db->prepare('select CAT_ID,CAT_NOM,CAT_ICON from FIN_CATEGORIE');
    $stmt->execute();

    echo json_encode([
        'success' => true,
        'data' => $formatedCategories = $stmt->fetchAll(PDO::FETCH_ASSOC)
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur SQL : ' . $e->getMessage()]);
}