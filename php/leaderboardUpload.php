<?php

include 'functions.php';


if (isset($_SESSION['username']) && isset($_SESSION['id']) && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $levels = htmlspecialchars($_GET['level_reached']);
    $enemies = htmlspecialchars($_GET['total_enemies']);


    $w = STMT($conn, 'INSERT INTO leaderboard (username, level_reached, total_enemies, timestamp) VALUES (?,?,?,NOW(6))', ['s', 'i', 'i'], [$_SESSION['username'], $levels, $enemies]);

    if ($w['result']) {
        echo json_encode(['response' => true]);
    } else {
        echo json_encode(['response'=>false]);
    }
} else {
    header('Location: ../index.html');
}