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

try {
    $db = getDB();

    $stmtTx = $db->prepare('
        SELECT
    t.TRA_ID as id,
    t.TRA_DATE as date,
    t.TRA_LIBELLE as libelle,
    t.TRA_MONTANT as montant,
    t.TRA_EST_A_PRELEVER as est_a_prelever,
    b.BUD_NOM as budget,
    cmp.COM_NOM as compte,
    c.CAT_NOM as categorie,
    c.CAT_ICON as icon
FROM FIN_TRANSACTION t
         LEFT JOIN FIN_BUDGET b ON t.TRA_BUD_ID = b.BUD_ID
         LEFT JOIN FIN_CATEGORIE c ON t.TRA_CAT_ID = c.CAT_ID
        LEFT JOIN FIN_COMPTE cmp ON t.TRA_COM_ID = cmp.COM_ID
WHERE t.TRA_USE_ID = ?
ORDER BY t.TRA_DATE DESC, t.TRA_ID DESC
    ');
    $stmtTx->execute([$userId]);
    $transactions = $stmtTx->fetchAll(PDO::FETCH_ASSOC);

    foreach ($transactions as &$t) {
        $t['id'] = (int)$t['id'];
        $t['date'] = (string)$t['date'];
        $t['libelle'] = (string)$t['libelle'];
        $t['est_a_prelever'] = (string)$t['est_a_prelever'];
        $t['montant'] = (float)$t['montant'];
        $t['budget'] = (string)$t['budget'];
        $t['categorie'] = (string)$t['categorie'];
        $t['compte'] = (string)$t['compte'];
        $t['icon'] = (string)$t['icon'];
    }


    $data = [
        'transactions' => $transactions
    ];

    echo json_encode([
        'success' => true,
        'data'    => $data,
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur SQL : ' . $e->getMessage(),
    ]);
}