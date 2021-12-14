// init
// canvas settings
let canvas;
let ctx;
let width = 800;
let height = 400;

// gameLoop vars
let currentTime = Date.now();
let elapsedTime;
let lastFrame = 0;
let fps;
let gameStart = true;

// physics vars
const friction = 0.8;
const gravity = 1.5;

// movement direction
let direction = {
  up: false,
  down: false,
  left: false,
  right: false,
  inputListener: function (event) {
    let inputState = event.type === 'keydown' ? true : false;

    switch (event.key) {
      case 'ArrowUp': // up arrow key
        direction.up = inputState;
        break;
      case 'ArrowLeft': // left arrow key
        direction.left = inputState;
        break;
      case 'ArrowRight': // right arrow key
        direction.right = inputState;
        break;
    }
  },
};

// entity creation
let player = {
  x: width / 2 - 16,
  y: height / 2 - 16,
  width: 32,
  height: 32,
  speed: 30,
  deltaX: 0,
  deltaY: 0,
  isJumping: false,
  isOnFloor: false,

  draw: function () {
    // draw a stroke rectangle
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  },
};

let platform = {
  x: 0,
  y: 350,
  width: width,
  height: 10,

  draw: function () {
    // draw a stroke rectangle
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  },
};

// executes when page is loaded
window.onload = pageLoad();

// start or pause the game
function playGame(val) {
  if (val === 'play') {
    gameStart = true;
    pageLoad();
  }

  if (val === 'pause') {
    gameStart = false;
  }
}

function pageLoad() {
  canvas = document.querySelector('canvas');
  ctx = canvas.getContext('2d');

  // sets the canvas width and hight dynamically
  canvas.width = width;
  canvas.height = height;

  // first animation request
  requestAnimationFrame(gameLoop);
}

function gameLoop(currentTime) {
  // Calculate how much time has passed
  delta = (currentTime - lastFrame) / 1000;
  lastFrame = currentTime;
  elapsedTime = Math.trunc(lastFrame / 1000);

  // Calculate fps
  fps = Math.round(1 / delta);

  // Pass the delta time to the update
  // Game logic here
  update(delta === true);
  render();
  // console.log(`Elapsed: ${elapsedTime}`);

  if (gameStart) {
    requestAnimationFrame(gameLoop);
  }
}

function update() {
  // movement and position calculation
  if (direction.up && !player.isJumping) {
    player.deltaY = -player.speed * 2;
    player.isJumping = true;
  }

  if (direction.left) {
    player.deltaX -= 1;
  }

  if (direction.right) {
    player.deltaX += 1;
  }

  // moves the player downward
  player.deltaY += gravity * 2;

  // final position values
  player.y += player.deltaY;
  player.x += player.deltaX;

  // friction
  player.deltaX *= friction;
  player.deltaY *= friction;

  // collision checks
  if (
    player.y + player.height >= platform.y
    ) {
    player.isJumping = false;
    player.y = platform.y - player.height
    player.deltaY = 0;
  }
}

// implementation
function render() {
  // Clear the entire canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //render
  player.draw();
  platform.draw();

  // debug render
  addLineTrack(player, platform);

  // Draw number to the screen
  ctx.font = '18px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText(`FPS: ${fps}`, 10, 20);
  ctx.fillText(`Elapsed: ${elapsedTime}s`, 10, 40);
  ctx.fillText(`player: x: ${player.x / 2} y: ${player.y / 2}`, 10, 60);
  ctx.fillText(`platform: x: ${platform.x / 2} y: ${platform.y / 2}`, 10, 80);
  ctx.fillText(`player delta-V: ${player.deltaY}m/s`, 10, 100);
}

addEventListener('keydown', direction.inputListener);
addEventListener('keyup', direction.inputListener);

// collision detection
function floorCollision(obj1, obj2) {
  if (obj1.y + obj1.height >= obj2.y) {
    return true;
  }
}

// shows distance visually between 2 objects
function addLineTrack(target1, target2) {
  let startX = target1.x + target1.width / 2;
  let startY = target1.y + target1.height / 2;
  let endX = target2.x + target2.width / 2;
  let endY = target2.y + target2.height / 2;

  ctx.beginPath();
  ctx.moveTo(startX, startY); // start coord
  ctx.lineTo(endX, endY); // end coord
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'blue';
  ctx.stroke();
}
