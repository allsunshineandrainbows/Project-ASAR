// ==================
// CANVAS SETUP
// ==================
const bgCanvas = document.getElementById('game-background');
const ctx1 = bgCanvas.getContext('2d');

const objCanvas = document.getElementById('game-objects');
const ctx2 = objCanvas.getContext('2d');

const charCanvas = document.getElementById('game-character');
const ctx3 = charCanvas.getContext('2d');

const WIDTH = 1350;
const HEIGHT = 600;

// ==================
// BACKGROUND STATE
// ==================
let fogOffset = 0;
let mountainOffsetFar = 0;
let mountainOffsetNear = 0;
let pulseTime = 0;

// ==================
// DRAW ROUNDED RECTANGLE
// ==================
function drawRoundedRect(ctx, x, y, width, height, radius, fillColor, strokeColor, strokeWidth) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();

  ctx.fillStyle = fillColor;
  ctx.fill();

  if (strokeColor && strokeWidth) {
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
  }
}

// ==================
// PRE-GENERATED MOUNTAINS
// ==================
function generateMountains(baseY, variance, step = 120) {
  const points = [];
  for (let x = 0; x <= WIDTH + step; x += step) {
    points.push({
      x,
      y: baseY - Math.random() * variance
    });
  }
  return points;
}

const mountainsFar = generateMountains(360, 40);
const mountainsNear = generateMountains(420, 70);

function drawMountainLayer(points, offset, color) {
  ctx1.fillStyle = color;
  ctx1.beginPath();
  ctx1.moveTo(0, HEIGHT);
  points.forEach(p => ctx1.lineTo(p.x - offset, p.y));
  ctx1.lineTo(WIDTH, HEIGHT);
  ctx1.closePath();
  ctx1.fill();
}

// ==================
// SURREAL GLOW ORBS
// ==================
const glowOrbs = Array.from({ length: 10 }, () => ({
  x: Math.random() * WIDTH,
  y: Math.random() * 350,
  r: 20 + Math.random() * 30,
  speed: 0.1 + Math.random() * 0.2,
  alpha: 0.04 + Math.random() * 0.06
}));

// ==================
// AMBIENT BACKGROUND
// ==================
function drawBackground() {
  const gradient = ctx1.createLinearGradient(0, 0, 0, HEIGHT);
  gradient.addColorStop(0, "#0b1320");
  gradient.addColorStop(0.6, "#1b2a38");
  gradient.addColorStop(1, "#2c3e50");

  ctx1.fillStyle = gradient;
  ctx1.fillRect(0, 0, WIDTH, HEIGHT);

  drawMountainLayer(mountainsFar, mountainOffsetFar, "rgba(20,30,45,0.85)");
  drawMountainLayer(mountainsNear, mountainOffsetNear, "rgba(15,20,30,0.95)");

  glowOrbs.forEach(o => {
    ctx1.beginPath();
    ctx1.arc(o.x, o.y, o.r, 0, Math.PI * 2);
    ctx1.fillStyle = `rgba(180,220,255,${o.alpha})`;
    ctx1.fill();

    o.y += o.speed;
    if (o.y - o.r > 420) {
      o.y = -o.r;
      o.x = Math.random() * WIDTH;
    }
  });

  ctx1.fillStyle = "rgba(255,255,255,0.035)";
  for (let i = 0; i < 7; i++) {
    ctx1.beginPath();
    ctx1.ellipse(
      (i * 280 + fogOffset) % 1600 - 200,
      360 + i * 18,
      260,
      55,
      0,
      0,
      Math.PI * 2
    );
    ctx1.fill();
  }

  ctx1.fillStyle = "#151515";
  ctx1.fillRect(0, 500, WIDTH, 100);

  fogOffset += 0.12;
  mountainOffsetFar = (mountainOffsetFar + 0.05) % 120;
  mountainOffsetNear = (mountainOffsetNear + 0.12) % 120;
}

// ==================
// PLATFORMS
// ==================
const platforms = [
  { x: 0, y: 400, width: 200, height: 50 },
  { x: 300, y: 350, width: 200, height: 50 },
  { x: 600, y: 300, width: 200, height: 50 },
  { x: 900, y: 250, width: 200, height: 50 },
  { x: 1200, y: 200, width: 150, height: 50 }
];

