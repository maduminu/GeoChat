<?php
require_once 'Database.php';

header('Content-Type: application/json');

try {
    $useJSONText = $_POST["userJSONText"] ?? "{}";
    $userText = $_POST["text"] ?? "";
    $usePHPObject = json_decode($useJSONText);
    $useId = $usePHPObject->id ?? 0;

    if (empty($useId)) {
        throw new Exception("Unauthorized");
    }

    // Fetch groups the user belongs to
    $stmt = Database::search(
        "SELECT g.*, gu.group_id FROM `group_user` gu 
         INNER JOIN `group` g ON gu.group_id = g.id 
         WHERE gu.user_id = ? AND g.name LIKE ? 
         ORDER BY gu.date_time DESC",
    [$useId, $userText . '%']
    );

    $phpResponceArray = array();
    foreach ($stmt->fetchAll() as $row) {
        $phpArrayItemObject = new stdClass();
        $groupId = $row["id"];

        $phpArrayItemObject->pic = $row["profile_url"];
        $phpArrayItemObject->name = $row["name"];
        $phpArrayItemObject->id = $row["id"];
        $phpArrayItemObject->createUserId = $row["group_create_user_id"];

        // Fetch last message for the group
        $stmtM = Database::search(
            "SELECT * FROM `group_chat` WHERE `group_id` = ? ORDER BY `date_time` DESC LIMIT 1",
        [$groupId]
        );
        $lastChatRow = $stmtM->fetch();

        $unseenChatCount = 0;
        if ($lastChatRow) {
            $phpArrayItemObject->msg = $lastChatRow["message"];
            $phpArrayItemObject->chatStatusId = (int)$lastChatRow["chat_status_id"];
            $phpArrayItemObject->time = date('h:i a', strtotime($lastChatRow["date_time"]));

            // Calculate unseen count (Simplified professional count)
            if ($lastChatRow["send_user_id"] != $useId && $lastChatRow["status_id"] == 1) {
                $stmtC = Database::search(
                    "SELECT COUNT(*) as unseen FROM `group_chat` WHERE `group_id` = ? AND `send_user_id` != ? AND `status_id` = '1'",
                [$groupId, $useId]
                );
                $countRow = $stmtC->fetch();
                $unseenChatCount = $countRow['unseen'];
            }
        }
        else {
            $phpArrayItemObject->msg = "No messages yet";
            $phpArrayItemObject->chatStatusId = "1";
            $phpArrayItemObject->time = "";
        }

        $phpArrayItemObject->count = $unseenChatCount;
        $phpResponceArray[] = $phpArrayItemObject;
    }

    echo json_encode($phpResponceArray);

}
catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}