<?php
require_once 'Database.php';

header('Content-Type: application/json');

try {
    $requestJson = $_POST["requsetJson"] ?? "";
    $requestObject = json_decode($requestJson);

    if (!$requestObject) {
        throw new Exception("Invalid request");
    }

    $from_id = $requestObject->from_user_id;
    $GroupID = $requestObject->to_user_id;
    $message = $requestObject->message;

    date_default_timezone_set('Asia/Colombo');
    $date_time = date("Y-m-d H:i:s");

    // 1. Save message
    Database::iud(
        "INSERT INTO `group_chat` (`send_user_id`,`group_id`,`message`,`date_time`,`status_id`,`chat_status_id`) VALUES(?, ?, ?, ?, '1', '1')",
    [$from_id, $GroupID, $message, $date_time]
    );

    // 2. Update group activity timestamp
    Database::iud(
        "UPDATE `group_user` SET `date_time` = ? WHERE `group_id` = ?",
    [$date_time, $GroupID]
    );

    echo json_encode(['success' => true]);

}
catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}