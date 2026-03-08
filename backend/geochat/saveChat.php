<?php
require_once 'Database.php';

header('Content-Type: application/json');

try {
    $requestJson = $_POST["requsetJson"] ?? "";
    $requestObject = json_decode($requestJson);

    if (!$requestObject) {
        throw new Exception("Invalid request data");
    }

    $from_id = $requestObject->from_user_id;
    $to_id = $requestObject->to_user_id;
    $message = $requestObject->message;

    date_default_timezone_set('Asia/Colombo');
    $date_time = date("Y-m-d H:i:s");

    // 1. Insert message safely
    Database::iud(
        "INSERT INTO `chat` (`user_from_id`,`user_to_id`,`massage`,`date_time`,`status_id`,`chat_status_id`) VALUES(?, ?, ?, ?, '1', '1')",
    [$from_id, $to_id, $message, $date_time]
    );

    // 2. Check and update friendship/conversation history
    // We use a simpler, cleaner query pattern here
    $stmtF = Database::search(
        "SELECT * FROM `friends` WHERE (`from_user_id` = ? AND `to_user_id` = ?) OR (`from_user_id` = ? AND `to_user_id` = ?)",
    [$from_id, $to_id, $to_id, $from_id]
    );

    if ($stmtF->rowCount() == 0) {
        Database::iud(
            "INSERT INTO `friends` (`from_user_id`,`to_user_id`,`date_time`) VALUES(?, ?, ?)",
        [$from_id, $to_id, $date_time]
        );
    }
    else {
        Database::iud(
            "UPDATE `friends` SET `date_time` = ? WHERE (`from_user_id` = ? AND `to_user_id` = ?) OR (`from_user_id` = ? AND `to_user_id` = ?)",
        [$date_time, $from_id, $to_id, $to_id, $from_id]
        );
    }

    echo json_encode(['success' => true, 'message' => 'Message sent']);

}
catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}