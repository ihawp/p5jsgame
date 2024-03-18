<?php


$dbUser = 'root';
$dbName = 'leaderboard';
$dbPass = '';
$dbHost = 'localhost';



$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);

if ($conn->connect_error) {
    echo 'db connection error';
}