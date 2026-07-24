<?php
/**
 * URL Shortener + Auto Preview (title, description, image, favicon)
 * - Pengunjung biasa: langsung 301 redirect ke URL asli, tanpa halaman perantara.
 * - Bot/crawler (WhatsApp, Telegram, Discord, Facebook, dll): dikasih halaman
 *   berisi meta tag Open Graph supaya preview (judul, deskripsi, gambar, favicon) muncul.
 * Data disimpan di links.json
 */

$dataFile = __DIR__ . '/links.json';

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

/**
 * Deteksi apakah pengunjung adalah bot/crawler pratinjau link (bukan manusia).
 */
function isPreviewBot() {
    $ua = strtolower($_SERVER['HTTP_USER_AGENT'] ?? '');
    if ($ua === '') return false;

    $bots = [
        'facebookexternalhit', 'facebot', 'twitterbot', 'whatsapp',
        'telegrambot', 'discordbot', 'slackbot', 'linkedinbot',
        'skypeuripreview', 'viber', 'line-poker', 'pinterest',
        'googlebot', 'bingbot', 'embedly', 'quora link preview',
        'vkshare', 'w3c_validator', 'redditbot', 'applebot',
    ];

    foreach ($bots as $bot) {
        if (strpos($ua, $bot) !== false) return true;
    }
    return false;
}

/**
 * Ambil title, description, image (og:image), dan favicon dari sebuah URL publik.
 */
function fetchMetaData($url) {
    $meta = [
        'title'       => $url,
        'description' => '',
        'image'       => '',
        'favicon'     => '',
    ];

    $parsedHost = parse_url($url, PHP_URL_HOST);
    if ($parsedHost) {
        $meta['favicon'] = 'https://www.google.com/s2/favicons?domain=' . $parsedHost . '&sz=64';
    }

    if (!function_exists('curl_init')) {
        return $meta;
    }

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT        => 6,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_USERAGENT      => 'Mozilla/5.0 (compatible; CondogamesBot/1.0; +https://condogames.my.id)',
    ]);
    $html = curl_exec($ch);
    curl_close($ch);

    if (!$html) {
        return $meta;
    }

    $html = substr($html, 0, 200000);

    libxml_use_internal_errors(true);
    $dom = new DOMDocument();
    $dom->loadHTML($html);
    libxml_clear_errors();

    $xpath = new DOMXPath($dom);

    $ogTitle = $xpath->query('//meta[@property="og:title"]/@content');
    if ($ogTitle->length > 0) {
        $meta['title'] = trim($ogTitle->item(0)->nodeValue);
    } else {
        $titleTag = $dom->getElementsByTagName('title');
        if ($titleTag->length > 0) {
            $meta['title'] = trim($titleTag->item(0)->nodeValue);
        }
    }

    $ogDesc = $xpath->query('//meta[@property="og:description"]/@content');
    if ($ogDesc->length > 0) {
        $meta['description'] = trim($ogDesc->item(0)->nodeValue);
    } else {
        $desc = $xpath->query('//meta[@name="description"]/@content');
        if ($desc->length > 0) {
            $meta['description'] = trim($desc->item(0)->nodeValue);
        }
    }

    $ogImage = $xpath->query('//meta[@property="og:image"]/@content');
    if ($ogImage->length > 0) {
        $imgUrl = trim($ogImage->item(0)->nodeValue);
        if (!preg_match('/^https?:\/\//i', $imgUrl)) {
            $scheme = parse_url($url, PHP_URL_SCHEME);
            $host = parse_url($url, PHP_URL_HOST);
            $imgUrl = $scheme . '://' . $host . '/' . ltrim($imgUrl, '/');
        }
        $meta['image'] = $imgUrl;
    }

    $iconNode = $xpath->query('//link[@rel="icon" or @rel="shortcut icon"]/@href');
    if ($iconNode->length > 0) {
        $iconHref = trim($iconNode->item(0)->nodeValue);
        if (!preg_match('/^https?:\/\//i', $iconHref)) {
            $scheme = parse_url($url, PHP_URL_SCHEME);
            $host = parse_url($url, PHP_URL_HOST);
            $iconHref = $scheme . '://' . $host . '/' . ltrim($iconHref, '/');
        }
        $meta['favicon'] = $iconHref;
    }

    return $meta;
}

