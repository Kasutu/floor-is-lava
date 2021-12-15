// init
// canvas settings
let canvas;
let ctx;
let width = 1000;
let height = 500;

// gameLoop vars
let currentTime = Date.now();
let elapsedTime;
let lastFrame = 0;
let fps;
let gameStart = true;

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
let playerSize = 16;
let player = {
  width: playerSize,
  height: playerSize,
  x: Math.floor(width / 2 - playerSize / 2),
  y: Math.floor(height / 2 - playerSize / 2),
  velX: 0,
  velY: 0,
  isJumping: false,
  isOnFloor: false,

  draw: function () {
    // draw a stroke rectangle
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(Math.floor(this.x), Math.floor(this.y), this.width, this.height);
  },
};

let platform = {
  x: Math.floor(width / 2 - 150 / 2),
  y: Math.floor(height / 2),
  width: 150,
  height: 15,

  draw: function () {
    // draw a stroke rectangle
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.strokeRect(Math.floor(this.x), Math.floor(this.y), this.width, this.height);
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

// loads the page
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
  update(delta);
  render();

  if (gameStart) {
    requestAnimationFrame(gameLoop);
  }
}

function update() {
  // physics constants
  const friction = 0.89;
  const gravity = 0.95;
  const jumpHeight = 3;
  const movementSpeed = 5;

  // movement and position calculation
  if (direction.up && !player.isJumping) {
    player.velY = -movementSpeed * jumpHeight;
    player.isJumping = true;
    // console.log('step 1:', -movementSpeed * jumpHeight);
  }

  if (direction.left) {
    player.velX -= 1.5;
  }

  if (direction.right) {
    player.velX += 1.5;
  }

  // friction
  player.velX *= friction;
  player.velY += gravity;
  // console.log('step 2:', player.velY)

  // moves the player downward
  // final position values
  player.y += player.velY;
  player.x += player.velX;
  // console.log('step 3:', player.y)

  // collision checks
  if (floorCollision(player, platform)) {
    player.isJumping = false;
    player.y = platform.y - player.height;
    player.velY = 0;
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
  addLineBoundaries(platform);
  addLineBoundaries(player);

  // Draw number to the screen
  ctx.font = '18px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText(`FPS: ${fps}`, 10, 20);
  ctx.fillText(`Elapsed: ${elapsedTime}s`, 10, 40);
  ctx.fillText(
    `player: x: ${Math.floor(player.x)} y: ${Math.floor(player.y)}`,
    player.x - player.width - 150,
    player.y - 30
  );
  ctx.fillText(
    `platform: x: ${platform.x} y: ${platform.y}`,
    platform.x - platform.width - 30,
    platform.y - 20
  );
  ctx.fillText(`player delta-V: ${Math.floor(player.velY)}m/s`, 10, 100);
  ctx.fillText(`onFloor: ${floorCollision(player, platform)}`, 10, 120);

  // console.log(player.velY);
}

addEventListener('keydown', direction.inputListener);
addEventListener('keyup', direction.inputListener);

// collision detection
function floorCollision(obj1, obj2) {
  if (obj1.y + obj1.height >= obj2.y) {
    return true;
  } else {
    return false;
  }
}

// shows distance visually between 2 objects
function addLineTrack(target1, target2) {
  let startXLeft = target1.x + target1.width / 2;
  let startYLeft = target1.y + target1.height / 2;
  let endXLeft = target2.x + target2.width / 2;
  let endYLeft = target2.y + target2.height / 2;

  ctx.beginPath();
  ctx.moveTo(startXLeft, startYLeft); // start coord
  ctx.lineTo(endXLeft, endYLeft); // end coord
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'blue';
  ctx.stroke();
}

// shows boundary visually between 2 objects
function addLineBoundaries(target) {
  // left side
  let startXLeft = Math.floor(target.x);
  let startYLeft = 0;
  let endXLeft = Math.floor(target.x);
  let endYLeft = Math.floor(height);

  // right side
  let startXRight = Math.floor(target.x + target.width);
  let startYRight = 0;
  let endXRight = Math.floor(target.x + target.width);
  let endYRight = Math.floor(height);

  // top side
  let startXTop = 0;
  let startYTop = Math.floor(target.y);
  let endXTop = Math.floor(width);
  let endYTop = Math.floor(target.y);

  // bottom side
  let startXBottom = 0;
  let startYBottom = Math.floor(target.y + target.height);
  let endXBottom = width;
  let endYBottom = Math.floor(target.y + target.height);

  // left side
  ctx.beginPath();
  ctx.moveTo(startXLeft, startYLeft); // start coord
  ctx.lineTo(endXLeft, endYLeft); // end coord
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'grey';
  ctx.stroke();

  // right side
  ctx.beginPath();
  ctx.moveTo(startXRight, startYRight); // start coord
  ctx.lineTo(endXRight, endYRight); // end coord
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'grey';
  ctx.stroke();

  // top side
  ctx.beginPath();
  ctx.moveTo(startXTop, startYTop); // start coord
  ctx.lineTo(endXTop, endYTop); // end coord
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'grey';
  ctx.stroke();

  // bottom side
  ctx.beginPath();
  ctx.moveTo(startXBottom, startYBottom); // start coord
  ctx.lineTo(endXBottom, endYBottom); // end coord
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'grey';
  ctx.stroke();
}
