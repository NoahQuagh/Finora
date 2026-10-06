<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');

require_once __DIR__ . '/../utils/Session.php';
require_once __DIR__ . '/../db.php';

session_start();
$userId = \api\utils\Session::id();

if (!$userId) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Non authentifié']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$libelle     = trim($input['libelle'] ?? '');
$montant     = (float)($input['montant'] ?? 0);
$type        = $input['type'] ?? 'DEPENSE'; // DEPENSE ou REVENUE
$date        = $input['date'] ?? date('Y-m-d');
$comId       = (int)($input['com_id'] ?? 0);
$budId       = (int)($input['bud_id'] ?? 0);
$catId       = !empty($input['cat_id']) ? (int)$input['cat_id'] : null;
$aPrelever   = !empty($input['est_a_prelever']) ? 1 : 0;

if (empty($libelle) || $montant <= 0 || !$comId || !$budId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Veuillez remplir tous les champs obligatoires.']);
    exit;
}

$finalMontant = ($type === 'DEPENSE') ? -abs($montant) : abs($montant);

try {
    $db = getDB();
    $stmt = $db->prepare('
        INSERT INTO FIN_TRANSACTION 
        (TRA_USE_ID, TRA_DATE, TRA_LIBELLE, TRA_MONTANT, TRA_EST_A_PRELEVER, TRA_BUD_ID, TRA_COM_ID, TRA_CAT_ID)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ');
    $stmt->execute([
        $userId,
        $date,
        $libelle,
        $finalMontant,
        $aPrelever,
        $budId,
        $comId,
        $catId,
    ]);

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur SQL : ' . $e->getMessage()]);
}