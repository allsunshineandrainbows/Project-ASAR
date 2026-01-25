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
ctx2.fillRect(0, 400, 200, 50);
ctx2.fillRect(300, 350, 200, 50);
ctx2.fillRect(600, 300, 200, 50);
ctx2.fillRect(900, 250, 200, 50);
ctx2.fillRect(1200, 200, 150, 50);

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
  // Check goal collision
  const goal = { x: 1300, y: 100, width: 50, height: 50 };
  if (
    player.x < goal.x + goal.width &&
    player.x + player.width > goal.x &&
    player.y < goal.y + goal.height &&
    player.y + player.height > goal.y
  ) {
    window.location.href = '../../../bob.html';
  }

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
    { x: 0, y: 400, width: 200, height: 50 },
    { x: 300, y: 350, width: 200, height: 50 },
    { x: 600, y: 300, width: 200, height: 50 },
    { x: 900, y: 250, width: 200, height: 50 },
    { x: 1200, y: 200, width: 150, height: 50 }
  ];

  platforms.forEach(platform => {
    const overlapLeft = player.x + player.width - platform.x;
    const overlapRight = platform.x + platform.width - player.x;
    const overlapTop = player.y + player.height - platform.y;
    const overlapBottom = platform.y + platform.height - player.y;

    // Only process if there's overlap on all axes
    if (overlapLeft > 0 && overlapRight > 0 && overlapTop > 0 && overlapBottom > 0) {
      // Find the side with the smallest overlap
      const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

      // Top collision (landing on platform)
      if (minOverlap === overlapTop && player.velocityY > 0) {
        player.y = platform.y - player.height;
        player.velocityY = 0;
        player.isJumping = false;
      }
      // Bottom collision (hitting from below)
      else if (minOverlap === overlapBottom && player.velocityY < 0) {
        player.y = platform.y + platform.height;
        player.velocityY = 0;
      }
      // Left collision (hitting from right)
      else if (minOverlap === overlapLeft && player.velocityX > 0) {
        player.x = platform.x - player.width;
      }
      // Right collision (hitting from left)
      else if (minOverlap === overlapRight && player.velocityX < 0) {
        player.x = platform.x + platform.width;
      }
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