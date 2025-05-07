const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scale = 30; // Більше — більші іконки
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake = [];
let direction = 'RIGHT';

let beerImage = new Image();
beerImage.src = 'assets/Beer-1024-222935247.png';

let headImage = new Image();
headImage.src = 'assets/photo_2025-05-07_20-56-56.jpg';

let beer = {
  x: Math.floor(Math.random() * columns) * scale,
  y: Math.floor(Math.random() * rows) * scale
};

function initSnake() {
  snake = [
    { x: scale * 5, y: scale * 5 }
  ];
}
initSnake();

window.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowUp': if (direction !== 'DOWN') direction = 'UP'; break;
    case 'ArrowDown': if (direction !== 'UP') direction = 'DOWN'; break;
    case 'ArrowLeft': if (direction !== 'RIGHT') direction = 'LEFT'; break;
    case 'ArrowRight': if (direction !== 'LEFT') direction = 'RIGHT'; break;
  }
});

function gameLoop() {
  let head = { ...snake[0] };
  switch (direction) {
    case 'UP': head.y -= scale; break;
    case 'DOWN': head.y += scale; break;
    case 'LEFT': head.x -= scale; break;
    case 'RIGHT': head.x += scale; break;
  }

  if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height) {
    alert("Game Over!");
    initSnake();
    return;
  }

  if (head.x === beer.x && head.y === beer.y) {
    snake.unshift(head);
    beer.x = Math.floor(Math.random() * columns) * scale;
    beer.y = Math.floor(Math.random() * rows) * scale;
  } else {
    snake.pop();
    snake.unshift(head);
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(beerImage, beer.x, beer.y, scale, scale);

  for (let i = 0; i < snake.length; i++) {
    if (i === 0) {
      ctx.drawImage(headImage, snake[i].x, snake[i].y, scale, scale);
    } else {
      ctx.fillStyle = "#0f0";
      ctx.fillRect(snake[i].x, snake[i].y, scale, scale);
    }
  }

  setTimeout(gameLoop, 200); // Повільніше
}

gameLoop();

// 👇 Свайп-контроль (перенесений нижче)
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', function(e) {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, false);

canvas.addEventListener('touchmove', function(e) {
  if (!touchStartX || !touchStartY) return;

  let touchEndX = e.touches[0].clientX;
  let touchEndY = e.touches[0].clientY;

  let dx = touchEndX - touchStartX;
  let dy = touchEndY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0 && direction !== 'LEFT') direction = 'RIGHT';
    else if (dx < 0 && direction !== 'RIGHT') direction = 'LEFT';
  } else {
    if (dy > 0 && direction !== 'UP') direction = 'DOWN';
    else if (dy < 0 && direction !== 'DOWN') direction = 'UP';
  }

  touchStartX = 0;
  touchStartY = 0;
}, false);
