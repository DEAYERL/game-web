const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let gameState = 'menu'
let ship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    angle: 0,
    vx: 0,
    vy: 0
}
let bullets = []
let asteroids = []
let keys = {}
let score = 0
let lastShotTime = 0
let shotCooldown = 300 
let menuTime = 0
let particles = []
let spawnTimer = 0
let spawnInterval = 120
let stars = []

document.addEventListener('keydown', (e) => {
    keys[e.code] = true

    if (e.code === 'Enter' && gameState === 'menu') {
    gameState = 'playing'
    }

    if (e.code === 'Space' && gameState === 'playing') {
    disparar()
    }
    if (e.code === 'Enter' && gameState === 'gameover') {
    reiniciarJuego()
    }
})

document.addEventListener('keyup', (e) => {
    keys[e.code] = false
})

function crearAsteroide() {
    const radio = 20 + Math.random() * 30
    const lados = 5 + Math.floor(Math.random() * 4)
    const lado = Math.floor(Math.random() * 4)

    let x, y

    if (lado === 0) { // arriba
        x = Math.random() * canvas.width
        y = -50
    } else if (lado === 1) { // derecha
        x = canvas.width + 50
        y = Math.random() * canvas.height
    } else if (lado === 2) { // abajo
        x = Math.random() * canvas.width
        y = canvas.height + 50
    } else { // izquierda
        x = -50
        y = Math.random() * canvas.height
    }

    const dx = canvas.width / 2 - x
    const dy = canvas.height / 2 - y
    const angulo = Math.atan2(dy, dx)
    const velocidad = 1 + Math.random() * 1.5
    
    return {
        x: x,
        y: y,
        radio: radio,
        vx: Math.cos(angulo) * velocidad,
        vy: Math.sin(angulo) * velocidad,
        rotacion: 0,
        velRotacion: (Math.random() - 0.5) * 0.03,
        puntos: Array.from({ length: lados }, (_, i) => {
            const ang = (i / lados) * Math.PI * 2 + (Math.random() - 0.5) * 0.8
            const r = 0.4 + Math.random() * 0.6
            return {
                x: Math.cos(ang) * r,
                y: Math.sin(ang) * r
            }
        })
    }
}

function crearEstrellas() {
    for (let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 1 + Math.random() * 2 
        })
    }
}

function crearExplosion(x, y) {
    for (let i = 0; i < 15; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            life: 30
        })
    }
}

function draw() {
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    stars.forEach(s => {
        ctx.fillStyle = "rgba(255,255,255,0.8)"
        ctx.fillRect(s.x, s.y, s.size, s.size)
    })

    ctx.fillStyle = 'white'
    ctx.font = '20px monospace'
    ctx.textAlign = 'left'
    ctx.fillText('Puntaje: ' + score, 20, 40)

    ctx.save()
    ctx.translate(ship.x, ship.y)
    ctx.rotate(ship.angle)

    ctx.strokeStyle = 'white'
    ctx.beginPath()
    ctx.moveTo(0, -20)
    ctx.lineTo(-15, 20)
    ctx.lineTo(15, 20)
    ctx.closePath()
    ctx.stroke()

    ctx.restore()

    asteroids.forEach(a => {
        ctx.save()
        ctx.translate(a.x, a.y)
        ctx.rotate(a.rotacion)
        ctx.strokeStyle = '#fff'
        ctx.beginPath()
        a.puntos.forEach((p, i) => {
            i === 0
                ? ctx.moveTo(p.x * a.radio, p.y * a.radio)
                : ctx.lineTo(p.x * a.radio, p.y * a.radio)
        })
        ctx.closePath()
        ctx.stroke()
        ctx.restore()
    })

    particles.forEach(p => {
    ctx.fillStyle = `rgba(255, ${100 + Math.random() * 155}, 0, ${p.life / 30})`
    ctx.beginPath()
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
    ctx.fill()
})

    bullets.forEach(b => {
        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.arc(b.x, b.y, 3, 0, Math.PI * 2)
        ctx.fill()
    })
}

function drawMenu() {
    menuTime += 0.05

    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const scale = 1 + Math.sin(menuTime) * 0.05

    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2 - 40)
    ctx.scale(scale, scale)

    ctx.fillStyle = 'white'
    ctx.font = 'bold 64px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('ASTEROIDS', 0, 0)

    ctx.restore()
    if (Math.floor(menuTime * 2) % 2 === 0) {
        ctx.fillStyle = '#aaa'
        ctx.font = '24px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('Presiona ENTER para jugar', canvas.width / 2, canvas.height / 2 + 40)
    }
}

