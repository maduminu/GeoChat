<?php
require_once 'Database.php';

header('Content-Type: application/json');

try {
    $user1 = $_POST["id1"] ?? "";
    $user2 = $_POST["id2"] ?? "";
    $pageId = $_POST["pageId"] ?? "1";

    if (empty($user1) || empty($user2)) {
        throw new Exception("Missing IDs");
    }

    if ($pageId == "1") {
        Database::iud(
            "UPDATE `chat` SET `status_id` = '2' WHERE `user_from_id` = ? AND `user_to_id` = ?",
        [$user2, $user1]
        );
    }
    else {
        Database::iud(
            "UPDATE `group_chat` SET `status_id` = '2' WHERE `group_id` = ? AND `send_user_id` != ?",
        [$user2, $user1]
        );
    }
    echo json_encode(['success' => true]);
}
catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}