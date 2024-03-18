let position;
let velocity;
let progressBar;
let rectSize = null;
let enemiesCount = 0;
let totalEnemiesCount = 350;
let enemies = [];
let powerups = [];
let powerCount =0;
let images = [];
let statsUploaded = false;
let enemySize = null;
let iterationn =0;

// Load images
function preload() {
    images = {
        1: loadImage("images/1.jpg"),
        2: loadImage("images/2.jpg"),
        3: loadImage("images/3.jpg"),
        4: loadImage("images/4.jpg"),
        5: loadImage("images/5.jpg"),
        6: loadImage("images/6.webp"),
        7: loadImage("images/7.jpg"),
        8: loadImage("images/8.png"),
        9: loadImage("images/9.jpg"),
        10: loadImage("images/10.webp"),
        'heart': loadImage("images/heart.png")
    }
    font = loadFont('fonts/LeagueSpartan-Bold.ttf');
}

// Reset stats when the player loses (for if they decide to play again)
function resetStats() {
    player.lives = 3;
    player.savedLevel = 0;
    resetPlayerPosition();
    totalEnemiesCount = 0;
    resetEnemies();
    resetPowerups();
    statsUploaded = false;
}

// Canvas mousepressed call
function mousePressedd() {
    if (player.level > 0) {
        player.mobileUpdate(mouseX, mouseY);
    }
    if (mouseButton === LEFT) {
        switch (player.level) {
            case ('menu'):
                changePlayerLevel(1);
                break;
            case ('respawn'):
                changePlayerLevel(player.savedLevel);
                break;
            case ('between'):
                changePlayerLevel(player.savedLevel + 1);
                break;
            case ('lose'):
                changePlayerLevel('menu');
                break;
            default:
                player.mobileUpdate(mouseX, mouseY);
                break;
        }
    }
}

// WASD tracking && Velocity adding/removing
function keyPressed() {
    if (keyCode === 87) {
        velocity.y = width*(-0.01166666666667);
    } else if (keyCode === 83) {
        velocity.y = width*(0.01166666666667);
    } else if (keyCode === 65) {
        velocity.x = width*(-0.01166666666667);
    } else if (keyCode === 68) {
        velocity.x = width*(0.01166666666667);
    }
}
function keyReleased() {
    if (keyCode === 87 || keyCode === 83) {
        velocity.y = 0;
    } else {
        velocity.x = 0;
    }
}

// Display the menu screen
function runMenu() {
    resetStats();
    textAlign('center');
    textSize(width*0.06666666666666666667);
    text("welcome to the game!", width / 2, height / 2);
    textSize(width*0.05);
    text("press anywhere to begin.", width / 2, height / 1.7);
    text("Use WASD or press your screen", width / 2, height / 1.3);
    text("to move around", width / 2, height / 1.2);
}
// Display the respawn screen
function runRespawn() {
    removeProgressBar();
    resetEnemies();
    resetPlayerPosition();
    resetPowerups();

    textAlign('center');
    textSize(width*0.06666666666666666667);
    text("you are respawning!", width / 2, height / 2);
    textSize(width*0.05);
    text("press anywhere to continue level.", width / 2, height / 1.7);
}

function removeProgressBar() {
    if (progressBar) {
        progressBar.remove();
    }
}
function resetEnemies() {
    enemies = [];
    enemiesCount = 0;
    enemySize = width*0.033333333333333;
}
function resetPlayerPosition() {
    position = createVector(width / 2, height / 2);
    velocity = createVector(0, 0);
}
function resetPowerups() {
    powerups = [];
    powerCount =0;
    player.currentPowerup = null;
}

// Adds last game stats to leaderboard
function addToLeaderboard() {
    let w = {
        'level_reached': player.savedLevel,
        'total_enemies': totalEnemiesCount
    }
    ajaxGETData('php/leaderboardUpload.php', w)
        .then(response=> {
            if (response.response) {
                return true;
            }
        })
        .catch(error => {
            console.log(error);
        })
}
function ajaxGETData(url, data) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        if (data) {
            url += '?' + Object.keys(data).map(key => key + '=' + encodeURIComponent(data[key])).join('&');
        }
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response);
                } else {
                    reject(xhr.statusText);
                }
            }
        };
        xhr.send();
    });
}


