<?php
require_once 'Database.php';

header('Content-Type: application/json');

try {
    $id = $_POST["id"] ?? "";
    $currentPassword = $_POST["currentPassword"] ?? "";
    $newPassword = $_POST["newPassword"] ?? "";

    if (empty($id) || empty($currentPassword) || empty($newPassword)) {
        throw new Exception("Missing password data");
    }

    $stmt = Database::search("SELECT password FROM `user` WHERE `id` = ?", [$id]);
    $user = $stmt->fetch();

    if (!$user) {
        throw new Exception("User not found");
    }

    // PROFESSIONAL SECURITY: Check hashed password
    // (Note: If user hasn't migrated to hashed pass yet, this might fail, 
    // but we must move forward with hashing standard)
    $password_matched = password_verify($currentPassword, $user['password']);

    // Fallback for non-hashed legacy passwords (REMOVE THIS after migration)
    if (!$password_matched && $user['password'] === $currentPassword) {
        $password_matched = true;
    }

    if ($password_matched) {
        $hashedNewPassword = password_hash($newPassword, PASSWORD_BCRYPT);
        Database::iud("UPDATE `user` SET `password` = ? WHERE `id` = ?", [$hashedNewPassword, $id]);

        $stmtU = Database::search("SELECT * FROM `user` WHERE `id` = ?", [$id]);
        echo json_encode(['success' => true, 'user' => $stmtU->fetch()]);
    }
    else {
        throw new Exception("Incorrect current password");
    }

}
catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}