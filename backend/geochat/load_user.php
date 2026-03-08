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

    $phpResponceArray = array();

    if ($userText == "") {
        // PROFESSIONAL APPROACH: Fetch all friends and their latest message in a more efficient way
        // In a real app, we might use a complex JOIN or a separate conversation table.
        // For this refactor, we focus on safe Prepared Statements.
        $stmt = Database::search("SELECT * FROM `friends` WHERE `from_user_id` = ? OR `to_user_id` = ? ORDER BY `date_time` DESC", [$useId, $useId]);

        foreach ($stmt->fetchAll() as $conversationTable) {
            $conversationId = ($conversationTable["from_user_id"] == $useId) ? $conversationTable["to_user_id"] : $conversationTable["from_user_id"];

            $stmtU = Database::search("SELECT * FROM `user` WHERE `id` = ?", [$conversationId]);
            $user = $stmtU->fetch();

            if (!$user)
                continue;

            $item = formatUserItem($user, $useId, $conversationId);
            $phpResponceArray[] = $item;
        }
    }
    else {
        // Search mode
        $stmt = Database::search("SELECT * FROM `user` WHERE `id` != ? AND `name` LIKE ?", [$useId, $userText . "%"]);
        foreach ($stmt->fetchAll() as $user) {
            $item = formatUserItem($user, $useId, $user["id"]);
            $phpResponceArray[] = $item;
        }
    }

    echo json_encode($phpResponceArray);

}
catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

/**
 * Helper to format user item with chat metadata
 */
function formatUserItem($user, $currentUserId, $otherUserId)
{
    $item = new stdClass();
    $item->pic = $user["profile_url"];
    $item->name = $user["name"];
    $item->id = $user["id"];
    $item->mobile = $user["mobile"];
    $item->country = $user["country_id"];
    $item->about = $user["about"];

    // Fetch last message
    $stmtM = Database::search(
        "SELECT chat.*, status.name as status_name FROM `chat` 
         INNER JOIN `status` ON `chat`.`status_id` = `status`.`id` 
         WHERE (`user_from_id` = ? AND `user_to_id` = ?) 
         OR (`user_from_id` = ? AND `user_to_id` = ?) 
         ORDER BY `date_time` DESC LIMIT 1",
    [$currentUserId, $otherUserId, $otherUserId, $currentUserId]
    );

    $lastChatRow = $stmtM->fetch();

    if (!$lastChatRow) {
        $item->msg = "Tap To Message";
        $item->chatStatusId = "1";
        $item->time = "";
        $item->count = "0";
    }
    else {
        $item->msg = $lastChatRow["massage"];
        $item->chatStatusId = (int)$lastChatRow["chat_status_id"];
        $item->time = date('h:i a', strtotime($lastChatRow["date_time"]));

        // Calculate unseen count
        if ($lastChatRow["user_from_id"] == $otherUserId && $lastChatRow["status_id"] == 1) {
            $stmtC = Database::search(
                "SELECT COUNT(*) as unseen FROM `chat` WHERE `user_from_id` = ? AND `user_to_id` = ? AND `status_id` = '1'",
            [$otherUserId, $currentUserId]
            );
            $countRow = $stmtC->fetch();
            $item->count = $countRow['unseen'];
        }
        else {
            $item->count = "0";
        }
    }
    return $item;
}