<?php
require_once 'Database.php';

header('Content-Type: application/json');

try {
    $id = $_POST["userId"] ?? "";
    $name = $_POST["name"] ?? "";
    $mobile = $_POST["mobile"] ?? "";
    $imgType = $_POST["imgType"] ?? "1";
    $countryType = $_POST["countryType"] ?? "1";
    $about = $_POST["about"] ?? "Available";

    if (empty($id)) {
        throw new Exception("Unauthorized");
    }

    // 1. Update Name
    if (preg_match('/^[A-Za-z ]{5,32}$/', $name)) {
        Database::iud("UPDATE `user` SET `name` = ? WHERE `id` = ?", [$name, $id]);
    }

    // 2. Update Mobile
    if (preg_match('/^[0]{1}[0-9]{9}$/', $mobile)) {
        Database::iud("UPDATE `user` SET `mobile` = ? WHERE `id` = ?", [$mobile, $id]);
    }

    // 3. Update Profile Picture
    if ($imgType != '1') {
        $profile_picture_location = $_FILES["img"]["tmp_name"] ?? null;
        if ($profile_picture_location) {
            $unqId = uniqid();
            $pImage = '/react_chat/upload/' . $unqId . '.jpeg';
            move_uploaded_file($profile_picture_location, './upload/' . $unqId . '.jpeg');
            Database::iud("UPDATE `user` SET `profile_url` = ? WHERE `id` = ?", [$pImage, $id]);
        }
    }

    // 4. Update Country
    if ($countryType == '1') {
        $countryName = $_POST["Contry"] ?? "";
        $stmtC = Database::search("SELECT id FROM `country` WHERE `name` = ?", [$countryName]);
        $countryRow = $stmtC->fetch();
        if ($countryRow) {
            Database::iud("UPDATE `user` SET `country_id` = ? WHERE `id` = ?", [$countryRow['id'], $id]);
        }
    }

    // 5. Update About
    if ($about != "null" && !empty($about)) {
        Database::iud("UPDATE `user` SET `about` = ? WHERE `id` = ?", [$about, $id]);
    }

    // Fetch updated user
    $stmtU = Database::search("SELECT * FROM `user` WHERE `id` = ?", [$id]);
    $user = $stmtU->fetch();

    echo json_encode(['success' => true, 'user' => $user]);

}
catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}