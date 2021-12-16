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
const playerLeft = new Image();
playerLeft.src = 'Character_ghos_left.png'
const playerRight = new Image();
playerRight.src = 'Character_ghost_Right.png'

let player = {
  width: 30,
  height: 30,
  x: width / 2 - 16 / 2,
  y: height / 2 - 16 / 2,
  playerFrameX: 0,
  playerFrameY: 0,
  velX: 0,
  velY: 0,
  spriteWidth: 500,
  spriteHeight: 500,
  isJumping: false,
  isOnFloor: false,
  

  draw: function () {
    if (this.playerFrameY < 6) {
      this.playerFrameY ++
    } else {
      this.playerFrameY = 1
    }
    if(this.velX >= 0){
    ctx.drawImage(playerRight, this.spriteWidth * this.playerFrameX, this.spriteHeight * this.playerFrameY, this.spriteWidth, this.spriteHeight, Math.floor(this.x), Math.floor(this.y), this.width, this.height)
    } else {
      ctx.drawImage(playerLeft,this.spriteWidth * this.playerFrameX, this.spriteHeight * this.playerFrameY, this.spriteWidth, this.spriteHeight,  Math.floor(this.x), Math.floor(this.y), this.width, this.height)
    }
  },
};

//platform
const dirt_one = new Image()
dirt_one.src = 'Dirt_1.png'
let platform = {
  width: 150,
  height: 75,
  x: width / 2 - 150 / 2,
  y: height / 2,
  spriteWidth: 1000,
  spriteHeight: 1000,
  platformFrameX: 0,
  platformFrameY: 0.34,

  draw: function () {
    ctx.drawImage(dirt_one, this.spriteWidth * this.platformFrameX, this.spriteHeight * this.platformFrameY, this.spriteWidth, this.spriteHeight,Math.floor(this.x), Math.floor(this.y),this.width, this.height )
  },
};

//lava
const lavaImage = new Image()
lavaImage.src = 'LavaSpriteSheet.png'
let lavagame = {
  width: 500,
  height: 500,
  x: 1000,
  y: 50,
  spriteWidth: 640,
  spriteHeight: 480,
  LavaPlatformFrameX: 0,
  LavaPlatformFrameY: 0.,

  draw: function () {
     if (this.LavaPlatformFrameY < 6) {
      this.LavaPlatformFrameY ++
    } else {
      this.LavaPlatformFrameY = 1
    }

     
    ctx.drawImage(lavaImage, this.spriteWidth * this.LavaPlatformFrameX, this.spriteHeight * this.LavaPlatformFrameY, this.spriteWidth, this.spriteHeight,Math.floor(this.x), Math.floor(this.y),this.width, this.height )
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
    player.velX -= 1;
  }

  if (direction.right) {
    player.velX += 1;
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

  console.log('onFloor:', floorCollision(player, platform));
}

// implementation
function render() {
  // Clear the entire canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //render
  player.draw();
  platform.draw();
  lavagame.draw();

  // debug render
  addLineTrack(player, platform);

  // Draw number to the screen
  ctx.font = '18px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText(`FPS: ${fps}`, 10, 20);
  ctx.fillText(`Elapsed: ${elapsedTime}s`, 10, 40);
  ctx.fillText(`player: x: ${Math.floor(player.x / 2)} y: ${Math.floor(player.y / 2)}`, 10, 60);
  ctx.fillText(`platform: x: ${platform.x / 2} y: ${platform.y / 2}`, 10, 80);
  ctx.fillText(`player delta-V: ${Math.floor(player.velY)}m/s`, 10, 100);
  ctx.fillText(`Delta: ${delta}`, 10, 120);

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