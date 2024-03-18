<?php
include 'functions.php';
if (isset($_SESSION['username'])) {
    if ($_SESSION['page'] === 'game') { ?>
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ihawp</title>
            <script src="p5/p5.min.js"></script>
            <script src="sketch.js"></script>
            <script src="https://kit.fontawesome.com/99a47fae58.js" crossorigin="anonymous"></script>
            <link rel="stylesheet" href="styles.css">
        </head>
        <body>
        <header>
            <div class="twenter">
                <i class="fa-solid fa-star"></i>
                <h1>game</h1>
            </div>
            <nav>
                <a href="game.php">game</a>
                <a href="leaderboard.php">leaderboard</a>
                <a href="php/changeUsername.php">change username</a>
            </nav>
        </header>
<?php } else if ($_SESSION['page'] === 'leaderboard') { ?>
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ihawp</title>
            <script src="https://kit.fontawesome.com/99a47fae58.js" crossorigin="anonymous"></script>
            <link rel="stylesheet" href="styles.css">
        </head>
        <body>
        <header>
            <div class="twenter">
                <i class="fa-solid fa-star"></i>
                <h1>game</h1>
            </div>
            <nav>
                <a href="game.php">game</a>
                <a href="leaderboard.php">leaderboard</a>
                <a href="php/changeUsername.php">change username</a>
            </nav>
        </header>
    <?php }
} else {
    sendHome();
}