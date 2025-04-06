const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const playerImg = new Image();
playerImg.src = "vlada.jpg";

const enemyImg = new Image();
enemyImg.src = "pavlo.jpg";

const player = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 60,
  width: 40,
  height: 40,
  speed: 4
};

const bullets = [];
const enemies = [];

let keys = { left: false, right: false };
let shooting = false;
let gameOver = false;

function spawnEnemy() {
  const x = Math.random() * (canvas.width - 40);
  enemies.push({ x, y: -40, width: 40, height: 40, speed: 2 });
}

setInterval(spawnEnemy, 2000);

function shoot() {
  bullets.push({
    x: player.x + player.width / 2 - 5,
    y: player.y,
    width: 10,
    height: 20,
    speed: 7
  });
}

function update() {
  if (keys.left) player.x -= player.speed;
  if (keys.right) player.x += player.speed;
  if (shooting && frame % 10 === 0) shoot();

  // Не виходити за межі поля
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

  bullets.forEach((b, i) => {
    b.y -= b.speed;
    if (b.y < 0) bullets.splice(i, 1);
  });

  enemies.forEach((e, i) => {
    e.y += e.speed;

    // Якщо ворог торкнувся гравця або низу
    if (
      e.y + e.height >= canvas.height ||
      (e.x < player.x + player.width &&
        e.x + e.width > player.x &&
        e.y < player.y + player.height &&
        e.y + e.height > player.y)
    ) {
      gameOver = true;
    }

    bullets.forEach((b, j) => {
      if (
        b.x < e.x + e.width &&
        b.x + b.width > e.x &&
        b.y < e.y + e.height &&
        b.y + b.height > e.y
      ) {
        enemies.splice(i, 1);
        bullets.splice(j, 1);
      }
    });
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  bullets.forEach((b) => {
    ctx.fillStyle = "red";
    ctx.fillRect(b.x, b.y, b.width, b.height);
  });

  enemies.forEach((e) => {
    ctx.drawImage(enemyImg, e.x, e.y, e.width, e.height);
  });

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "24px sans-serif";
    ctx.fillText("Гру завершено!", canvas.width / 2 - 70, canvas.height / 2);
  }
}

let frame = 0;
function gameLoop() {
  if (!gameOver) {
    update();
    draw();
    frame++;
    requestAnimationFrame(gameLoop);
  }
}

gameLoop();

// Рух
document.getElementById("left").addEventListener("touchstart", () => keys.left = true);
document.getElementById("left").addEventListener("touchend", () => keys.left = false);

document.getElementById("right").addEventListener("touchstart", () => keys.right = true);
document.getElementById("right").addEventListener("touchend", () => keys.right = false);

// Стріляти кнопкою
document.getElementById("shoot").addEventListener("touchstart", () => shooting = true);
document.getElementById("shoot").addEventListener("touchend", () => shooting = false);

// Стріляти при кліку по canvas
canvas.addEventListener("click", () => shoot());
