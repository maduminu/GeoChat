<?php
require_once 'Database.php';

header('Content-Type: application/json');

try {
    $user1 = $_POST["userId"] ?? "";
    $user2 = $_POST["postId"] ?? "";

    if (empty($user1) || empty($user2)) {
        throw new Exception("Missing data");
    }

    $stmt = Database::search(
        "SELECT pm.*, u.name as user_name FROM `post_msg` pm 
         INNER JOIN `user` u ON u.id = pm.user_id 
         WHERE pm.post_id = ? 
         ORDER BY pm.date_time ASC",
    [$user2]
    );

    $chatArray = array();
    foreach ($stmt->fetchAll() as $row) {
        $chatObject = new stdClass();
        $chatObject->msg = $row["msg"];
        $chatObject->send_user_id = $row["user_id"];
        $chatObject->time = date('H:i', strtotime($row["date_time"]));
        $chatObject->side = ($row["user_id"] == $user1) ? "right" : "left";
        $chatObject->name = ($row["user_id"] == $user1) ? "You" : strtolower($row["user_name"]);

        $chatArray[] = $chatObject;
    }

    echo json_encode($chatArray);

}
catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}