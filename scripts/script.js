const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

canvas.id = "canvas";
canvas.width = 700;
canvas.height = 800;
const canvasColor = "#000000";

document.body.appendChild(canvas);

const paddle = {
    color: "#fff",
    width: 100,
    height: 10,
};
const opponent = {
    color: "#f00",
    x: canvas.width / 2 - paddle.width / 2,
    y: 0,
    speedX: 5,
    rangeLeft: 0,
    rangeRight: canvas.width - paddle.width,
};
const player = {
    color: "#00f",
    x: canvas.width / 2 - paddle.width / 2,
    y: canvas.height - paddle.height,
    arrowKeyValue: 20,
};

const ball = {
    color: "#0f0",
    radius: 8,
    x: canvas.width / 2,
    y: canvas.height / 2,
    speedY: 10,
    speedX: 0,
    angleMaker: 6,
};
const score = {
    color: "#fff",
    maxScore: 0,
    opponent: {
        value: 0,
        x: 20,
        y: canvas.height / 2 - 40,
    },
    player: {
        value: 0,
        x: 20,
        y: canvas.height / 2 + 40,
    },
};

// game variables
let falling;
let gameAnimation;
let isGameOver = false;
let userWins = false;

const renderCanvas = () => {
    // console.log(ball.speedY);

    // clears previous
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // paints new color
    ctx.fillStyle = canvasColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // center line
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    // paddles
    ctx.fillStyle = opponent.color;
    ctx.fillRect(opponent.x, opponent.y, paddle.width, paddle.height);
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, paddle.width, paddle.height);
    // console.log(player.x);

    // scores
    ctx.fillStyle = score.color;
    ctx.font = "20px Monospace";
    ctx.fillText(score.opponent.value, score.opponent.x, score.opponent.y);
    ctx.fillText(score.player.value, score.player.x, score.player.y);

    // ball
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    timedActions();
};

// functions that are time dependendent
const timedActions = () => {
    ball.y += ball.speedY;
    ball.x += ball.speedX;
    // computer play
    computerPlay();
};

// computer playing algo
const computerPlay = () => {
    if (ball.x > opponent.x + paddle.width / 2) opponent.x += opponent.speedX;
    if (ball.x < opponent.x + paddle.width / 2) opponent.x -= opponent.speedX;
    if (opponent.x < opponent.rangeLeft) opponent.x = opponent.rangeLeft;
    if (opponent.x > opponent.rangeRight) opponent.x = opponent.rangeRight;
};

// boundary conditions
const checkBoundary = () => {
    // paddle in X direction
    const opponentCheckX =
        ball.x >= opponent.x && ball.x <= opponent.x + paddle.width;
    const playerCheckX =
        ball.x >= player.x && ball.x <= player.x + paddle.width;

    // paddle in Y direction
    const opponentCheckY = ball.y <= opponent.y + paddle.height;
    const playerCheckY = ball.y >= player.y;

    // only run if ball touches paddle level in Y direction
    if (opponentCheckY) {
        if (opponentCheckX) {
            // reverses the direction of ball in Y direction
            ball.speedY *= -1;
            // gives speed in x to ball
            ball.speedX =
                (ball.x - (opponent.x + paddle.width / 2)) / ball.angleMaker;
            hit.play();
        } else {
            score.player.value++;
            userScore.play();
            terminateGame();
            return;
        }
    } else if (playerCheckY) {
        if (playerCheckX) {
            // reverses the direction of ball in Y direction
            ball.speedY *= -1;
            // gives speed in x to ball
            ball.speedX =
                (ball.x - (player.x + paddle.width / 2)) / ball.angleMaker;
            hit.play();
        } else {
            score.opponent.value++;
            comScore.play();
            terminateGame();
            return;
        }
    }

    // only run if ball touches the walls
    if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
        ball.speedX *= -1;
        wall.play();
    }
};

const getMouseActions = (e) => {
    // left offset handler
    if (e.offsetX < paddle.width / 2) {
        player.x = 0;
        return;
    }
    // right offset handler
    else if (e.offsetX + paddle.width / 2 >= canvas.width) {
        player.x = canvas.width - paddle.width;
        return;
    }

    player.x = e.offsetX - paddle.width / 2;
};

const getKeyboardActions = (e) => {
    const keyCode = e.code;
    switch (keyCode) {
        case "ArrowRight":
            player.x += player.arrowKeyValue;
            break;
        case "ArrowLeft":
            player.x -= player.arrowKeyValue;
            break;
        default:
            break;
    }
    if (player.x < 0) {
        player.x = 0;
        return;
    } else if (player.x + paddle.width >= canvas.width) {
        player.x = canvas.width - paddle.width;
        return;
    }
};

const terminateGame = () => {
    // console.log("Game Ended");
    window.cancelAnimationFrame(gameAnimation);
    clearInterval(falling);
    renderCanvas();
    checkWin();
};

// checks winner
const checkWin = () => {
    if (score.opponent.value === score.maxScore || score.player.value === score.maxScore) {
        if (score.opponent.value > score.player.value) {
            userWins = false;
        } else {
            userWins = true;
        }
        displayFinalMessage();
        return;
    } else {
        setTimeout(restart, 2000);
    }
};

const resetValues = () => {
    // console.log("RESET")
    opponent.x = canvas.width / 2 - paddle.width / 2;
    player.x = canvas.width / 2 - paddle.width / 2;
    ball.x = canvas.width / 2 - ball.radius;
    ball.y = canvas.height / 2;
    ball.speedX = 0;
};

const restart = () => {
    // console.log("RESTARTED")
    resetValues();
    gamePlay();
};

const gamePlay = () => {
    gameAnimation = requestAnimationFrame(gamePlay);
    renderCanvas();
    checkBoundary();
};

canvas.addEventListener("mousemove", getMouseActions);
window.addEventListener("keydown", getKeyboardActions);

// renders first paint
renderCanvas();