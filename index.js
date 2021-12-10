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
  canvas.width = innerWidth;
  canvas.height = innerHeight;

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
  render();

  requestAnimationFrame(gameLoop);
}

function render() {
  let randomColor = Math.random() > 0.5 ? '#ff8080' : '#0099b0';
  let x = 0;
  let y = 0;

  // Clear the entire canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //draw a rectangle
  ctx.fillStyle = randomColor;
  ctx.fillRect(x, y, 200, 200);
}
