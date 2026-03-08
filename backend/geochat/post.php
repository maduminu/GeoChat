<?php
require_once 'Database.php';

header('Content-Type: application/json');

try {
    $logUserId = $_POST["userId"] ?? 0;
    $pageId = $_POST["pageId"] ?? "1";
    $Id = $_POST["id"] ?? "1"; // contextId

    if ($pageId == "1") {
        $stmt = Database::search("SELECT * FROM `post` ORDER BY `date_time` DESC");
    }
    else {
        $stmt = Database::search("SELECT * FROM `post` WHERE `user_id` = ? ORDER BY `date_time` DESC", [$logUserId]);
    }

    $posts = $stmt->fetchAll();
    $phpResponceArray = array();

    foreach ($posts as $row) {
        $phpObject = new stdClass();
        $postId = $row["id"];
        $postAuthorId = $row["user_id"];

        $phpObject->id = $postId;
        $phpObject->name = $row["name"];
        $phpObject->pic = $row["pic_url"];
        $phpObject->userId = $postAuthorId;
        $phpObject->time = date('F j, Y', strtotime($row["date_time"]));

        // Get post author details
        $stmtU = Database::search("SELECT * FROM `user` WHERE `id` = ?", [$postAuthorId]);
        $author = $stmtU->fetch();

        $phpObject->useName = (!empty($logUserId) && $postAuthorId == $logUserId) ? "You" : $author["name"];
        $phpObject->profilePic = $author["profile_url"];

        // Get current user's reaction status
        $targetUserId = ($Id == "1") ? $logUserId : ($_POST["userId2"] ?? $logUserId);
        $stmtS = Database::search("SELECT post_status_type_id FROM `post_status` WHERE `user_id` = ? AND `post_id` = ?", [$targetUserId, $postId]);
        $statusRow = $stmtS->fetch();

        if (!$statusRow || $statusRow["post_status_type_id"] == "2") {
            $phpObject->postStatus = "none";
        }
        else {
            $phpObject->postStatus = $statusRow["post_status_type_id"];
        }

        // Get total likes (excluding '2' which is un-liked)
        $stmtL = Database::search("SELECT COUNT(*) as likes FROM `post_status` WHERE `post_id` = ? AND `post_status_type_id` != '2'", [$postId]);
        $likeRow = $stmtL->fetch();
        $phpObject->PostLikeCount = (int)$likeRow['likes'];

        // Get total posts by this logUserId (demonstrating user stats)
        $stmtStats = Database::search("SELECT COUNT(*) as total FROM `post` WHERE `user_id` = ?", [$logUserId]);
        $statsRow = $stmtStats->fetch();
        $phpObject->post = (int)$statsRow['total'];

        // Get total likes received by this logUserId across all posts
        // PROFESSIONAL APPROACH: Use a single query for stats instead of N+1
        $stmtReceivedLikes = Database::search(
            "SELECT COUNT(ps.id) as total_likes 
             FROM `post_status` ps 
             INNER JOIN `post` p ON ps.post_id = p.id 
             WHERE p.user_id = ? AND ps.post_status_type_id != '2'",
        [$logUserId]
        );
        $receivedLikesRow = $stmtReceivedLikes->fetch();
        $phpObject->like = (int)$receivedLikesRow['total_likes'];

        $phpResponceArray[] = $phpObject;
    }

    echo json_encode($phpResponceArray);

}
catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}