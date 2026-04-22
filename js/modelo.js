const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let gameState = 'menu'
let score = 0
let menuTime = 0
let lastShotTime = 0
const shotCooldown = 300
let spawnTimer = 0
const spawnInterval = 120

let keys = {}

let ship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    angle: 0,
    vx: 0,
    vy: 0
}

let bullets = []
let asteroids = []
let particles = []
let stars = []