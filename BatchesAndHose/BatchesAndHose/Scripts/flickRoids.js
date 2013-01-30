jQuery(document).ready(function () {
    setUp();
    setInterval(animationLoop, 1000 / FPS);
});


function setUp() {
    canvas = document.getElementById("canvas");
    g = canvas.getContext("2d");

    // Set up background
    gradient = g.createLinearGradient(0, HEIGHT, 0, 0);
    gradient.addColorStop(0, "#36A7C7");
    gradient.addColorStop(1, "#0B3158");

    createPlayer("Patrick", "#FFE9B0");
    createPlayer("Chris", "#005500");
    var ast = createAsteroid(players[1]);
    ast.y = HEIGHT;
    ast.x = WIDTH / 2;

    canvas.addEventListener('mousemove', function (evt) {
        var rect = canvas.getBoundingClientRect();
        mouseX = evt.pageX - rect.left;
        mouseY = evt.pageY - rect.top;

        chat.server.move(n, x);
    });

    canvas.addEventListener('mousedown', function (evt) {
        createProjectile(players[n]);
    });
}

function animationLoop() {
    currentWait++;
    
    drawBackground();

    for (var i = 0; i < players.length; i++) {
        updatePlayer(players[i]);
        drawPlayer(players[i]);
    }

    for (var i = projectiles.length - 1; i >= 0; i--) {
        updateProjectile(projectiles[i]);
        if (!projectiles[i].inBounds) {
            projectiles.splice(i, 1);
        } else {
            drawProjectile(projectiles[i]);
        }
    }

    for (var i = asteroids.length - 1; i >= 0; i--) {
        var ast = asteroids[i];
        updateAsteroid(ast);
        if (ast.health <= 0) {
            asteroids.splice(i, 1);
        } else {
            drawAsteroid(ast);
        }
    }

    $("#debugText").text(players[0].stigma + " " + players[1].stigma);
}

var bgGradient;			// Background gradient

function drawBackground() {
    g.fillStyle = gradient;
    g.fillRect(0, 0, WIDTH, HEIGHT);
}

function createPlayer(name, color) {
    var player = {};
    player.name = name;
    player.color = color;
    player.x = WIDTH / 2;
    player.y = 0;
    player.r = 14;
    player.vx = 0;
    player.speed = 8;
    player.leftKeys = [65, 37];
    player.rightKeys = [68, 39];
    player.cannonLength = 20;
    player.theta = Math.PI / 4;
    player.stigma = 0;
    players.push(player);
    return player;
}

function drawPlayer(player) {
    g.fillStyle = player.color;

    g.beginPath();
    g.arc(player.x, HEIGHT - player.y, player.r, 0, Math.PI, true);
    g.closePath();
    g.fill();

    g.fillStyle = "black";

    g.translate(player.x, HEIGHT - player.y);
    g.rotate(-player.theta);

    g.fillRect(0, -3, player.cannonLength, 6);

    g.rotate(player.theta);
    g.translate(-player.x, player.y - HEIGHT);

    g.beginPath();
    g.arc(player.x, HEIGHT - player.y, 6, 0, Math.PI, true);
    g.closePath();
    g.fill();
}

function updatePlayer(player) {

    player.x += player.vx;

    var dx = mouseX - players[n].x;
    var dy = (HEIGHT - mouseY) - players[n].y;

    players[n].theta = Math.atan2(dy, dx);

    if (player.x < 0) player.x = 0;
    if (player.x > WIDTH - player.width) player.x = WIDTH - player.width;
}

function createProjectile(player) {
    var proj = {};
    proj.x = player.x + player.cannonLength * Math.cos(player.theta);
    proj.y = player.y + player.cannonLength * Math.sin(player.theta);
    proj.r = 3;
    proj.speed = 15;
    proj.damage = 4;
    proj.vx = Math.cos(player.theta) * proj.speed;
    proj.vy = Math.sin(player.theta) * proj.speed;
    proj.inBounds = true;
    proj.owner = player;
    projectiles.push(proj);

    return proj;
}

function updateProjectile(proj) {
    proj.x += proj.vx;
    proj.y += proj.vy;

    if (proj.x < -50 || proj.x > WIDTH + 50 || proj.y > HEIGHT + 50 || proj.y < -50) {
        proj.inBounds = false;
    }
}
function drawProjectile(proj) {
    g.fillStyle = proj.owner.color;

    g.beginPath();

    g.arc(proj.x, HEIGHT - proj.y, proj.r, 0, 2 * Math.PI, true);
    g.closePath();
    g.fill();
}

function createAsteroid(player) {
    ast = {};
    ast.width = 64;
    ast.height = 64;
    ast.x = 0;
    ast.y = 0;
    ast.vx = 0;
    ast.vy = 0;
    ast.theta = 0;
    ast.dtheta = 0.05;
    ast.maxHealth = 16;
    ast.health = ast.maxHealth;
    ast.owner = player;
    asteroids.push(ast);
    return ast;
}

function updateAsteroid(ast) {
    ast.vy -= 0.05;
    ast.x += ast.vx;
    ast.y += ast.vy;
    ast.theta += ast.dtheta;

    for (var i = projectiles.length - 1; i >= 0; i--) {
        var proj = projectiles[i];

        if (asteroidContains(ast, proj)) {
            ast.health -= proj.damage;
            if (ast.health <= 0) {
                if (ast.owner == proj.owner) {
                    proj.owner.stigma += 10;
                } else {
                    proj.owner.stigma -= 3;
                }
                splitAsteroid(ast);
            }
            projectiles.splice(i, 1);
        }
    }

    for (var i = 0; i < players.length; i++) {
        var player = players[i];

        if (asteroidContains(ast, player)) {
            player.stigma += ast.width;
            ast.health = 0;
        }
    }

    if (ast.y < -50) {
        ast.health = 0;
    }
}

function asteroidContains(ast, obj) {
    var dx = obj.x - ast.x;
    var dy = obj.y - ast.y;
    var dist = dx * dx + dy * dy;
    return dist <= ast.width * ast.height + obj.r;
}

function splitAsteroid(ast) {
    var child1 = createAsteroid(ast.owner);
    var child2 = createAsteroid(ast.owner);
    child1.x = child2.x = ast.x;
    child1.y = child2.y = ast.y;
    child1.vx = ast.vx - 3;
    child2.vx = ast.vx + 3;
    child1.vy = child2.vy = ast.vy;
    child1.width = child2.width = ast.width / 2;
    child1.height = child2.height = ast.height / 2;
    child1.maxHealth = child2.maxHealth = ast.maxHealth / 2;
}

function drawAsteroid(ast) {

    g.translate(ast.x, HEIGHT - ast.y);
    g.rotate(-ast.theta);
    g.fillStyle = "rgba(100, 0, 100, " + ast.health / ast.maxHealth + ")";
    g.fillRect(-ast.width / 2, -ast.height / 2, ast.width, ast.height);
    g.rotate(ast.theta);
    g.translate(-ast.x, ast.y - HEIGHT);
}

// Key bindings

$(document).keydown(function (event) {
    if (players[n].leftKeys.indexOf(event.which) >= 0) {
        players[n].vx = -players[n].speed;
    }
    if (players[n].rightKeys.indexOf(event.which) >= 0) {
        players[n].vx = players[n].speed;
    }
});

$(document).keyup(function (event) {
    if (players[n].leftKeys.indexOf(event.which) >= 0) {
        players[n].vx = 0;
    }
    if (players[n].rightKeys.indexOf(event.which) >= 0) {
        players[n].vx = 0;
    }
});