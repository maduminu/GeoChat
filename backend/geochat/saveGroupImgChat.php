<?php
require_once 'Database.php';

header('Content-Type: application/json');

try {
    $requestJson = $_POST["requsetJson"] ?? "";
    $requestObject = json_decode($requestJson);
    $profile_picture_location = $_FILES["img"]["tmp_name"] ?? null;

    if (!$requestObject || !$profile_picture_location) {
        throw new Exception("Invalid request or missing image");
    }

    $unqId = uniqid();
    $pImage = '/react_chat/groupImg/' . $unqId . '.jpeg';
    move_uploaded_file($profile_picture_location, './groupImg/' . $unqId . '.jpeg');

    $from_id = $requestObject->from_user_id;
    $GroupID = $requestObject->to_user_id;

    date_default_timezone_set('Asia/Colombo');
    $date_time = date("Y-m-d H:i:s");

    Database::iud(
        "INSERT INTO `group_chat` (`send_user_id`,`group_id`,`message`,`date_time`,`status_id`,`chat_status_id`) VALUES(?, ?, ?, ?, '1', '2')",
    [$from_id, $GroupID, $pImage, $date_time]
    );

    echo json_encode(['success' => true]);

}
catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}