<?php

session_start();
session_regenerate_id(true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = htmlspecialchars($_POST['username']);
    if (strlen($username) > 0) {
        $_SESSION['username'] = $username;
        $_SESSION['id'] = session_id();
        header('Location: ../game.php');
    } else {
        header('Location: ../index.html');
    }
} else {
    header('Location: ../index.html');
}

exit();