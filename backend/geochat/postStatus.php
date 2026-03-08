<?php
require_once 'Database.php';

header('Content-Type: application/json');

try {
    $userId = $_POST["userId"] ?? "";
    $postId = $_POST["postId"] ?? "";
    $postStatus = $_POST["postStatus"] ?? "none";
    $postType = $_POST["longPress"] ?? "0";

    if (empty($userId) || empty($postId)) {
        throw new Exception("Missing data");
    }

    $stmt = Database::search("SELECT * FROM `post_status` WHERE `user_id` = ? AND `post_id` = ?", [$userId, $postId]);
    $existing = $stmt->fetch();

    $newType = ($postType == '1') ? '1' : '3'; // Like or Heart

    // Toggle logic
    if ($postStatus != "none" && $postStatus != "2") {
        // Already liked/hearted, so unlike it
        $newType = '2';
    }

    if (!$existing) {
        Database::iud("INSERT INTO `post_status`(`post_status_type_id`,`post_id`,`user_id`) VALUES (?, ?, ?)", [$newType, $postId, $userId]);
    }
    else {
        Database::iud("UPDATE `post_status` SET `post_status_type_id` = ? WHERE `user_id` = ? AND `post_id` = ?", [$newType, $userId, $postId]);
    }

    echo json_encode(['success' => true, 'newStatus' => $newType]);

}
catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}