<?php
// api/utils/Session.php
namespace api\utils;
require_once __DIR__ . '/../db.php';

class Session
{

    // DÉMARRAGE SÉCURISÉ
    public static function start(): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    // CONNEXION / DÉCONNEXION
    public static function login(array $user): void
    {
        self::start();
        session_regenerate_id(true);
        $_SESSION['user'] = [
            'id' => (int)$user['USE_ID'],
            'email' => $user['USE_EMAIL'],
            'nom' => $user['USE_NOM']
        ];
        $_SESSION['connecte'] = true;
        $_SESSION['login_at'] = time();
    }

    public static function logout(): void
    {
        self::start();
        $_SESSION = [];
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        session_destroy();
    }

    // VÉRIFICATIONS SESSIONS
    public static function estConnecte(): bool
    {
        self::start();
        return isset($_SESSION['connecte']) && $_SESSION['connecte'] === true;
    }

    // Pour les API JSON : retourne une erreur HTTP 401 si non connecté
    public static function requireLoginApi(): void
    {
        if (!self::estConnecte()) {
            header('Content-Type: application/json');
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Non autorisé. Veuillez vous connecter.'
            ]);
            exit;
        }
    }

    // GETTERS UTILISATEUR
    public static function user(): ?array
    {
        self::start();
        return $_SESSION['user'] ?? null;
    }

    public static function get(string $key): mixed
    {
        self::start();
        return $_SESSION['user'][$key] ?? null;
    }

    public static function id(): ?int
    {
        return self::get('id');
    }

    public static function email(): ?string
    {
        return self::get('email');
    }

    public static function nom(): ?string
    {
        return self::get('nom');
    }

    // GESTION DE LA LANGUE
    public static function setLang(string $lang): void
    {
        self::start();
        $clean = preg_replace('/[^a-z]/', '', strtolower($lang));
        if (!empty($clean)) {
            $_SESSION['lang'] = $clean;
        }
    }

    public static function lang(): string
    {
        self::start();
        return $_SESSION['lang'] ?? 'fr';
    }

    // FLASH MESSAGES
    public static function setFlash(string $type, string $message): void
    {
        self::start();
        $_SESSION['flash'][$type] = $message;
    }

    public static function getFlash(string $type): ?string
    {
        self::start();
        if (isset($_SESSION['flash'][$type])) {
            $msg = $_SESSION['flash'][$type];
            unset($_SESSION['flash'][$type]);
            return $msg;
        }
        return null;
    }

    // ERREUR DE BASE DE DONNÉES EN FORMAT JSON POUR REACT
    public static function handleDbError(): void
    {
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Service indisponible. Impossible de contacter la base de données.'
        ]);
        exit;
    }
}