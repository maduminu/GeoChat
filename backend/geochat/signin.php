<?php
require_once 'Database.php';

header('Content-Type: application/json');

try {
    $jsonRequestText = $_POST["jsonRequestText"] ?? "";
    $phpRequestObject = json_decode($jsonRequestText);

    if (!$phpRequestObject) {
        throw new Exception("Invalid request data");
    }

    $mobile = $phpRequestObject->mobile;
    $password = $phpRequestObject->password;

    // USE PREPARED STATEMENTS TO PREVENT SQL INJECTION
    $stmt = Database::search("SELECT * FROM `user` WHERE `mobile` = ?", [$mobile]);
    $user = $stmt->fetch();

    $response = new stdClass();

    if (!$user) {
        $response->success = false;
        $response->message = "User not found";
    }
    else {
        // IN A REAL APP, USE: if (password_verify($password, $user['password']))
        // For now, since existing db has plain text, we check directly but through prepared statements.
        if ($user['password'] === $password) {
            $response->success = true;
            $response->message = "Success";
            $response->user = $user;
        }
        else {
            $response->success = false;
            $response->message = "Invalid password";
        }
    }

    echo json_encode($response);

}
catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}