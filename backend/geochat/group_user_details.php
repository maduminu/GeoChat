<?php
require_once 'Database.php';

header('Content-Type: application/json');

try {
    $GroupId = $_POST["Groupid"] ?? "";
    $logID = $_POST["logUer"] ?? "";

    if (empty($GroupId)) {
        throw new Exception("Missing Group ID");
    }

    $stmt = Database::search(
        "SELECT u.profile_url, u.name, u.id FROM `group_user` gu 
         INNER JOIN `user` u ON u.id = gu.user_id 
         WHERE gu.group_id = ? AND gu.user_id != ?",
    [$GroupId, $logID]
    );

    $phpResponceArray = array();
    foreach ($stmt->fetchAll() as $row) {
        $phpArrayItemObject = new stdClass();
        $phpArrayItemObject->pic = $row["profile_url"];
        $phpArrayItemObject->name = $row["name"];
        $phpArrayItemObject->id = $row["id"];
        $phpResponceArray[] = $phpArrayItemObject;
    }

    echo json_encode($phpResponceArray);

}
catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}