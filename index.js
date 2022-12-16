/* =========== INITIALIZATION ============ */

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
let score = 0;
let highScore = localStorage.getItem('highScore');
let gameStart = false;
let secondsBeforeSpawn = 90;
let spawnTimer = 0;
let isGameOver = false;

// physics constants
// only affects player
// default settings
const friction = 0.85;
const airborneFriction = 0.92;
const gravity = 0.7;
const jumpHeight = 2.9;
const movementSpeed = 5.5;

// entity creation
let playerSize = 32 * 1.8;

// platform settings
let platformSpeed = 1;

// images
const playerLeft = new Image();
const playerRight = new Image();
const Lava = new Image();
const dirtTwo = new Image();
const background = new Image();
playerLeft.src = './spriteSheet/Character_ghos_left.png';
playerRight.src = './spriteSheet/Character_ghost_Right.png';
Lava.src = './spriteSheet/LavaSpriteSheet.png';
dirtTwo.src = './spriteSheet/Dirt_Lava_2.png';
background.src = './spriteSheet/Background1.png';

// movement joystick
let joystick = {
  up: false,
  down: false,
  left: false,
  right: false,
  inputListener: function (event) {
    let inputState = event.type === 'keydown' ? true : false;

    switch (true) {
      case event.key === 'ArrowUp' ||
        event.keyCode === 87 ||
        event.keyCode === 32: // up arrow key
        joystick.up = inputState;
        break;
      case event.key === 'ArrowLeft' || event.keyCode === 65: // left arrow key
        joystick.left = inputState;
        break;
      case event.key === 'ArrowRight' || event.keyCode === 68: // right arrow key
        joystick.right = inputState;
        break;
      case event.keyCode === 80: // pause
        playGame('pause');
        break;
      case event.keyCode === 82: // R - resetHighScore
        resetHighScore();
        break;
    }
  },
};

let playerInitialX = Math.trunc(width / 2 - playerSize / 2);
let playerInitialY = Math.trunc(-100 - playerSize / 2);

// properties
let player = {
  width: playerSize,
  height: playerSize,
  x: playerInitialX,
  y: playerInitialY,
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

  // spriteSheet variables
  playerFrameX: 0,
  playerFrameY: 0,
  spriteWidth: 500,
  spriteHeight: 500,
  counter: 0,

  animate: function () {
    // draw the character
    this.counter++;

    if (this.counter > 15) {
      if (this.playerFrameY < 5) {
        this.playerFrameY++;
      } else {
        this.playerFrameY = 0;
      }

      this.counter = 0;
    }

    if (this.velX > 0) {
      ctx.drawImage(
        playerRight,
        this.spriteWidth * this.playerFrameX,
        this.spriteHeight * this.playerFrameY,
        this.spriteWidth,
        this.spriteHeight,
        Math.floor(this.x),
        Math.floor(this.y + 5),
        this.width,
        this.height
      );
    } else {
      ctx.drawImage(
        playerLeft,
        this.spriteWidth * this.playerFrameX,
        this.spriteHeight * this.playerFrameY,
        this.spriteWidth,
        this.spriteHeight,
        Math.floor(this.x),
        Math.floor(this.y + 5),
        this.width,
        this.height
      );
    }
  },
};

let initialPlatform = {
  x: Math.trunc(width / 2 - 100),
  y: Math.trunc(10),
  velY: 0,
  oldX: 0,
  oldY: 0,
  width: 200,
  height: 200,
  speed: platformSpeed,
  //Platform sheet variables
  PlatformFrameX: 0,
  PlatformFrameY: 0.29,
  spriteWidth: 1000,
  spriteHeight: 1000,
  counter: 0,
  update() {
    this.y += this.speed;
  },

  draw: function () {
    ctx.drawImage(
      dirtTwo,
      this.spriteWidth * this.PlatformFrameX,
      this.spriteHeight * this.PlatformFrameY,
      this.spriteWidth,
      this.spriteHeight,
      Math.trunc(this.x),
      Math.trunc(this.y),
      this.width,
      this.height
    );
  },
};

// defines what platform to add in the map
// push the random x values into the array
// para pure random 😄
// platform array
let platformArr = [initialPlatform];

//new platforms that's going to be spawned above the canvas
class newPlatform {
  PlatformFrameX = 0;
  PlatformFrameY = 0.29;
  spriteWidth = 1000;
  spriteHeight = 1000;
  counter = 0;
  width = 200;
  height = 200;

