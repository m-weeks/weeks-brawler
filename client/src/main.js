const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let lastTime = 0;

const map = [
  [1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1]
];

const mapWidth = map[0].length;
const mapHeight = map.length;

const player = { x: 2.5, y: 2.5, dir: 0 };
const FOV = Math.PI / 3;  // Field of view (e.g., 60 degrees)
const scale = 64;

function gameLoop(timestamp) {
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update game state and render
  update(deltaTime);
  render(ctx);

  // Request the next frame
  requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'w') {
    player.x += Math.cos(player.dir) * 0.05;  // Adjust movement speed as needed
    player.y += Math.sin(player.dir) * 0.05;
  }
  // Implement additional controls here
});

function update(deltaTime) {
  // Example movement speed
  const moveSpeed = 0.1 * deltaTime;
}

// Render the game
function render(ctx) {
  for (let x = 0; x < canvas.width; x++) {
    let rayAngle = player.dir - FOV / 2 + x / canvas.width * FOV;
    let distanceToWall = castRay(rayAngle);

    // Correct for fisheye effect
    let correctedDistance = distanceToWall * Math.cos(rayAngle - player.dir);

    // Calculate height of the wall slice
    let wallHeight = canvas.height / correctedDistance;

    // Determine the position to start drawing
    let wallTop = (canvas.height / 2) - (wallHeight / 2);

    // Debugging: Log wallHeight to ensure it's within a reasonable range
    // console.log(wallHeight);

    // Render the wall slice
    ctx.fillStyle = 'white';  // Change color based on distance or texture
    ctx.fillRect(x, wallTop, 1, wallHeight);
}
}

function castRay(angle) {
  let distance = 0;
  let hitWall = false;

  while (!hitWall) {
    distance += 0.1; // Increment distance (ray step)

    let testX = Math.floor((player.x + Math.cos(angle) * distance) / scale);
    let testY = Math.floor((player.y + Math.sin(angle) * distance) / scale);

    if (testX < 0 || testX >= mapWidth || testY < 0 || testY >= mapHeight) {
      hitWall = true;
      distance = 1000;
    } else if (map[testY][testX] == 1) {
      hitWall = true;
    }
  }

  return distance;
}

// Start the game loop
requestAnimationFrame(gameLoop);