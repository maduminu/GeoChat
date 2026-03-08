<?php

class Database
{
    private static $connection;

    /**
     * Get the PDO database connection instance.
     * Uses the Singleton pattern to ensure only one connection is open.
     */
    public static function getConnection()
    {
        if (!self::$connection) {
            $host = '127.0.0.1';
            $db = 'geochat';
            $user = 'root';
            $pass = 'password';
            $charset = 'utf8mb4';

            $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => true,
                PDO::ATTR_STRINGIFY_FETCHES => true,
            ];

            try {
                self::$connection = new PDO($dsn, $user, $pass, $options);
            }
            catch (\PDOException $e) {
                // In production, log error and show generic message
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'message' => 'Database connection failed']);
                exit;
            }
        }
        return self::$connection;
    }

    /**
     * Helper to execute a prepared query with parameters.
     */
    public static function search($query, $params = [])
    {
        $stmt = self::getConnection()->prepare($query);
        $stmt->execute($params);
        return $stmt;
    }

    /**
     * Helper to execute an INSERT/UPDATE/DELETE query.
     */
    public static function iud($query, $params = [])
    {
        $stmt = self::getConnection()->prepare($query);
        $stmt->execute($params);
    }
}