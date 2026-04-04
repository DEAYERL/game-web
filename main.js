const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameState = "playing";

let ship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    angle: 0
};

let bullets = [];
let asteroids = [];

function update() {

}

function draw() {
    ctx.fillStyle = "rgb(150, 160, 59)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(ship.x, ship.y - 20);
    ctx.lineTo(ship.x - 15, ship.y + 20);
    ctx.lineTo(ship.x + 15, ship.y + 20);
    ctx.closePath();
    ctx.stroke();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();