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

// movement joystick
let joystick = {
  up: false,
  down: false,
  left: false,
  right: false,
  engagedKey: '',
  inputListener: function (event) {
    let inputState = event.type === 'keydown' ? true : false;

    switch (event.key) {
      case 'ArrowUp': // up arrow key
        joystick.up = inputState;
        break;
      case 'ArrowLeft': // left arrow key
        joystick.left = inputState;
        break;
      case 'ArrowRight': // right arrow key
        joystick.right = inputState;
        break;
    }
  },
};

// entity creation
let playerSize = 16;
let player = {
  width: playerSize,
  height: playerSize,
  x: Math.trunc(width / 2 - playerSize / 2),
  y: Math.trunc(height / 2 - playerSize / 2),
  oldX: 0,
  oldY: 0,
  velX: 0,
  velY: 0,
  isJumping: false,
  isOnFloor: false,
  isUnder: false,
  isOutSide: false,
  isOnPlatform: false,
  isAirborne: false,

  draw: function () {
    // draw a stroke rectangle
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      Math.trunc(this.x),
      Math.trunc(this.y),
      this.width,
      this.height
    );
  },
};

let platform = {
  x: Math.trunc(width / 2 - 150 / 2),
  y: Math.trunc(height - 90),
  oldX: 0,
  oldY: 0,
  width: 150,
  height: 15,

  draw: function () {
    // draw a stroke rectangle
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.strokeRect(
      Math.trunc(this.x),
      Math.trunc(this.y),
      this.width,
      this.height
    );
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

// the game loop
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

// calculations and update
function update() {
  // physics constants
  // only affects player
  const friction = 0.9;
  const gravity = 0.7;
  const jumpHeight = 2.8;
  const movementSpeed = 5;

  // movement and position behavior calculation
  if (joystick.up && !player.isJumping && player.isOnFloor) {
    player.isJumping = true;
    player.velY = -movementSpeed * jumpHeight;
    joystick.up = false;
  }

  if (player.isJumping) {
    player.isOnFloor = false;
    player.isAirborne = true;
  }

  if (joystick.left) {
    player.velX -= 1.5;
  }

  if (joystick.right) {
    player.velX += 1.5;
  }

  // conditional friction to change
  // movement speed while jumping
  if (player.isJumping || player.isAirborne) {
    player.velX *= 0.89;
  } else {
    player.velX *= friction;
    player.isAirborne = false;
  }

  // down force on player
  player.velY += gravity;

  // moves the player
  // final position values
  player.oldX = player.x;
  player.oldY = player.y;
  player.y += player.velY;
  player.x += player.velX;

  // platform
  platform.oldY = platform.y;

  // world bottom border collision
  if (
    player.y + player.height >= height &&
    player.y >= height - player.height
  ) {
    player.y = height - player.width;
    player.velY = 0;
    player.isOnFloor = true;
    player.isJumping = false;
    player.isAirborne = false;
  }

  // left side world collision
  if (player.x <= width - width) {
    player.x = 0;
  }

  // right side world collision
  if (player.x + player.width >= width) {
    player.x = width - player.width;
  }

  // checks if player is under platform
  if (
    player.x >= platform.x &&
    player.x <= platform.x + platform.width &&
    player.y >= platform.y
  ) {
    player.isUnder = true;
  } else {
    player.isUnder = false;
  }

  // cliff detection (outside) platform
  if (
    player.x + player.width <= platform.x ||
    (player.x >= platform.x + platform.width && !player.isUnder)
  ) {
    player.isOnPlatform = false;
    player.isOutSide = true;
  } else if (!player.isUnder) {
    // cliff detection (inside) platform
    player.isOnPlatform = true;
    player.isOnFloor = true;
    player.isOutSide = false;
  } else if (player.isUnder) {
    player.isOutSide = false;
  } else if (!player.isOutSide && !player.isUnder) {
    player.isAirborne = true;
  } else if (player.isOutSide && !player.isUnder && !player.isAirborne) {
    player.isOnFloor = true;
  }

  // platform detection
  if (!player.isOutSide) {
    if (
      player.y + player.height > platform.y &&
      player.oldY + player.height <= platform.oldY
    ) {
      player.isJumping = false;
      player.isAirborne = false;
      // coordinates that make the player stand on platform
      player.y = platform.y - player.height;
      player.velY = 0;
      player.isOnFloor = true;
      player.isUnder = false;
      player.isOnPlatform = true;
      player.isOutSide = false;
    }
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
  ctx.font = '18px monospace';
  ctx.fillStyle = 'black';
  ctx.fillText(`FPS: ${fps}`, 10, 20);
  ctx.fillText(`Elapsed: ${elapsedTime}s`, 10, 40);
  ctx.fillText(`player delta-V: ${Math.trunc(player.velY)}m/s`, 10, 60);

  // floating data
  ctx.font = '15px monospace';
  ctx.fillStyle = 'red';
  ctx.fillText(
    `player: x: ${Math.trunc(player.x)} y: ${Math.trunc(player.y)}`,
    player.x - player.width + 50,
    player.y - 30
  );
  ctx.fillText(
    `isJumping: ${player.isJumping}`,
    player.x - player.width + 50,
    player.y - 50
  );
  ctx.fillText(
    `onFloor: ${player.isOnFloor}`,
    player.x - player.width + 50,
    player.y - 70
  );
  ctx.fillText(
    `isOutSide: ${player.isOutSide}`,
    player.x - player.width + 50,
    player.y - 90
  );
  ctx.fillText(
    `isUnder: ${player.isUnder}`,
    player.x - player.width + 50,
    player.y - 110
  );
  ctx.fillText(
    `isOnPlatform: ${player.isOnPlatform}`,
    player.x - player.width + 50,
    player.y - 130
  );
  ctx.fillText(
    `isAirborne: ${player.isAirborne}`,
    player.x - player.width + 50,
    player.y - 150
  );

  // platform floating data
  ctx.fillText(
    `platform: x: ${platform.x} y: ${platform.y}`,
    platform.x - platform.width - 30,
    platform.y - 20
  );

  // console.log(player.velY);
}

// keypress listener
addEventListener('keydown', joystick.inputListener);
addEventListener('keyup', joystick.inputListener);

// collision detection box y-axis
function platformCollision(obj1, obj2) {
  if (obj1.y + obj1.height >= obj2.y && obj1.y <= obj2.y + obj2.height) {
    return true;
  } else {
    return false;
  }
}

// shows distance visually between 2 objects
function addLineTrack(target1, target2) {
  let startXLeft = target1.x + target1.width / 2;
  let startYLeft = target1.oldY + target1.height;
  let endXLeft = target2.x + target2.width / 2;
  let endYLeft = target2.oldY;

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
  let startXLeft = Math.trunc(target.x);
  let startYLeft = 0;
  let endXLeft = Math.trunc(target.x);
  let endYLeft = Math.trunc(height);

  // right side
  let startXRight = Math.trunc(target.x + target.width);
  let startYRight = 0;
  let endXRight = Math.trunc(target.x + target.width);
  let endYRight = Math.trunc(height);

  // top side
  let startXTop = 0;
  let startYTop = Math.trunc(target.y);
  let endXTop = Math.trunc(width);
  let endYTop = Math.trunc(target.y);

  // bottom side
  let startXBottom = 0;
  let startYBottom = Math.trunc(target.y + target.height);
  let endXBottom = width;
  let endYBottom = Math.trunc(target.y + target.height);

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
