<?php
require_once 'Database.php';

header('Content-Type: application/json');

try {
    $requestJson = $_POST["requsetJson"] ?? "";
    $requestObject = json_decode($requestJson);
    $pageId = $_POST["pageId"] ?? "1";

    if (!$requestObject) {
        throw new Exception("Invalid request");
    }

    $from_id = $requestObject->from_user_id;
    $to_id = $requestObject->to_user_id;
    $date_time = date("Y-m-d H:i:s");

    if ($pageId == "1") {
        $profile_picture_location = $_FILES["img"]["tmp_name"] ?? null;
        if (!$profile_picture_location)
            throw new Exception("No image uploaded");

        $unqId = uniqid();
        $pImage = '/react_chat/groupImg/' . $unqId . '.jpeg';
        move_uploaded_file($profile_picture_location, './groupImg/' . $unqId . '.jpeg');
    }
    else {
        $pImage = $_POST["img"] ?? "";
        if (empty($pImage))
            throw new Exception("No image provided");
    }

    Database::iud(
        "INSERT INTO `chat` (`user_from_id`,`user_to_id`,`massage`,`date_time`,`status_id`,`chat_status_id`) VALUES (?, ?, ?, ?, '1', '2')",
    [$from_id, $to_id, $pImage, $date_time]
    );

    echo json_encode(['success' => true]);

}
catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}