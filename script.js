const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let playerImg = new Image();
playerImg.src = "vlada.jpg";

let enemyImg = new Image();
enemyImg.src = "pavlo.jpg";

let gameOver = false;

let player = { x: 135, y: 410, w: 50, h: 50 };
let bullets = [];
let enemies = [];

let moveLeft = false;
let moveRight = false;
let shooting = false;

function spawnEnemy() {
  enemies.push({
    x: Math.random() * (canvas.width - 50),
    y: -60,
    w: 50,
    h: 50,
    speed: 1.8,
  });
}

function drawPlayer() {
  ctx.drawImage(playerImg, player.x, player.y, player.w, player.h);
}

function drawEnemies() {
  enemies.forEach(e => {
    ctx.drawImage(enemyImg, e.x, e.y, e.w, e.h);
  });
}

function drawBullets() {
  bullets.forEach(b => {
    ctx.fillStyle = "yellow";
    ctx.fillRect(b.x, b.y, b.w, b.h);
  });
}

function shootBullet() {
  bullets.push({ x: player.x + player.w / 2 - 2, y: player.y, w: 5, h: 10 });
}

let shootInterval = setInterval(() => {
  if (shooting && !gameOver) shootBullet();
}, 300);

function update() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawEnemies();
  drawBullets();

  if (moveLeft) player.x -= 4;
  if (moveRight) player.x += 4;

  // межі руху гравця
  if (player.x < 0) player.x = 0;
  if (player.x + player.w > canvas.width) player.x = canvas.width - player.w;

  enemies.forEach((e, j) => {
    e.y += e.speed;

    // зіткнення з гравцем або краєм поля = поразка
    if (
      (e.x < player.x + player.w &&
       e.x + e.w > player.x &&
       e.y < player.y + player.h &&
       e.y + e.h > player.y) ||
      e.y + e.h >= canvas.height
    ) {
      gameOver = true;
      alert("Гру завершено!");
      location.reload();
    }
  });

  bullets.forEach((b, i) => {
    b.y -= 7;

    enemies.forEach((e, j) => {
      if (
        b.x < e.x + e.w &&
        b.x + b.w > e.x &&
        b.y < e.y + e.h &&
        b.y + b.h > e.y
      ) {
        enemies.splice(j, 1);
        bullets.splice(i, 1);
      }
    });

    if (b.y < 0) bullets.splice(i, 1);
  });

  requestAnimationFrame(update);
}

// натискання
document.getElementById("left").addEventListener("mousedown", () => moveLeft = true);
document.getElementById("right").addEventListener("mousedown", () => moveRight = true);
document.getElementById("shoot").addEventListener("mousedown", () => shooting = true);

// відпускання
document.getElementById("left").addEventListener("mouseup", () => moveLeft = false);
document.getElementById("right").addEventListener("mouseup", () => moveRight = false);
document.getElementById("shoot").addEventListener("mouseup", () => shooting = false);

// для мобільних (touch)
document.getElementById("left").addEventListener("touchstart", e => { moveLeft = true; e.preventDefault(); });
document.getElementById("right").addEventListener("touchstart", e => { moveRight = true; e.preventDefault(); });
document.getElementById("shoot").addEventListener("touchstart", e => { shooting = true; e.preventDefault(); });

document.getElementById("left").addEventListener("touchend", () => moveLeft = false);
document.getElementById("right").addEventListener("touchend", () => moveRight = false);
document.getElementById("shoot").addEventListener("touchend", () => shooting = false);

// спавн ворогів
setInterval(spawnEnemy, 2000);

update();
