function crearAsteroide() {
    const radio = 20 + Math.random() * 30
    const lados = 5 + Math.floor(Math.random() * 4)
    const lado = Math.floor(Math.random() * 4)

    let x, y
    if (lado === 0) { x = Math.random() * canvas.width; y = -50 }
    else if (lado === 1) { x = canvas.width + 50; y = Math.random() * canvas.height }
    else if (lado === 2) { x = Math.random() * canvas.width; y = canvas.height + 50 }
    else { x = -50; y = Math.random() * canvas.height }

    const dx = canvas.width / 2 - x
    const dy = canvas.height / 2 - y
    const angulo = Math.atan2(dy, dx)
    const velocidad = 1 + Math.random() * 1.5

    return {
        x, y,
        radio,
        vx: Math.cos(angulo) * velocidad,
        vy: Math.sin(angulo) * velocidad,
        rotacion: 0,
        velRotacion: (Math.random() - 0.5) * 0.03,
        puntos: Array.from({ length: lados }, (_, i) => {
            const ang = (i / lados) * Math.PI * 2 + (Math.random() - 0.5) * 0.8
            const r = 0.4 + Math.random() * 0.6
            return { x: Math.cos(ang) * r, y: Math.sin(ang) * r }
        })
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

function update() {
    if (gameState !== 'playing') return

    if (keys['ArrowLeft']) ship.angle -= 0.05
    if (keys['ArrowRight']) ship.angle += 0.05
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

    asteroids.forEach(a => {
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
        if (p.life <= 0) particles.splice(i, 1)
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

document.addEventListener('keydown', (e) => {
    keys[e.code] = true
    if (e.code === 'Enter' && gameState === 'menu') gameState = 'playing'
    if (e.code === 'Space' && gameState === 'playing') disparar()
    if (e.code === 'Enter' && gameState === 'gameover') reiniciarJuego()
})

document.addEventListener('keyup', (e) => {
    keys[e.code] = false
})

crearEstrellas()
asteroids = Array.from({ length: 8 }, crearAsteroide)
gameLoop()