function drawGameOver() {
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = 'red'
    ctx.font = 'bold 72px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 60)

    ctx.fillStyle = 'white'
    ctx.font = '32px monospace'
    ctx.fillText('Puntaje: ' + score, canvas.width / 2, canvas.height / 2 + 10)

    ctx.fillStyle = '#aaa'
    ctx.font = '22px monospace'
    ctx.fillText('Presiona ENTER para reiniciar', canvas.width / 2, canvas.height / 2 + 60)
}

function update() {
    if (gameState !== 'playing') return

    if (keys['ArrowLeft']) {
    ship.angle -= 0.05
    }
    if (keys['ArrowRight']) {
    ship.angle += 0.05
    }

    if (keys['ArrowUp']) {
    ship.vx += Math.cos(ship.angle - Math.PI / 2) * 0.1
    ship.vy += Math.sin(ship.angle - Math.PI / 2) * 0.1
    }

    ship.x += ship.vx
    ship.y += ship.vy

    ship.vx *= 0.99
    ship.vy *= 0.99

    if (ship.x < 0) ship.x = canvas.width
    if (ship.x > canvas.width) ship.x = 0
    if (ship.y < 0) ship.y = canvas.height
    if (ship.y > canvas.height) ship.y = 0

    asteroids.forEach((a) => {
    a.x += a.vx
    a.y += a.vy
    a.rotacion += a.velRotacion

    if (a.x < -a.radio) a.x = canvas.width + a.radio
    if (a.x > canvas.width + a.radio) a.x = -a.radio
    if (a.y < -a.radio) a.y = canvas.height + a.radio
    if (a.y > canvas.height + a.radio) a.y = -a.radio
    })
    bullets.forEach((b, i) => {
    b.x += Math.cos(b.angle - Math.PI / 2) * b.speed
    b.y += Math.sin(b.angle - Math.PI / 2) * b.speed

    if (b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) {
        bullets.splice(i, 1)
    }
    })
    checkColisiones()

    particles.forEach((p, i) => {
    p.x += p.vx
    p.y += p.vy
    p.life--

    if (p.life <= 0) {
        particles.splice(i, 1)
    }
    })

    spawnTimer++

    if (spawnTimer > spawnInterval) {
    asteroids.push(crearAsteroide())
    spawnTimer = 0
    }

    stars.forEach(s => {
    s.y += s.size * 0.3

    if (s.y > canvas.height) {
        s.y = 0
        s.x = Math.random() * canvas.width
    }
    })
}

function checkColisiones() {
    for (let i = bullets.length - 1; i >= 0; i--) {
    for (let j = asteroids.length - 1; j >= 0; j--) {
        const b = bullets[i]
        const a = asteroids[j]
        const dx = b.x - a.x
        const dy = b.y - a.y
      const distancia = Math.sqrt(dx * dx + dy * dy)

        if (distancia < a.radio) {
        crearExplosion(a.x, a.y)
        bullets.splice(i, 1)
        asteroids.splice(j, 1)
        score += 10
        break
        }
    }
    }

    for (let j = 0; j < asteroids.length; j++) {
    const a = asteroids[j]
    const dx = ship.x - a.x
    const dy = ship.y - a.y
    const distancia = Math.sqrt(dx * dx + dy * dy)

    if (distancia < a.radio + 15) {
        gameState = 'gameover'
        break
    }
    }
}

function disparar() {
    const ahora = Date.now()

    if (ahora - lastShotTime < shotCooldown) return

    lastShotTime = ahora

    bullets.push({
        x: ship.x,
        y: ship.y,
        angle: ship.angle,
        speed: 5
    })
}

function reiniciarJuego() {
    ship.x = canvas.width / 2
    ship.y = canvas.height / 2
    ship.angle = 0
    ship.vx = 0
    ship.vy = 0
    bullets = []
    asteroids = Array.from({ length: 8 }, crearAsteroide)
    score = 0
    gameState = 'playing'
}

function gameLoop() {
    if (gameState === 'menu') {
    drawMenu()
    } else if (gameState === 'playing') {
    update()
    draw()
    } else if (gameState === 'gameover') {
    drawGameOver()
    }
    requestAnimationFrame(gameLoop)
}

crearEstrellas()
asteroids = Array.from({ length: 8 }, crearAsteroide)
gameLoop()
