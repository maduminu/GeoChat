<?php
require_once 'Database.php';

header('Content-Type: application/json');

try {
    $useJSONText = $_POST["userJSONText"] ?? "{}";
    $usePHPObject = json_decode($useJSONText);
    $useId = $usePHPObject->id ?? 0;

    if (empty($useId)) {
        throw new Exception("Unauthorized");
    }

    $stmt = Database::search("SELECT * FROM `user` WHERE `id` != ?", [$useId]);

    $phpResponceArray = array();
    foreach ($stmt->fetchAll() as $user) {
        $phpArrayItemObject = new stdClass();
        $userToId = $user["id"];
        $phpArrayItemObject->pic = $user["profile_url"];
        $phpArrayItemObject->name = $user["name"];
        $phpArrayItemObject->id = $userToId;

        // Fetch last chat metadata
        $stmtM = Database::search(
            "SELECT chat.*, status.name as status_name FROM `chat` 
             INNER JOIN `status` ON `chat`.`status_id` = `status`.`id` 
             WHERE (`user_from_id` = ? AND `user_to_id` = ?) 
             OR (`user_from_id` = ? AND `user_to_id` = ?) 
             ORDER BY `date_time` DESC LIMIT 1",
        [$useId, $userToId, $userToId, $useId]
        );
        $lastChatRow = $stmtM->fetch();

        if (!$lastChatRow) {
            $phpArrayItemObject->msg = "Tap To Message";
            $phpArrayItemObject->chatStatusId = "1";
            $phpArrayItemObject->time = "";
            $phpArrayItemObject->count = "0";
        }
        else {
            $phpArrayItemObject->msg = $lastChatRow["massage"];
            $phpArrayItemObject->chatStatusId = (int)$lastChatRow["chat_status_id"];
            $phpArrayItemObject->time = date('h:i a', strtotime($lastChatRow["date_time"]));

            if ($lastChatRow["user_from_id"] == $userToId && $lastChatRow["status_id"] == 1) {
                $stmtC = Database::search("SELECT COUNT(*) as unseen FROM `chat` WHERE `user_from_id` = ? AND `user_to_id` = ? AND `status_id` = '1'", [$userToId, $useId]);
                $countRow = $stmtC->fetch();
                $phpArrayItemObject->count = $countRow['unseen'];
            }
            else {
                $phpArrayItemObject->count = "0";
            }
        }
        $phpResponceArray[] = $phpArrayItemObject;
    }

    echo json_encode($phpResponceArray);

}
catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}