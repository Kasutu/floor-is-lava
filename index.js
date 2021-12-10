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
let currentTime;
let secondsPassed = 0;
let lastFrame = 0;

//starts the game
function pageLoad() {
  canvas = document.querySelector('canvas');
  ctx = canvas.getContext('2d');
  currentTime = Date.now();

  // sets the canvas width and hight dynamically
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}

function gameLoop(currentTime) {
  // Calculate how much time has passed
  delta = (currentTime - lastFrame) / 1000;
  lastFrame = currentTime;

  // Pass the delta time to the update
  update(delta);
  draw();

  requestAnimationFrame(gameLoop);
}