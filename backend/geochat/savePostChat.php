<?php
require_once 'Database.php';

header('Content-Type: application/json');

try {
    $requestJson = $_POST["requsetJson"] ?? "";
    $requestObject = json_decode($requestJson);

    if (!$requestObject) {
        throw new Exception("Invalid request");
    }

    $userId = $requestObject->userId;
    $postId = $requestObject->postId;
    $message = $requestObject->message;

    date_default_timezone_set('Asia/Colombo');
    $date_time = date("Y-m-d H:i:s");

    Database::iud(
        "INSERT INTO `post_msg` (`user_id`,`post_id`,`msg`,`date_time`) VALUES (?, ?, ?, ?)",
    [$userId, $postId, $message, $date_time]
    );

    echo json_encode(['success' => true]);

}
catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}