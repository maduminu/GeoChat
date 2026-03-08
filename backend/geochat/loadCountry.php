<?php
require_once 'Database.php';

header('Content-Type: application/json');

try {
    $stmt = Database::search("SELECT name FROM `country` ORDER BY `name` ASC");
    $country_array = array();
    foreach ($stmt->fetchAll() as $row) {
        $country_array[] = $row["name"];
    }
    echo json_encode($country_array);
}
catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}