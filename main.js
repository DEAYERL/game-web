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
function crearAsteroide() {
    const radio = 20 + Math.random() * 30;
    const lados = 5 + Math.floor(Math.random() * 4);
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radio: radio,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        rotacion: 0,
        velRotacion: (Math.random() - 0.5) * 0.03,
        puntos: Array.from({ length: lados }, (_, i) => {
            const angulo = (i / lados) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
            const r = 0.4 + Math.random() * 0.6;
            return { x: Math.cos(angulo) * r, y: Math.sin(angulo) * r };
        })
    };
}

asteroids = Array.from({ length: 8 }, crearAsteroide);

function update() {
    asteroids.forEach(a => {
        a.x += a.vx;
        a.y += a.vy;
        a.rotacion += a.velRotacion;

        if (a.x < -a.radio) a.x = canvas.width + a.radio;
        if (a.x > canvas.width + a.radio) a.x = -a.radio;
        if (a.y < -a.radio) a.y = canvas.height + a.radio;
        if (a.y > canvas.height + a.radio) a.y = -a.radio;
    });
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

    asteroids.forEach(a => {
        ctx.save();
        ctx.translate(a.x, a.y);
        ctx.rotate(a.rotacion);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        a.puntos.forEach((p, i) => {
            i === 0
                ? ctx.moveTo(p.x * a.radio, p.y * a.radio)
                : ctx.lineTo(p.x * a.radio, p.y * a.radio);
        });
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    });
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