// Diplay the lose screen
// Runs resetStats()
function runLose() {
    removeProgressBar();

    textAlign('center');
    textSize(width*0.06666666666666666667);
    text("you lose!", width / 2, height / 2);
    textSize(width*0.05);
    text("click anywhere to go back to menu.", width / 2, height / 1.7);
    text("Level Reached: "+player.savedLevel, width / 2, height / 1.2);
    text("Enemies Defeated: "+totalEnemiesCount, width / 2, height / 1.1);

    if (statsUploaded === false) {
        statsUploaded = true;
        addToLeaderboard();
    }
}
// Display the between screen
// Resets enemies and player position
function runBetween() {
    removeProgressBar();
    resetEnemies();
    resetPlayerPosition();
    resetPowerups();

    textAlign('center');
    textSize(width*0.06666666666666666667);
    text("you beat level "+player.savedLevel+", congratulations!", width / 2, height / 2);
    textSize(width*0.05);
    text("click to begin next level.", width / 2, height / 1.7);
}

function addEnemies() {
    if (player.level > 0 && enemiesCount <= 7) {
        for (let i = 0; i < 5;) {
            setTimeout(() => {
                enemies.push(new Enemy());
                enemiesCount += 1;
            }, 100);
            i++;
        }
    }
}

function addUI() {
    removeProgressBar();
    textAlign('center');

    let w =
    progressBar = createSlider(((player.level-1)*(175)) / ((player.level-1)*(175)), (player.level * 175) / (player.level * 175), ((totalEnemiesCount) / (player.level * 175)) - (totalEnemiesCount / ((player.level - 1)*175)), 0);
    console.log((player.level - 1) * 175);
    console.log(player.level*175);
    console.log(totalEnemiesCount/(player.level * 175));
    progressBar.id = 'wow';
    progressBar.position(windowWidth / 2 - 170, windowHeight / 2 - 320);
    progressBar.style('width', '20vw');
    progressBar.style('background-color', 'grey');
    progressBar.style('color', 'black');

    // UI
    textSize(width*0.06666666666666666667);
    for (let i = 0 ; i < player.lives; i++) {
        let x = 23+i*(player.lives+30);
        let y = height * (580/600);
        image(images['heart'], x, y, width*(0.05), width*(0.05));
    }
    text("Level "+player.level, width / 1.2, height / 1.02);
}

function addPowerup() {
    if (player.level > 0 && powerCount < 1 && totalEnemiesCount < 175*player.level - 50) {
        powerCount =1;
        setTimeout(() => {
            powerups.push(new Powerup());
        }, 10000);
    }
}

// Run a level
function runLevel() {
    // Update position
    position.add(velocity);
    player.checkPosition();

    // functioned functionality
    addUI();

    if (enemies.length > 0) {
        for (let i = 0; i < enemies.length; i++) {
            if (enemies[i].update()) {
                enemiesCount -=1;
            } else {
                enemies[i].show();
                if (enemies[i].checkInterjection()) {
                    player.savedLevel = player.level;
                    player.lives = player.lives -1;
                    if (player.lives < 0){
                        player.savedLevel = player.level;
                        changePlayerLevel('lose');
                    } else {
                        changePlayerLevel('respawn');
                    }
                }
            }
        }
    }

    addEnemies();

    // Create new enemies based on variable values


    if (powerups.length > 0) {
        for (let i = 0; i < powerups.length; i++) {
            if (powerups[i].update()) {
                powerCount -= 1;
            } else {
                if (!powerups[i].removed) {
                    powerups[i].show();
                }
                if (powerups[i].checkInterjection() && !powerups[i].removed) {
                    player.currentPowerup = powerups[i];
                }
            }
        }
    }

    if (player.currentPowerup != null && !player.currentPowerup.removed) {
        switch (player.currentPowerup.type) {
            case('life'):
                player.currentPowerup.giveLife();
                break;
            case('breakthrough'):
                player.currentPowerup.makeInvincible();
                break;
        }
    } else {
        addPowerup();
    }

    // Check if the level has been beaten. (the threshold is determined with math so that the game in theory is exponential and could be played forever)
    if (totalEnemiesCount >= player.level*175){
        player.savedLevel = player.level;
        player.lastEnemyCount = totalEnemiesCount;
        changePlayerLevel('between');
    }
}


