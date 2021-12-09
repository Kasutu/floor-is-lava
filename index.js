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

//begin
//variable initialization
let canvas;
let ctx;
let timeStamp = Date.now();

//Debugger variables
let secondsPassed;
let oldTimeStamp;
let fps;
//Debugger variables end

window.onload = pageLoad(); //fires after the page has finished loading

function pageLoad() {
  canvas = document.querySelector('canvas');
  ctx = canvas.getContext('2d');

  // sets the canvas width and hight dynamically
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  // Start the first frame request
  window.requestAnimationFrame(gameLoop);
}

//gameLoop using timestamp
//always calls the gameLoop in milliseconds
function gameLoop(timeStamp) {
  //put your update() & draw() function here
  showFps(timeStamp);
  draw();

  // Keep requesting new frames
  window.requestAnimationFrame(gameLoop);
}

/*==========DELETE BEFORE PASSING==========*/
//debugging
//FPS counter
function showFps(timeStamp) {
  // Calculate the number of seconds passed since the last frame
  secondsPassed = (timeStamp - oldTimeStamp) / 1000;
  oldTimeStamp = timeStamp;

  // Calculate fps
  fps = Math.round(1 / secondsPassed);

  // Draw number to the screen
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, innerWidth, 100);
  ctx.font = '25px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText(`FPS: ${fps}`, 10, 30);
  ctx.fillText(`ELAPSED TIME: ${Math.trunc(timeStamp / 1000)}s`, 150, 30);
}

//draw square
function draw() {
  let randomColor = Math.random() > 0.5 ? '#ff8080' : '#0099b0';
  ctx.fillStyle = randomColor;
  ctx.fillRect(100, 50, 200, 175);
}
/*==========DELETE BEFORE PASSING END==========*/
