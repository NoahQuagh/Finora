<?php
// api/auth/me.php
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
require_once __DIR__ . '/../utils/Session.php';

if (Session::estConnecte()) {
    echo json_encode([
        'success' => true,
        'user'    => Session::user()
    ]);
} else {
    echo json_encode([
        'success' => false,
        'user'    => null
    ]);
}