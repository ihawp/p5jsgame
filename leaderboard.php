<?php

session_start();
$_SESSION['page'] = 'leaderboard';

if (isset($_SESSION['username']) && isset($_SESSION['id'])) {
    include 'php/header.php';
    ?>

    <main>
        <?php

        $w = STMT($conn, 'SELECT * FROM leaderboard WHERE id > ? ORDER BY total_enemies DESC LIMIT 10', ['i'], [0]);

        if (isset($w['result'][0][0])) {
            $i =0;
            foreach ($w['result'] as $key){
                $i++;
                if ($i === 1) {
                    ?>
                    <div class="leaderboard first">
                    <?php
                } else if ($i === 2) {
                    ?>
                        <div class="leaderboard second">
                            <?php
                } else if ($i === 3) {
                ?>
                <div class="leaderboard third">
                <?php
                } else {
                    ?>
                        <div class="leaderboard">
                        <?php
                }
                ?>
                    <p class="number">#<?php echo $i ?></p>
                    <h1><?php echo " ".$key[1] ?></h1>
                    <div class="level">
                        <p>Level Reached:<?php echo " ".$key[2] ?></p>
                    </div>
                    <div class="enemies">
                        <p>Enemies Defeated:<?php echo " ".$key[3] ?></p>
                    </div>
                </div>

                <?php
            }
        }

        ?>
    </main>
    <footer>
        <p>&copy; ihawp 2024</p>
    </footer>
    </body>
    </html>
    <?php
} else {
    header('Location: index.html');
}