  constructor() {
    //this will make the platform spawn random in X-axis
    this.x = Math.random() * (width - 300) + 15;
    //this will make the spawn platform spawn only at the top of canvas
    this.y = -80;
    this.radius = 50;
    this.speed = platformSpeed;
    this.distance;
  }
  update() {
    this.y += this.speed;
  }
  draw() {
    ctx.drawImage(
      dirtTwo,
      this.spriteWidth * this.PlatformFrameX,
      this.spriteHeight * this.PlatformFrameY,
      this.spriteWidth,
      this.spriteHeight,
      Math.trunc(this.x),
      Math.trunc(this.y),
      this.width,
      this.height
    );
  }
}

//Lava spriteSheet
let lava = {
  x: 1,
  y: 470,
  velY: 0,
  oldX: 0,
  oldY: 0,
  width: 150,
  height: 50,

  PlatformFrameX: 0,
  PlatformFrameY: 0.33,
  spriteWidth: 640,
  spriteHeight: 480,
  counter: 0,

  draw: function () {
    this.counter++;

    if (this.counter > 15) {
      if (this.PlatformFrameY < 5) {
        this.PlatformFrameY++;
      } else {
        this.PlatformFrameY = 0.33;
      }

      this.counter = 0;
    }
    for (let i = 0; i < 18; i++) {
      ctx.drawImage(
        Lava,
        this.spriteWidth * this.PlatformFrameX,
        this.spriteHeight * this.PlatformFrameY,
        this.spriteWidth,
        this.spriteHeight,
        i * 50 + Math.trunc(this.x),
        Math.trunc(this.y),
        this.width,
        this.height
      );
    }
  },
};

//background
let Background = {
  x: -1,
  y: -1,
  velY: 0,
  oldX: 0,
  oldY: 0,
  width: 1001,
  height: 501,

  PlatformFrameX: 0,
  PlatformFrameY: 0,
  spriteWidth: 720,
  spriteHeight: 480,

  draw: function () {
    ctx.drawImage(
      background,
      this.spriteWidth * this.PlatformFrameX,
      this.spriteHeight * this.PlatformFrameY,
      this.spriteWidth,
      this.spriteHeight,
      Math.trunc(this.x),
      Math.trunc(this.y),
      this.width,
      this.height
    );
  },
};
/*=========== INITIALIZATION END ===========*/

/*=========== CORE ===========*/

// executes when page is loaded
window.onload = pageLoad();

// loads the page
function pageLoad() {
  canvas = document.querySelector('canvas');
  ctx = canvas.getContext('2d');

  // sets the canvas width and hight
  canvas.width = width;
  canvas.height = height;
  canvas.style.background = 'black';

  // first animation request
  // requestAnimationFrame(gameLoop);

  Background.draw();
  document.getElementById('highScore').innerHTML = highScore;
  // console.log('Your page is loaded');
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
  movement(player);
  saveHighScore();

  // checks collisions for all platforms or for single objects
  for (let i = 0; i < platformArr.length; i++) {
    collisionEngine(player, platformArr[i]);
  }
}

// implementation
function render() {
  // Clear the entire canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ===== render ===== //
  //Background
  Background.draw();

  // platform
  // platform.draw();
  addPlatforms();

  // player
  // player.draw();
  player.animate();

  // lava
  // lava.draw()
  lava.draw();
  gameOver();

  // debug render trackers //

  // addLineTrack(player, platform);
  // addLineBoundaries(platform);
  // addLineBoundaries(player);
  // addTrackingData(player);

  // player debug data
  ctx.font = '20px monospace';
  ctx.fillStyle = 'white';
  ctx.fillText(`SCORE: ${Math.trunc(score)}`, 10, 30);
  ctx.fillText(`HIGH SCORE: ${Math.trunc(highScore)}`, 10, 60);
  // ctx.fillText(`Elapsed: ${elapsedTime}s`, 10, 60);
  // ctx.fillText(`player delta-V: ${Math.trunc(player.velY)}m/s`, 10, 90);
  // ctx.fillText(`FPS: ${fps}`, 10, 120);
}

// keypress listener
addEventListener('keydown', joystick.inputListener);
addEventListener('keyup', joystick.inputListener);

/*=========== CORE END ===========*/

/* =========== FUNCTIONS SECTION ============ */

