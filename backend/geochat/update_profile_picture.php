<?php
require_once 'Database.php';

header('Content-Type: application/json');

try {
    $id = $_POST["userId"] ?? "";
    $profile_picture_location = $_FILES["img"]["tmp_name"] ?? null;

    if (empty($id) || !$profile_picture_location) {
        throw new Exception("Missing data");
    }

    $unqId = uniqid();
    $pImage = '/react_chat/upload/' . $unqId . '.jpeg';
    move_uploaded_file($profile_picture_location, './upload/' . $unqId . '.jpeg');

    Database::iud("UPDATE `user` SET `profile_url` = ? WHERE `id` = ?", [$pImage, $id]);

    echo json_encode(['success' => true, 'profile_url' => $pImage]);

}
catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}