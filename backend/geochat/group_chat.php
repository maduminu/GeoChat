<?php
require_once 'Database.php';

header('Content-Type: application/json');

try {
    $user1 = $_POST["id1"] ?? ""; // current user
    $user2 = $_POST["id2"] ?? ""; // group id

    if (empty($user1) || empty($user2)) {
        throw new Exception("Missing IDs");
    }

    // 1. Mark messages as seen (except own messages)
    Database::iud(
        "UPDATE `group_chat` SET `status_id` = '2' WHERE `group_id` = ? AND `send_user_id` != ?",
    [$user2, $user1]
    );

    // 2. Fetch history
    $stmt = Database::search(
        "SELECT gc.*, u.name as user_name FROM `group_chat` gc 
         INNER JOIN `user` u ON u.id = gc.send_user_id 
         WHERE gc.group_id = ? 
         ORDER BY gc.date_time ASC",
    [$user2]
    );

    $chatArray = array();
    foreach ($stmt->fetchAll() as $row) {
        $chatObject = new stdClass();
        $chatObject->msg = $row["message"];
        $chatObject->chatStatusId = $row["chat_status_id"];
        $chatObject->send_user_id = $row["send_user_id"];
        $chatObject->time = date('h:i a', strtotime($row["date_time"]));

        if ($row["send_user_id"] == $user1) {
            $chatObject->side = "right";
            $chatObject->name = "You";
        }
        else {
            $chatObject->side = "left";
            $chatObject->name = strtolower($row["user_name"]);
        }
        $chatObject->status = strtolower($row["status_id"]);
        $chatArray[] = $chatObject;
    }

    echo json_encode($chatArray);

}
catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}