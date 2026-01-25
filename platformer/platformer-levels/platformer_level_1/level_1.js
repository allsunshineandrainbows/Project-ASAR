const canvas = document.getElementById('game-background');
const ctx1 = canvas.getContext('2d');

ctx1.fillStyle = '#ffffff';
ctx1.fillRect(0, 500, 1350, 100);
ctx1.fillStyle = '#a6b2b6';
ctx1.fillRect(0, 0, 1350, 500);

// Game background ^^^

const canvas2 = document.getElementById('game-objects');
const ctx2 = canvas2.getContext('2d');

ctx2.fillStyle = '#d7d9d9';
ctx2.fillRect(0, 350, 200, 50);
ctx2.fillRect(300, 300, 200, 50);
ctx2.fillRect(600, 250, 200, 50);
ctx2.fillRect(900, 200, 200, 50);
ctx2.fillRect(1200, 150, 150, 50);

ctx2.fillStyle = '#00bfff';
ctx2.fillRect(1300, 100, 50, 50); // Goal object

// Game objects ^^^

const canvas3 = document.getElementById('game-character');
const ctx3 = canvas3.getContext('2d');

// Player object
const player = {
  x: 0,
  y: 0,
  width: 50,
  height: 50,
  velocityY: 0,
  velocityX: 0,
  speed: 5,
  jumpPower: 12,
  gravity: 0.5,
  isJumping: false,
  groundY: 500
};

// Input handling
const keys = {};

window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// Update player position
function updatePlayer() {
  // Horizontal movement
  if (keys['ArrowLeft']) {
    player.velocityX = -player.speed;
  } else if (keys['ArrowRight']) {
    player.velocityX = player.speed;
  } else {
    player.velocityX = 0;
  }

  // Apply horizontal velocity
  player.x += player.velocityX;

  // Keep player in bounds horizontally
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > 1350) player.x = 1350 - player.width;

  // Apply gravity
  player.velocityY += player.gravity;
  player.y += player.velocityY;

  // Jumping
  if (keys['ArrowUp'] && !player.isJumping) {
    player.velocityY = -player.jumpPower;
    player.isJumping = true;
  }

  // Ground collision (only if moving down or stationary)
  if (player.y + player.height >= player.groundY && player.velocityY >= 0) {
    player.y = player.groundY - player.height;
    player.velocityY = 0;
    player.isJumping = false;
  }

  // Check collision with platforms
  const platforms = [
    { x: 0, y: 350, width: 200, height: 50 },
    { x: 300, y: 300, width: 200, height: 50 },
    { x: 600, y: 250, width: 200, height: 50 },
    { x: 900, y: 200, width: 200, height: 50 },
    { x: 1200, y: 150, width: 150, height: 50 }
  ];

  platforms.forEach(platform => {
    if (
      player.velocityY > 0 &&
      player.y + player.height >= platform.y &&
      player.y + player.height <= platform.y + platform.height &&
      player.x + player.width > platform.x &&
      player.x < platform.x + platform.width
    ) {
      player.y = platform.y - player.height;
      player.velocityY = 0;
      player.isJumping = false;
    }
  });
}

// Draw player
function drawPlayer() {
  ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
  ctx3.fillStyle = '#ffffff';
  ctx3.fillRect(player.x, player.y, player.width, player.height);
}

// Game loop
function gameLoop() {
  updatePlayer();
  drawPlayer();
  requestAnimationFrame(gameLoop);
}

// Start game loop
gameLoop();

// Game character ^^^