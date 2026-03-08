<?php
require_once 'Database.php';

header('Content-Type: application/json');

try {
    $user1 = $_POST["id1"] ?? "";
    $user2 = $_POST["id2"] ?? "";

    if (empty($user1) || empty($user2)) {
        throw new Exception("Missing user IDs");
    }

    // 1. Mark messages as seen
    Database::iud(
        "UPDATE `chat` SET `status_id` = '2' WHERE `user_from_id` = ? AND `user_to_id` = ?",
    [$user2, $user1]
    );

    // 2. Fetch chat history safely
    $stmt = Database::search(
        "SELECT chat.*, status.name as status_name FROM `chat` 
         INNER JOIN `status` ON `chat`.`status_id` = `status`.`id` 
         WHERE (`user_from_id` = ? AND `user_to_id` = ?) 
         OR (`user_from_id` = ? AND `user_to_id` = ?) 
         ORDER BY `date_time` ASC",
    [$user1, $user2, $user2, $user1]
    );

    $chatArray = array();
    foreach ($stmt->fetchAll() as $row) {
        $chatObject = new stdClass();
        $chatObject->msg = $row["massage"];
        $chatObject->chatStatusId = $row["chat_status_id"];
        $chatObject->time = date('h:i a', strtotime($row["date_time"]));
        $chatObject->side = ($row["user_from_id"] == $user1) ? "right" : "left";
        $chatObject->status = strtolower($row["status_name"]);

        $chatArray[] = $chatObject;
    }

    echo json_encode($chatArray);

}
catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}