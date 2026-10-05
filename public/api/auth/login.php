<?php
use api\utils\Session;

header('Content-Type: application/json');

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../utils/Session.php';

$input = json_decode(file_get_contents('php://input'), true);
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Veuillez remplir tous les champs.']);
    exit;
}

$pdo = getDB();
if (!$pdo) {
    Session::handleDbError();
}

$stmt = $pdo->prepare('SELECT USE_ID, USE_EMAIL, USE_NOM, USE_MDP FROM FIN_USERS WHERE USE_EMAIL = :email');
$stmt->execute(['email' => $email]);
$user = $stmt->fetch();

if ($user && password_verify($password, $user['USE_MDP'])) {
    Session::login($user);

    echo json_encode([
        'success' => true,
        'user'    => Session::user()
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Identifiants incorrects.']);
}