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

    // 1. COMPTE COURANT
    $stmtDep =$db->prepare('
        SELECT
            COM_NOM as nom,
            COM_SOLDE as solde,
            COM_SOLDE_PREVU as prevu
        FROM FIN_V_SOLDE_COMPTE
        WHERE COM_USE_ID = ? AND COM_TYPE = "COURANT"
        LIMIT 1
    ');
    $stmtDep->execute([$userId]);
    $courant =$stmtDep->fetch(PDO::FETCH_ASSOC);

    // Fallback si aucun compte courant existe
    if (!$courant) {$courant = ['nom' => 'Courant', 'solde' => 0.0, 'prevu' => 0.0];
    } else {
        $courant['nom'] = (string)$courant['nom'];
        $courant['solde'] = (float)$courant['solde'];
        $courant['prevu'] = (float)$courant['prevu'];
    }

    // 2. TOTAL DES COMPTES , VÉRIFICATION CONTRÔLE et nombre de compte
    $stmtCtrl =$db->prepare('
        SELECT USE_TOTAL_COMPTES, USE_ECART,(select count(*) from FIN_COMPTE fn where COM_USE_ID=?) as nb_compte
        FROM FIN_V_CONTROLE
        WHERE USE_ID = ?
    ');
    $stmtCtrl->execute([$userId,$userId]);
    $ctrl =$stmtCtrl->fetch(PDO::FETCH_ASSOC);

    $totalCmp = [
        'totalComptes' => (float)($ctrl['USE_TOTAL_COMPTES'] ?? 0.0),
        'ecart' => (float)($ctrl['USE_ECART'] ?? 0.0),
        'nb_compte'        => (int)($ctrl['nb_compte'] ?? 0.0)
    ];

    // 3. LISTE DES ÉPARGNES (Tous les comptes filtrés sur EPARGNE / INVESTISSEMENT)
    $stmtEpa =$db->prepare('
        SELECT 
            sc.COM_ID as id,
            sc.COM_NOM as nom,
            c.COM_TYPE as type,
            sc.COM_SOLDE as solde,
            sc.COM_SOLDE_PREVU as prevu
        FROM FIN_V_SOLDE_COMPTE sc
        JOIN FIN_COMPTE c ON c.COM_ID = sc.COM_ID
        WHERE sc.COM_USE_ID = ? AND c.COM_TYPE IN ("EPARGNE", "BOURSE") AND c.COM_EST_ARCHIVE = 0
    ');
    $stmtEpa->execute([$userId]);
    $epargne =$stmtEpa->fetchAll(PDO::FETCH_ASSOC);

    foreach ($epargne as &$e) {
        $e['id'] = (int)$e['id'];
        $e['nom'] = (string)$e['nom'];
        $e['type'] = (string)$e['type'];
        $e['solde'] = (float)$e['solde'];
        $e['prevu'] = (float)$e['prevu'];
    }

    // 4. LISTE COMPLÈTE DES COMPTES ET BUDGETS (pour les composants d'aperçu)
    $stmtAllCmp =$db->prepare('SELECT sc.COM_ID as id, sc.COM_NOM as nom, sc.COM_SOLDE as solde,c.COM_COULEUR as couleur FROM
    FIN_V_SOLDE_COMPTE sc JOIN FIN_COMPTE c ON sc.COM_ID=c.COM_ID WHERE sc.COM_USE_ID = ?');
    $stmtAllCmp->execute([$userId]);
    $comptes =$stmtAllCmp->fetchAll(PDO::FETCH_ASSOC);

    $stmtAllBud =$db->prepare('SELECT sb.BUD_ID as id, sb.BUD_NOM as nom, sb.BUD_SOLDE as solde,b.BUD_COULEUR as couleur FROM FIN_V_SOLDE_BUDGET sb JOIN FIN_BUDGET b ON sb.BUD_ID=b.BUD_ID  WHERE sb.BUD_USE_ID = ?');
    $stmtAllBud->execute([$userId]);
    $budgets =$stmtAllBud->fetchAll(PDO::FETCH_ASSOC);

// 5. LES 10 DERNIÈRES TRANSACTIONS
    $stmtTx = $db->prepare('
        SELECT 
            t.TRA_ID as id,
            t.TRA_DATE as date,
            t.TRA_LIBELLE as libelle,
            t.TRA_MONTANT as montant,
            b.BUD_NOM as budget,
            c.CAT_NOM as categorie,
            c.CAT_ICON as icon
        FROM FIN_TRANSACTION t
        LEFT JOIN FIN_BUDGET b ON t.TRA_BUD_ID = b.BUD_ID
        LEFT JOIN FIN_CATEGORIE c ON t.TRA_CAT_ID = c.CAT_ID
        WHERE t.TRA_USE_ID = ?
        ORDER BY t.TRA_DATE DESC, t.TRA_ID DESC
        LIMIT 10
    ');
    $stmtTx->execute([$userId]);
    $transactions = $stmtTx->fetchAll(PDO::FETCH_ASSOC);

    foreach ($transactions as &$t) {
        $t['id'] = (int)$t['id'];
        $t['date'] = (string)$t['date'];
        $t['libelle'] = (string)$t['libelle'];
        $t['montant'] = (float)$t['montant'];
        $t['budget'] = (string)$t['budget'];
        $t['categorie'] = (string)$t['categorie'];
        $t['icon'] = (string)$t['icon'];
    }

    //prelevement en attente
    $stmtPrevWait = $db->prepare('select TRA_ID,TRA_DATE,TRA_LIBELLE,TRA_MONTANT,FIN_BUDGET.BUD_NOM,FIN_COMPTE.COM_NOM,FIN_CATEGORIE.CAT_NOM from FIN_TRANSACTION
join FIN_BUDGET on FIN_TRANSACTION.TRA_BUD_ID = FIN_BUDGET.BUD_ID
join FIN_COMPTE on FIN_TRANSACTION.TRA_COM_ID = FIN_COMPTE.COM_ID
JOIN FIN_CATEGORIE on FIN_TRANSACTION.TRA_CAT_ID = FIN_CATEGORIE.CAT_ID
where TRA_EST_A_PRELEVER=1 and TRA_USE_ID=?');

    $stmtPrevWait->execute([$userId]);
    $prelevement = $stmtPrevWait->fetchAll(PDO::FETCH_ASSOC);

    foreach ($prelevement as &$t) {
        $t['id'] = (int)$t['TRA_ID'];
        $t['date'] = (string)$t['TRA_DATE'];
        $t['libelle'] = (string)$t['TRA_LIBELLE'];
        $t['montant'] = (float)$t['TRA_MONTANT'];
        $t['budget'] = (string)$t['BUD_NOM'];
        $t['compte'] = (string)$t['COM_NOM'];
        $t['categorie'] = (string)$t['CAT_NOM'];
    }



    // Structure des données renvoyées au Dashboard React
    $data = [
        'depensable'   => $courant,
        'totalCmp'     => $totalCmp,
        'epargne'      => $epargne,
        'comptes'      => $comptes,
        'budgets'      => $budgets,
        'transactions' => $transactions,
        'prelevement' => $prelevement
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