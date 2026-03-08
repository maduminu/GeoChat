<?php
require_once 'Database.php';

header('Content-Type: application/json');

try {
    $name = $_POST["name"] ?? "";
    $userId = $_POST["userId"] ?? "";
    $profile_picture_location = $_FILES["profile_picture"]["tmp_name"] ?? null;

    if (empty($name) || empty($userId)) {
        throw new Exception("Missing required group data");
    }

    $uniqId = uniqid();
    $pImage = '/react_chat/groupUpload/' . $uniqId . '.jpeg';

    // 1. Create Group
    Database::iud(
        "INSERT INTO `group` (`name`,`profile_url`,`group_create_user_id`) VALUES (?, ?, ?)",
    [$name, $pImage, $userId]
    );

    // 2. Get the new Group ID
    $db = Database::getConnection();
    $newGroupId = $db->lastInsertId();

    if ($profile_picture_location) {
        move_uploaded_file($profile_picture_location, './groupUpload/' . $uniqId . '.jpeg');
    }

    date_default_timezone_set('Asia/Colombo');
    $date_time = date("Y-m-d H:i:s");

    // 3. Add creator to the group
    Database::iud(
        "INSERT INTO `group_user` (`group_id`,`user_id`,`date_time`) VALUES (?, ?, ?)",
    [$newGroupId, $userId, $date_time]
    );

    echo json_encode(['success' => true, 'groupId' => $newGroupId]);

}
catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}