function escapeHtml($str) {
    return htmlspecialchars($str, ENT_QUOTES, 'UTF-8');
}

$links = loadLinks($dataFile);

// ==== MODE 1: Akses /kode ====
if (isset($_GET['code']) && !isset($_GET['action'])) {
    $code = $_GET['code'];

    if (!isset($links[$code])) {
        http_response_code(404);
        echo "Link tidak ditemukan.";
        exit;
    }

    $entry = $links[$code];
    $targetUrl = $entry['url'];

    // Pengunjung biasa (bukan bot preview) -> langsung redirect, tanpa halaman perantara
    if (!isPreviewBot()) {
        header('Location: ' . $targetUrl, true, 301);
        exit;
    }

    // Bot/crawler -> tampilkan halaman berisi meta tag saja (tidak ikut redirect)
    $meta = $entry['meta'] ?? ['title' => $targetUrl, 'description' => '', 'image' => '', 'favicon' => ''];

    $title = escapeHtml($meta['title']);
    $desc  = escapeHtml($meta['description']);
    $image = escapeHtml($meta['image']);
    $favicon = escapeHtml($meta['favicon']);
    $safeTarget = escapeHtml($targetUrl);

    echo <<<HTML
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>{$title}</title>

<meta property="og:title" content="{$title}">
<meta property="og:description" content="{$desc}">
<meta property="og:image" content="{$image}">
<meta property="og:url" content="https://{$_SERVER['HTTP_HOST']}/{$code}">
<meta property="og:type" content="website">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{$title}">
<meta name="twitter:description" content="{$desc}">
<meta name="twitter:image" content="{$image}">

<link rel="icon" href="{$favicon}">
</head>
<body>
<a href="{$safeTarget}">{$safeTarget}</a>
</body>
</html>
HTML;
    exit;
}

// ==== MODE 2: Cek key saja (dipakai gerbang login di index.html) ====
if (isset($_GET['action']) && $_GET['action'] === 'verify') {
    // Ganti "RAHASIA123" dengan kata sandi buatanmu sendiri
    $secretKey = 'cimemex';

    header('Content-Type: application/json');
    if (isset($_GET['key']) && $_GET['key'] === $secretKey) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => 'Key salah.']);
    }
    exit;
}

// ==== MODE 3: Buat short link baru ====
// Akses: shortener.php?action=create&url=https://example.com&key=RAHASIA
if (isset($_GET['action']) && $_GET['action'] === 'create') {

    // Ganti "RAHASIA123" dengan kata sandi buatanmu sendiri (harus sama seperti di atas)
    $secretKey = 'cimemex';

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

    if (!isset($_GET['url']) || !filter_var($_GET['url'], FILTER_VALIDATE_URL) || !preg_match('/^https:\/\//i', $_GET['url'])) {
        http_response_code(400);
        if ($wantsJson) {
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'error' => 'URL tidak valid. Harus diawali https://']);
        } else {
            echo "URL tidak valid. Harus diawali https://";
        }
        exit;
    }

    $originalUrl = $_GET['url'];

    if (isset($_GET['custom']) && !empty($_GET['custom'])) {
        $code = $_GET['custom'];
        if (isset($links[$code])) {
            if ($wantsJson) {
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'error' => "Kode '$code' sudah dipakai."]);
            } else {
                echo "Kode '$code' sudah dipakai. Coba kode lain.";
            }
            exit;
        }
    } else {
        do {
            $code = generateCode(6);
        } while (isset($links[$code]));
    }

    $meta = fetchMetaData($originalUrl);

    $links[$code] = [
        'url'        => $originalUrl,
        'meta'       => $meta,
        'created_at' => date('Y-m-d H:i:s'),
    ];

    saveLinks($dataFile, $links);

    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];
    $shortUrl = "$scheme://$host/$code";

    if ($wantsJson) {
        header('Content-Type: application/json');
        echo json_encode([
            'success'   => true,
            'short_url' => $shortUrl,
            'code'      => $code,
            'meta'      => $meta,
            'original_url' => $originalUrl,
        ]);
        exit;
    }

    echo "Short link berhasil dibuat:\n";
    echo $shortUrl;
    exit;
}

// ==== MODE 3: Default ====
echo "Shortener aktif. Gunakan ?action=create&url=... untuk membuat link baru.";
