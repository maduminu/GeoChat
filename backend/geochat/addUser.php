<?php
require_once 'Database.php';

header('Content-Type: application/json');

try {
    $userId = $_POST["userId"] ?? "";
    $groupId = $_POST["groupId"] ?? "";

    if (empty($userId) || empty($groupId)) {
        throw new Exception("Missing user or group ID");
    }

    $stmt = Database::search("SELECT * FROM `group_user` WHERE `group_id` = ? AND `user_id` = ?", [$groupId, $userId]);

    if ($stmt->rowCount() == 0) {
        Database::iud("INSERT INTO `group_user`(`group_id`,`user_id`) VALUES(?, ?)", [$groupId, $userId]);
        echo json_encode(['success' => true, 'message' => 'User added to group']);
    }
    else {
        echo json_encode(['success' => false, 'message' => 'This User is already in the group']);
    }

}
catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}