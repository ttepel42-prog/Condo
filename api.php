<?php

header("Content-Type: application/json");

require_once "config.php";

/*
|--------------------------------------------------------------------------
| Ambil Data
|--------------------------------------------------------------------------
*/

$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    $input = $_POST;
}

$key = $input["key"] ?? "";
$url = trim($input["url"] ?? "");

/*
|--------------------------------------------------------------------------
| Validasi API Key
|--------------------------------------------------------------------------
*/

if ($key !== API_KEY) {
    echo json_encode([
        "success" => false,
        "message" => "API Key Salah!"
    ]);
    exit;
}

/*
|--------------------------------------------------------------------------
| Validasi URL
|--------------------------------------------------------------------------
*/

if (!isValidUrl($url)) {
    echo json_encode([
        "success" => false,
        "message" => "URL harus diawali https://"
    ]);
    exit;
}

/*
|--------------------------------------------------------------------------
| Database
|--------------------------------------------------------------------------
*/

$db = readDatabase();

/*
|--------------------------------------------------------------------------
| Cek Jika URL Sudah Ada
|--------------------------------------------------------------------------
*/

foreach ($db as $code => $data) {

    if ($data["url"] == $url) {

        echo json_encode([
            "success" => true,
            "short" => SITE_URL . "/" . $code,
            "markdown" => "[" . $url . "](" . SITE_URL . "/" . $code . ")"
        ], JSON_UNESCAPED_SLASHES);

        exit;
    }

}

/*
|--------------------------------------------------------------------------
| Generate Code Baru
|--------------------------------------------------------------------------
*/

do {

    $code = generateCode();

} while (isset($db[$code]));

/*
|--------------------------------------------------------------------------
| Simpan Database
|--------------------------------------------------------------------------
*/

$db[$code] = [

    "url" => $url,
    "created_at" => date("Y-m-d H:i:s"),
    "clicks" => 0

];

saveDatabase($db);

/*
|--------------------------------------------------------------------------
| Response
|--------------------------------------------------------------------------
*/

echo json_encode([

    "success" => true,

    "short" => SITE_URL . "/" . $code,

    "markdown" => "[" . $url . "](" . SITE_URL . "/" . $code . ")"

], JSON_UNESCAPED_SLASHES);