function saveHighScore() {
  if (score > highScore) {
    localStorage.setItem('highScore', parseInt(score));
  }
}

function resetHighScore() {
  localStorage.setItem('highScore', '0');
}

let jump;
let touchLava;
let bgMusic;
function gameSound(src) {
  this.gameSound = document.createElement('audio');
  this.gameSound.src = src;
  this.gameSound.setAttribute('preload', 'auto');
  this.gameSound.setAttribute('controls', 'none');
  this.gameSound.style.display = 'none';
  document.body.appendChild(this.gameSound);

  this.play = function () {
    this.gameSound.play();
  };
  this.stop = function () {
    this.gameSound.pause();
  };
}

// start or pause the game
function playGame(val) {
  if (val === 'play') {
    requestAnimationFrame(gameLoop);
    jump = new gameSound('SFX/jump.wav');
    touchLava = new gameSound('SFX/gameOver.wav');
    bgMusic = new gameSound('SFX/bgMusic.mp3');
    bgMusic.play();
    gameStart = true;
    document.getElementById('mainMenu').style.display = 'none';
  }

  if (val === 'pause') {
    bgMusic.stop();
    gameStart = false;

    let IntScore = parseInt(score);

    document.getElementById('score').innerHTML = IntScore;
    document.getElementById('highScore').innerHTML = parseInt(highScore);
    document.getElementById('mainMenu').style.display = 'flex';
  }

  if (val === 'restart') {
    requestAnimationFrame(gameLoop);
    gameStart = true;
  }
}

// adds all the platforms to the map
function addPlatforms() {
  //timer for the platform to be spawned
  spawnTimer++;
  if (spawnTimer === secondsBeforeSpawn) {
    spawnTimer = 0;

    // if player is way above y indentation is increased
    if (player.y < 100) {
      secondsBeforeSpawn = 175;
    } else {
      secondsBeforeSpawn = 90;
    }

    platformArr.push(new newPlatform());
  }
  for (let i = 0; i < platformArr.length; i++) {
    platformArr[i].update();
    platformArr[i].draw();
  }

  //delete platform outside the canvas
  for (let i = 0; i < platformArr.length; i++) {
    if (platformArr[i].y > 500) {
      platformArr.splice(i, 1);
    }
  }
}

//gameOver if the player reach the lava
function gameOver() {
  if (player.y > 430) {
    touchLava.play();
    bgMusic.stop();
    gameStart = false;
    document.getElementById('score').innerHTML = parseInt(score);
    document.getElementById('highScore').innerHTML = parseInt(highScore);
    document.getElementById('mainMenu').style.display = 'flex';

    isGameOver = true;
  }
}

function playButtonHandler() {
  if (isGameOver) {
    location.reload();
    playGame('play');
  }

  playGame('play');
}

/* =========== customEngine ============ */
// jerome Cabugwason 12/18/21

function movement(player) {
  // movement and position behavior calculation
  if (joystick.up && !player.isJumping && player.isOnFloor) {
    player.isJumping = true;
    player.velY = -movementSpeed * jumpHeight;
    joystick.up = false;
    jump.play();
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
    player.velX *= airborneFriction;
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
}

function collisionEngine(player, platform) {
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

      score += 0.05;
    }
  }
}

/* =========== customEngine END ============ */

/*=========== trackers and visual debug aids ===========*/
// jerome Cabugwason 12/18/21

// on screen data anchored to player
function addTrackingData(player) {
  // data styling
  ctx.font = '15px monospace';
  ctx.fillStyle = 'white';
  let dataX = 800;

  // floating data
  ctx.fillText(
    `CAN JUMP? ${!player.isJumping && player.isOnFloor}`,
    dataX,
    160
  );
  ctx.fillText(
    `player: x: ${Math.trunc(player.x)} y: ${Math.trunc(player.y)}`,
    dataX,
    140
  );
  ctx.fillText(`isJumping: ${player.isJumping}`, dataX, 120);
  ctx.fillText(`onFloor: ${player.isOnFloor}`, dataX, 100);
  ctx.fillText(`isOutSide: ${player.isOutSide}`, dataX, 80);
  ctx.fillText(`isUnder: ${player.isUnder}`, dataX, 60);
  ctx.fillText(`isOnPlatform: ${player.isOnPlatform}`, dataX, 40);
  ctx.fillText(`isAirborne: ${player.isAirborne}`, dataX, 20);
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

/*=========== trackers and visual debug aids end===========*/
