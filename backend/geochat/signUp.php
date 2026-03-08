<?php
require_once 'Database.php';

header('Content-Type: application/json');

try {
    $mobile = $_POST["mobile"] ?? "";
    $name = $_POST["name"] ?? "";
    $password = $_POST["password"] ?? "";
    $country = $_POST["country"] ?? "";
    $profile_picture_location = $_FILES["profile_picture"]["tmp_name"] ?? null;

    if (empty($mobile) || empty($name) || empty($password)) {
        throw new Exception("Please fill all required fields");
    }

    // 1. Check if user already exists using PREPARED STATEMENTS
    $stmt = Database::search("SELECT * FROM `user` WHERE `mobile` = ?", [$mobile]);
    if ($stmt->rowCount() > 0) {
        throw new Exception("This mobile number is already taken");
    }

    // 2. Simple Validations
    if (!preg_match('/^[A-Za-z ]{5,32}$/', $name)) {
        throw new Exception("User name must be 5-32 letters");
    }
    if (!preg_match('/^[0]{1}[0-9]{9}$/', $mobile)) {
        throw new Exception("Mobile number is invalid");
    }
    if (!preg_match("/^(?=.*?[A-Z])(?=.*?[a-z]).{8,}$/", $password)) {
        throw new Exception("Password must be 8+ chars with upper/lower case");
    }

    // 3. Get Country ID safely
    $stmtC = Database::search("SELECT * FROM `country` WHERE `name` = ?", [$country]);
    $country_row = $stmtC->fetch();
    $country_id = $country_row ? $country_row["id"] : 1; // Default or error

    // 4. PROFESSIONAL SECURITY: HASH THE PASSWORD
    $hashed_password = password_hash($password, PASSWORD_BCRYPT);

    $pImage = '/react_chat/upload/' . $mobile . '.jpeg';

    // 5. Insert User safely
    Database::iud(
        "INSERT INTO `user` (`mobile`,`name`,`password`,`profile_url`,`country_id`, `about`) VALUES(?, ?, ?, ?, ?, ?)",
    [$mobile, $name, $hashed_password, $pImage, $country_id, 'Available']
    );

    if ($profile_picture_location) {
        move_uploaded_file($profile_picture_location, './upload/' . $mobile . '.jpeg');
    }

    echo json_encode(['success' => true, 'message' => 'success']);

}
catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}