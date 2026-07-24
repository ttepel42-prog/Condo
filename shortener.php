<?php
/**
 * Simple URL Shortener
 * Cara kerja: /index.php?code=XXXX -> redirect ke URL asli
 * Data link disimpan di links.json
 */

$dataFile = __DIR__ . '/links.json';

// Load data
function loadLinks($file) {
    if (!file_exists($file)) {
        file_put_contents($file, json_encode([]));
    }
    $json = file_get_contents($file);
    return json_decode($json, true) ?: [];
}

function saveLinks($file, $data) {
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
}

function generateCode($length = 6) {
    $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $code = '';
    for ($i = 0; $i < $length; $i++) {
        $code .= $chars[random_int(0, strlen($chars) - 1)];
    }
    return $code;
}

$links = loadLinks($dataFile);

// ==== MODE 1: Redirect (diakses lewat /kode langsung, via .htaccess) ====
if (isset($_GET['code']) && !isset($_GET['action'])) {
    $code = $_GET['code'];
    if (isset($links[$code])) {
        header('Location: ' . $links[$code]['url'], true, 301);
        exit;
    } else {
        http_response_code(404);
        echo "Link tidak ditemukan.";
        exit;
    }
}

// ==== MODE 2: Buat short link baru ====
// Akses: index.php?action=create&url=https://example.com&key=RAHASIA
if (isset($_GET['action']) && $_GET['action'] === 'create') {

    // Ganti "RAHASIA123" dengan kata sandi buatanmu sendiri
    $secretKey = 'RAHASIA123';

    $wantsJson = isset($_GET['format']) && $_GET['format'] === 'json';

    if (!isset($_GET['key']) || $_GET['key'] !== $secretKey) {
        http_response_code(403);
        if ($wantsJson) {
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'error' => 'Akses ditolak. Key salah.']);
        } else {
            echo "Akses ditolak. Key salah.";
        }
        exit;
    }

    if (!isset($_GET['url']) || !filter_var($_GET['url'], FILTER_VALIDATE_URL)) {
        http_response_code(400);
        if ($wantsJson) {
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'error' => 'URL tidak valid.']);
        } else {
            echo "URL tidak valid.";
        }
        exit;
    }

    $originalUrl = $_GET['url'];

    // Kode custom (opsional): ?code=promo1
    if (isset($_GET['custom']) && !empty($_GET['custom'])) {
        $code = $_GET['custom'];
        if (isset($links[$code])) {
            echo "Kode '$code' sudah dipakai. Coba kode lain.";
            exit;
        }
    } else {
        do {
            $code = generateCode(6);
        } while (isset($links[$code]));
    }

    $links[$code] = [
        'url' => $originalUrl,
        'created_at' => date('Y-m-d H:i:s'),
    ];

    saveLinks($dataFile, $links);

    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];
    $shortUrl = "$scheme://$host/$code";

    // Jika diminta format JSON (dipakai oleh index.html)
    if (isset($_GET['format']) && $_GET['format'] === 'json') {
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'short_url' => $shortUrl, 'code' => $code]);
        exit;
    }

    echo "Short link berhasil dibuat:\n";
    echo $shortUrl;
    exit;
}

// ==== MODE 3: Tampilan default kalau diakses tanpa parameter ====
echo "Shortener aktif. Gunakan ?action=create&url=...&key=... untuk membuat link baru.";