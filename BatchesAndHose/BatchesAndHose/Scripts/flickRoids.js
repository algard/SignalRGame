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

    canvas.addEventListener('mousemove', function (evt) {
        var rect = canvas.getBoundingClientRect();
        mouseX = evt.pageX - rect.left;
        mouseY = evt.pageY - rect.top;
    });

    canvas.addEventListener('mousedown', function (evt) {
        chat.server.shotsFired(n, players[n].theta);
        createProjectile(players[n]);
    });
}

function animationLoop() {
    currentWait++;
    newAsteroid++;

    drawBackground();

    for (var i = 0; i < players.length; i++) {
        updatePlayer(players[i]);
        drawPlayer(players[i]);

    }
    
    if (newAsteroid == 100) {
        for (var i = 0; i < players.length; i++) {
            chat.server.addNewAsteroid(i);
        }
        newAsteroid = 0;
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

    //$("#debugText").text(players[0].stigma + " " + players[1].stigma);
}

var bgGradient;			// Background gradient

function drawBackground() {
    g.fillStyle = gradient;
    g.fillRect(0, 0, WIDTH, HEIGHT);
}

function createPlayer(name, x, index, avatarURL, asteroidURLs) {
    var player = {};
    player.name = name;
    player.color = PLAYER_COLORS[index];
    player.x = x;
    player.y = 10;
    player.r = 14;
    player.vx = 0;
    player.speed = 8;
    player.leftKeys = [65, 37];
    player.rightKeys = [68, 39];
    player.cannonLength = 20;
    player.theta = Math.PI / 4;
    player.stigma = 0;
    player.avatarURL = avatarURL;
    player.asteroidURLs = asteroidURLs;
    player.asteroidIndex = 0;
    
    players[index] = player;
    return player;
}

function drawPlayer(player) {
    g.fillStyle = player.color;

    // Draw player
    g.beginPath();
    g.arc(player.x, HEIGHT - player.y, player.r, 0, Math.PI * 2, true);
    g.closePath();
    g.fill();

    // Draw turret
    g.fillStyle = "black";

    g.translate(player.x, HEIGHT - player.y);
    g.rotate(-player.theta);

    g.fillRect(0, -3, player.cannonLength, 6);

    g.rotate(player.theta);
    g.translate(-player.x, player.y - HEIGHT);

    g.beginPath();
    g.arc(player.x, HEIGHT - player.y, 6, 0, Math.PI * 2, true);
    g.closePath();
    g.fill();
    

}

function updatePlayer(player) {

    player.x += player.vx;

    var dx = mouseX - players[n].x;
    var dy = (HEIGHT - mouseY) - players[n].y;

    players[n].theta = Math.atan2(dy, dx);

    if (player.x < player.r) player.x = player.r;
    if (player.x > WIDTH - player.r) player.x = WIDTH - player.r;
    
    if (player.vx != 0) {
        if (currentWait >= rateLimit) {
            chat.server.move(n, player.vx);
        }
    }
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

function createAsteroid(player, x) {
    ast = {a};
    ast.width = 64;
    ast.height = 64;
    ast.x = x;
    ast.y = 590;
    ast.vx = 0;
    ast.vy = 0;
    ast.theta = 0;
    ast.dtheta = 0.05;
    ast.maxHealth = 16;
    ast.health = ast.maxHealth;
    ast.owner = player;

    var img = new Image();
    
  //  img.onload = function () {
   //     g.drawImage(img, 400, 300);
   // };
    img.src = player.asteroidURLs[player.asteroidIndex++];
    ast.image = img;


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

    g.fillStyle = ast.owner.color;
    g.fillRect(-ast.width / 2, -ast.height / 2, ast.width, ast.height);
    g.drawImage(ast.image, -ast.width / 2 + 3, -ast.height / 2 + 3, ast.width - 6, ast.height - 6);
    
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