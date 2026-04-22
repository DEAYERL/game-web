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

function draw() {
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    stars.forEach(s => {
        ctx.fillStyle = 'rgba(255,255,255,0.8)'
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