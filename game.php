<?php

session_start();

$_SESSION['page'] = 'game';

if (isset($_SESSION['username']) && isset($_SESSION['id'])) {
include 'php/header.php';
?>
<main>
</main>
<section>
    <form id="progressForm">
        <input id="progresss" type="range" min="0" max="100" value="0">
    </form>
</section>
<footer>
    <p>&copy; ihawp 2024</p>
</footer>
</body>
</html>
<?php
} else {
    header('Location: index.html');
}