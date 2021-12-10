// NOTES
// lets use the standard loop of airbnb
// for (let i = 0; i < range; i += 1) {}
//
// steps in committing in git and updating the code
// git add .
// git commit -m "Description"
// git push origin main
//
// more git tutorials here
// https://docs.github.com/en/get-started/using-git/pushing-commits-to-a-remote-repository
//
// You can add notes here on the top page.
//
//
//
//
//Begin
let canvas;
let ctx;
let currentTime = Date.now();
let animationFrame;
let secondsPassed = 0;
let lastFrame = 0;

window.onload = pageLoad();

//fires the loop
function pageLoad() {
  canvas = document.querySelector('canvas');
  ctx = canvas.getContext('2d');

  // sets the canvas width and hight dynamically
  canvas.width = 1280;
  canvas.height = 720;

  //first animation request
  animationFrame = requestAnimationFrame(gameLoop);
}

function gameLoop(currentTime) {
  // Calculate how much time has passed
  delta = (currentTime - lastFrame) / 1000;
  lastFrame = currentTime;

  // Pass the delta time to the update
  // Game logic here
  // update(delta);
  // render();

  requestAnimationFrame(gameLoop);
}

//Classes
class Player {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  render() {
    //player stroke rectangle
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}

class Platform {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  render() {
    //stroke rectangle
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}

class Lava {
  constructor(y) {
    this.y = y;
  }

  render() {
    //stroke rectangle
    ctx.strokeRect(0, this.y, 1280, 50);
  }
}

const x = canvas.width / 2;
const y = canvas.height / 2;

//entity settings
//1280 x 720 resolution
const player = new Player(x - 50, y - 100, 100, 200);
const platform = new Platform(x - 100, y + 100, 200, 20);
const lava = new Lava(720 - 80);

//draws the shapes
player.render();
platform.render();
lava.render();

// function render() {
//   let randomColor = Math.random() > 0.5 ? '#ff8080' : '#0099b0';
//   const x = canvas.width / 2;
//   const y = canvas.height / 2;

//   // Clear the entire canvas
//   ctx.clearRect(0, 0, canvas.width, canvas.height);

//   //draw a rectangle
//   ctx.fillStyle = randomColor;
//   ctx.fillRect(x - 100, y - 100, 200, 200);
// }
