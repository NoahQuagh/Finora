<?php
// api/db.php
$isLocal = ($_SERVER['SERVER_NAME'] ?? '') === 'localhost';

define('DB_HOST', '127.0.0.1');
define('DB_PORT', $isLocal ? '3306' : '3307');
define('DB_USER', 'finora_admin');
define('DB_PASS', '2007,FIno');
define('DB_NAME', 'FINORA_DB');
define('DB_CHARSET', 'utf8mb4');

function getDB(): ?PDO
{
    static $pdo = null;

    if ($pdo !== null) {
        try {
            $pdo->query('SELECT 1');
            return $pdo;
        } catch (PDOException $e) {
            $pdo = null;
        }
    }

    try {
        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=%s',
            DB_HOST, DB_PORT, DB_NAME, DB_CHARSET
        );

        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::ATTR_TIMEOUT            => 3,
        ];

        return new PDO($dsn, DB_USER, DB_PASS, $options);
    } catch (PDOException $e) {
        error_log("Erreur DB Finora : " . $e->getMessage());
        return null;
    }
}