// Player Class
class Player {
    constructor() {
        this.level = 'menu';
        this.lives = 3;
        this.savedLevel = 0;

        this.currentPowerup = null;
    }

    // Check the current player position && disallow the player from exiting the canvas
    checkPosition() {
        if (position.x >= (width - 13.5)) {
            if (position.y <= 13.5) {
                rect((position.x = (width - 13.5)) - rectSize / 2, (position.y=13.5) - rectSize / 2, rectSize, rectSize);
            } else if (position.y >= (width - 13.5)) {
                rect((position.x = (width - 13.5)) - rectSize / 2, (position.y=(width - 13.5)) - rectSize / 2, rectSize, rectSize);
            } else {
                rect((position.x = (width - 13.5)) - rectSize / 2, position.y - rectSize / 2, rectSize, rectSize);
            }
        }
        if (position.x <= 13.5) {
            rect((position.x = 13.5) - rectSize / 2, position.y - rectSize / 2, rectSize, rectSize);
        }
        if (position.y <= 13.5) {
            rect(position.x - rectSize / 2, (position.y = 13.5) - rectSize / 2, rectSize, rectSize);
        }
        if (position.y >= (width - 13.5)) {
            rect(position.x - rectSize / 2, (position.y = (width - 13.5)) - rectSize / 2, rectSize, rectSize);
        }
        rect(position.x - rectSize / 2, position.y - rectSize / 2, rectSize, rectSize);
    }

    // Move the player position when the user presses on the screen (allow users to play on mobile)
    mobileUpdate(mouseX, mouseY) {
        let x = mouseX - position.x;
        let y = mouseY - position.y;
        let distance = Math.sqrt(x * x + y * y);

        if (distance > 10) {
            let velocityMultiplier = (width*0.01166666666667) / distance;

            velocity.x = velocityMultiplier * x;
            velocity.y = velocityMultiplier * y;
        } else {
            velocity.x = 0;
            velocity.y = 0;
        }
    }
}

// Enemy Class
class Enemy {
    constructor() {
        this.removed = false;
        let velFirst = width*(int(40 * Math.pow(player.level, -0.9) * (player.level / 10))/600);
        let velSecond = width*(int(130 * Math.pow(player.level, -0.9) * (player.level / 10))/600);

        // will reduce later, just doing other things!
        if (player.level % 2 === 0) {
            if (enemiesCount % 2) {
                this.vel = createVector(0, random(velFirst,velSecond));
                this.pos = createVector(random(width - (width*0.0225)), random((-200, -400)));

                this.travel = 'down';
            } else {
                this.vel = createVector(0, random(-velFirst,-velSecond));
                this.pos = createVector(random(width - (width*0.0225)), random(height, height+400));

                this.travel = 'up';
            }
        } else {
            if (enemiesCount % 2) {
                this.vel = createVector(random(-velFirst,-velSecond), 0);
                this.pos = createVector(random(width, width+400), random(width - (width*0.0225)));

                this.travel = 'right';
            } else {
                this.vel = createVector(random(velFirst,velSecond), 0);
                this.pos = createVector(random(-200,-400), random(width - (width*0.0225)));

                this.travel = 'left';
            }
        }



        this.img = int(random(1,9));
        this.size = enemySize;
    }
    update() {
        switch (this.travel) {
            case ('down'):
                return this.checkDown();
            case ('up'):
                return this.checkUp();
            case ('left'):
                return this.checkLeft();
            case ('right'):
                return this.checkRight();
        }
    }
    checkDown() {
        if (this.pos.y > height + this.size) {
            enemies.splice(enemies.indexOf(this), 1);
            this.destroy();
            return true;
        } else {
            this.pos.add(this.vel);
            return false;
        }
    }
    checkUp() {
        if (this.pos.y < height-height + this.size) {
            enemies.splice(enemies.indexOf(this), 1);
            this.destroy();
            return true;
        } else {
            this.pos.add(this.vel);
            return false;
        }
    }
    checkLeft() {
        if (this.pos.x > width + this.size) {
            enemies.splice(enemies.indexOf(this), 1);
            this.destroy();
            return true;
        } else {
            this.pos.add(this.vel);
            return false;
        }
    }
    checkRight() {
        if (this.pos.x < width-width + this.size) {
            enemies.splice(enemies.indexOf(this), 1);
            this.destroy();
            return true;
        } else {
            this.pos.add(this.vel);
            return false;
        }
    }
    destroy() {
        totalEnemiesCount += 1;
        this.removed = true;
    }
    show() {
        imageMode(CENTER);
        image(images[this.img], this.pos.x, this.pos.y, enemySize, enemySize);
    }
    checkInterjection() {
        return (((this.size)*(-1.4)) <= (this.pos.x - position.x) && (this.pos.x - position.x) <= ((this.size)*1.4) && ((this.size)*(-1.4)) <= (this.pos.y - position.y) && (this.pos.y - position.y) <= ((this.size)*(1.4)));
    }
}