function drawObjects() {
  ctx2.clearRect(0, 0, WIDTH, HEIGHT);

  pulseTime += 0.05;
  const borderWidth = 1.5 + Math.sin(pulseTime) * 1;
  const borderAlpha = 0.3 + Math.sin(pulseTime) * 0.2;

  platforms.forEach(p => {
    drawRoundedRect(
      ctx2,
      p.x,
      p.y,
      p.width,
      p.height,
      15,
      "#000000",
      `rgba(180,220,255,${borderAlpha})`,
      borderWidth
    );
  });

  ctx2.fillStyle = '#00bfff';
  ctx2.fillRect(1300, 100, 50, 50);
}

// ==================
// PLAYER
// ==================
const player = {
  x: 40,
  y: 0,
  width: 50,
  height: 50,
  velocityX: 0,
  velocityY: 0,
  speed: 5,
  jumpPower: 12,
  gravity: 0.5,
  isJumping: false,
  groundY: 500
};

const keys = {};
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

// ==================
// UPDATE PLAYER
// ==================
function updatePlayer() {
  const goal = { x: 1300, y: 100, width: 50, height: 50 };
  if (
    player.x < goal.x + goal.width &&
    player.x + player.width > goal.x &&
    player.y < goal.y + goal.height &&
    player.y + player.height > goal.y
  ) {
    const level = parseInt(document.getElementById('level-title').textContent.split(' ')[1]);
    document.getElementById('completion-message').textContent = `Level ${level} Complete!`;
    document.getElementById('completion-overlay').style.display = 'flex';
    document.getElementById('back-to-levels').addEventListener('click', () => {
      window.location.href = '../../platformer-menu/platformer-menu.html';
    });
    document.getElementById('next-level').addEventListener('click', () => {
      window.location.href = `../../platformer-levels/platformer_level_${level+1}/level_${level+1}.html`;
    });
    return; // Stop updating to prevent further redirects
  }

  if (keys['ArrowLeft']) player.velocityX = -player.speed;
  else if (keys['ArrowRight']) player.velocityX = player.speed;
  else player.velocityX = 0;

  player.x += player.velocityX;

  if (player.x < 0) player.x = 0;
  if (player.x + player.width > WIDTH) player.x = WIDTH - player.width;

  player.velocityY += player.gravity;
  player.y += player.velocityY;

  if (keys['ArrowUp'] && !player.isJumping) {
    player.velocityY = -player.jumpPower;
    player.isJumping = true;
  }

  if (player.y + player.height >= player.groundY && player.velocityY >= 0) {
    player.y = player.groundY - player.height;
    player.velocityY = 0;
    player.isJumping = false;
  }

  platforms.forEach(p => {
    const overlapLeft = player.x + player.width - p.x;
    const overlapRight = p.x + p.width - player.x;
    const overlapTop = player.y + player.height - p.y;
    const overlapBottom = p.y + p.height - player.y;

    if (overlapLeft > 0 && overlapRight > 0 && overlapTop > 0 && overlapBottom > 0) {
      const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

      if (minOverlap === overlapTop && player.velocityY > 0) {
        player.y = p.y - player.height;
        player.velocityY = 0;
        player.isJumping = false;
      } else if (minOverlap === overlapBottom && player.velocityY < 0) {
        player.y = p.y + p.height;
        player.velocityY = 0;
      } else if (minOverlap === overlapLeft && player.velocityX > 0) {
        player.x = p.x - player.width;
      } else if (minOverlap === overlapRight && player.velocityX < 0) {
        player.x = p.x + p.width;
      }
    }
  });
}

// ==================
// DRAW PLAYER
// ==================
function drawPlayer() {
  ctx3.clearRect(0, 0, WIDTH, HEIGHT);
  ctx3.fillStyle = '#ffffff';
  ctx3.fillRect(player.x, player.y, player.width, player.height);
}

// ==================
// GAME LOOP
// ==================
function gameLoop() {
  ctx1.clearRect(0, 0, WIDTH, HEIGHT);
  drawBackground();

  drawObjects();
  updatePlayer();
  drawPlayer();

  requestAnimationFrame(gameLoop);
}

gameLoop();