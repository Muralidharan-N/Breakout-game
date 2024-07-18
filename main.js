// Canvas related variables
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

// Game related variables
var lives = 3;
var gameOver = false;
var paused = false;
var score = 0;
var autoplayToggle = document.getElementById("autoplay");
autoplayToggle.checked = false;

// Ball relates variables
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 1.5;
var dy = -1.5;
var ballRadius = 10;
var maxSpeed = 3.5;
var speedMultiplier = 1;

// Paddle related variables
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;
var paddleY = canvas.height - (paddleHeight + 5);
var rightPressed = false;
var leftPressed = false;
var paddleSpeed = 7;

// Brick related variables
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];
for (c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {
            x: 0,
            y: 0,
            status: 2
        };
    }
}

function draw() {
    if (!paused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (autoplayToggle.checked) {
            autoPlay();
        }
        drawPaddle();
        drawBricks();
        drawBall();
        collisionDetection();
        drawScore();
        drawLives();

        x += dx;
        y += dy;
    }
    if (x + dx > (canvas.width - ballRadius) || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > (canvas.height - (2 * ballRadius))) {

        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            if (Math.abs(dx) < maxSpeed && Math.abs(dy) < maxSpeed) {
                dx *= speedMultiplier;
                dy *= speedMultiplier;

                console.log(dx);
            }
        } else {
            lives--;
            if (!lives) {
                alert("GAME OVER");
                document.location.reload();
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }

        }

    }

    if (lives <= 0) {
        loseMessage.style.display = "block";
    }

    requestAnimationFrame(draw);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();


}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = "#00FFFF";
    ctx.fill();
    ctx.closePath();

    if (rightPressed) {
        if (paddleX + paddleSpeed < canvas.width - paddleWidth) {
            paddleX += paddleSpeed;
        }
    } else if (leftPressed) {
        if (paddleX - paddleSpeed > 0) {
            paddleX -= paddleSpeed;
        }
    }
}

function autoPlay() {
    var newX = x - (paddleWidth / 2);

    if (newX >= 0 && newX <= canvas.width - paddleWidth) {
        paddleX = newX;
    }
}

function drawBricks() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status > 0) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = bricks[c][r].status == 2 ? "blue" : "#dd1e00";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status != 0) {
                if (x > b.x && x < b.x + brickWidth && y - ballRadius > b.y && y - ballRadius < b.y + brickHeight) {
                    dy = -dy;
                    b.status--;

                    if (b.status == 0) {
                        dy = -dy;
                        score++;

                        if (score == brickRowCount * brickColumnCount) {
                            alert("YOU WIN, CONGRATULATIONS!");
                            document.location.reload();
                        }
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function keyDownHandler(e) {
    if (e.keyCode == 39 || e.keyCode == 68) {
        rightPressed = true;
    } else if (e.keyCode == 37 || e.keyCode == 65) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39 || e.keyCode == 68) {
        rightPressed = false;
    } else if (e.keyCode == 37 || e.keyCode == 65) {
        leftPressed = false;
    }
}

function pauseKeyPress(e) {
    if (e.keyCode == 27) {
        paused = !paused;
        console.log(paused);
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        var newPaddleX = relativeX - paddleWidth / 2;

        if (newPaddleX >= 0 && newPaddleX + paddleWidth <= canvas.width) {
            paddleX = newPaddleX;
        }
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("keyup", pauseKeyPress, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
//setInterval(draw, 10);
draw();