class Powerup {
    constructor() {
        const types = {
            0: {
                'type': 'breakthrough',
                'img': 10
            },
            1: {
                'type': 'life',
                'img': 'heart'
            }
        }
        let k = int(random(2));
        this.type = types[k]['type'];
        this.duration = int(random(10000, 15000));
        this.size = width * 0.08333333333;
        this.img = types[k]['img'];


        this.removed = false;
        let velFirst = width * (int(40 * Math.pow(player.level, -0.9) * (player.level / 10)) / 600);
        let velSecond = width * (int(80 * Math.pow(player.level, -0.9) * (player.level / 10)) / 600);
        this.vel = createVector(0, random(velFirst, velSecond));
        this.pos = createVector(random(width - (width * 0.0225)), random((-200, -400)));
    }

    update() {
        if (this.pos.y > height + this.size) {
            powerups.splice(powerups.indexOf(this), 1);
            this.destroy();
            return true;
        } else {
            this.pos.add(this.vel);
            return false;
        }
    }

    destroy() {
        this.removed = true;
    }

    show() {
        imageMode(CENTER);
        if (this.size !== 0) {
            image(images[this.img], this.pos.x, this.pos.y, this.size, this.size);
        }
    }

    checkInterjection() {
        return (((this.size) * (-1) <= (this.pos.x - position.x) && (this.pos.x - position.x) <= ((this.size) * 1) && ((this.size) * (-1)) <= (this.pos.y - position.y) && (this.pos.y - position.y) <= ((this.size) * (1))));
    }

    makeInvincible() {
        enemySize = 0.000000000000000000000000000000000000000000000000000000000000001;
        enemies = [];
        enemiesCount = 0;
        this.destroy();
        setTimeout(() => {
            enemySize = width*0.033333333333333;
        }, 5000);
    }

    giveLife() {
        player.lives += 1;
        this.destroy();
    }
}

// Lives/Level Shorthands
function changePlayerLevel(level) {
    player.level = level;
}

let player = new Player();
function setup() {
    frameRate(30);
    if (windowWidth < 768) {
        createCanvas(windowWidth,windowWidth).mousePressed(mousePressedd);
    } else {
        createCanvas(windowWidth/3,windowWidth/3).mousePressed(mousePressedd);
    }
    rectSize = width*0.04;
    enemySize = width*0.03333333333333333333333333;
    // player position and velocity
    resetPlayerPosition();
    textFont(font);
}
function draw() {
    iterationn += 1;
    background('#12ace0');
    switch (player.level) {
        case('menu'):
            runMenu();
            break;
        case('respawn'):
            runRespawn();
            break;
        case('lose'):
            runLose();
            break;
        case('between'):
            runBetween();
            break;
        default:
            runLevel();
            break;
    }
}

window.addEventListener('resize', function() {
   setup();
});