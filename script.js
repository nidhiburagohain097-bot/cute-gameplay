const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const BLOCK_HEIGHT = 28;
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

let stack = [];
let currentBlock = null;
let score = 0;
let isGameOver = false;

const KAWAII_ICONS = ["💖","⭐","🌸","✨","🐱","🎀","💎","🎵","☀️","🐾","🦋"];

function createBlock(width, y) {
  const x = Math.random() * (CANVAS_WIDTH - width);
  return { x, y, width, height: BLOCK_HEIGHT, icon: KAWAII_ICONS[Math.floor(Math.random()*KAWAII_ICONS.length)] };
}

function spawnBlock() {
  const width = stack.length === 0 ? 120 : stack[stack.length-1].width;
  const y = stack.length === 0 ? CANVAS_HEIGHT - BLOCK_HEIGHT : stack[stack.length-1].y - BLOCK_HEIGHT;
  currentBlock = createBlock(width, y);
}

function drawBlock(block) {
  ctx.fillStyle = "#fff";
  ctx.fillRect(block.x, block.y, block.width, block.height);
  ctx.font = "20px Arial";
  ctx.fillText(block.icon, block.x + block.width/2 - 10, block.y + 20);
}

function drawStack() {
  ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
  stack.forEach(drawBlock);
  if(currentBlock) drawBlock(currentBlock);
}

function update() {
  if(isGameOver) return;

  if(currentBlock) {
    currentBlock.x += 2 * (Math.random() > 0.5 ? 1 : -1); // simple horizontal movement
    if(currentBlock.x < 0) currentBlock.x = 0;
    if(currentBlock.x + currentBlock.width > CANVAS_WIDTH) currentBlock.x = CANVAS_WIDTH - currentBlock.width;
  }

  drawStack();
  requestAnimationFrame(update);
}

window.addEventListener('keydown', (e)=>{
  if(isGameOver) return;
  if(e.code === "Space" && currentBlock) {
    const topBlock = stack[stack.length-1];
    if(stack.length === 0) {
      stack.push(currentBlock);
      spawnBlock();
      score++;
      document.getElementById("score").innerText = "Score: " + score;
      return;
    }
    const overlapStart = Math.max(currentBlock.x, topBlock.x);
    const overlapEnd = Math.min(currentBlock.x + currentBlock.width, topBlock.x + topBlock.width);
    const overlapWidth = overlapEnd - overlapStart;
    if(overlapWidth <= 0) {
      isGameOver = true;
      alert("GAME OVER! Score: " + score);
      return;
    }
    currentBlock.width = overlapWidth;
    currentBlock.x = overlapStart;
    stack.push(currentBlock);
    score++;
    document.getElementById("score").innerText = "Score: " + score;
    spawnBlock();
  }
});

spawnBlock();
update();
