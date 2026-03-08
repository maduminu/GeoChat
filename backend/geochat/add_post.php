<?php
require_once 'Database.php';

header('Content-Type: application/json');

try {
    $name = $_POST["name"] ?? "";
    $userId = $_POST["userId"] ?? "";
    $profile_picture_location = $_FILES["profile_picture"]["tmp_name"] ?? null;

    if (empty($name) || empty($userId) || !$profile_picture_location) {
        throw new Exception("Missing required post data");
    }

    $uniqId = uniqid();
    $pImage = '/react_chat/postUpload/' . $uniqId . '.jpeg';

    date_default_timezone_set('Asia/Colombo');
    $date_time = date("Y-m-d H:i:s");

    Database::iud(
        "INSERT INTO `post`(`name`,`pic_url`,`user_id`,`date_time`) VALUES (?, ?, ?, ?)",
    [$name, $pImage, $userId, $date_time]
    );

    move_uploaded_file($profile_picture_location, './postUpload/' . $uniqId . '.jpeg');

    echo json_encode(['success' => true]);

}
catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}