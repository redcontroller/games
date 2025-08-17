document.addEventListener('DOMContentLoaded', () => {
  const bird = document.querySelector('.bird');
  const gameDisplay = document.querySelector('.game-container');
  const ground = document.querySelector('.ground-moving');

  let birdLeft = 220;
  let birdBottom = 200;
  let gravity = 3;
  let isGameOver = false;
  let gap = 450;

  function startGame() {
    if (birdBottom > -149) birdBottom -= gravity;
    bird.style.bottom = birdBottom + 'px';
    bird.style.left = birdLeft + 'px';
  }
  let gameTimerId = setInterval(startGame, 20);

  function control(e) {
    if (e.keyCode === 32) {
      jump();
    }
  }

  function jump() {
    if (birdBottom < 500) birdBottom += 45;
    bird.style.bottom = birdBottom + 'px';
    console.log(birdBottom);
  }
  document.addEventListener('keyup', control);

  function generateObstacle() {
    let obstacleLeft = 500;
    let randomHeight = Math.random() * 60;
    let obstacleBottom = randomHeight;
    const obstacle = document.createElement('div');
    const topObstacle = document.createElement('div');
    if (!isGameOver) {
      obstacle.classList.add('obstacle');
      topObstacle.classList.add('topObstacle');
    }
    gameDisplay.appendChild(obstacle);
    gameDisplay.appendChild(topObstacle);
    obstacle.style.left = obstacleLeft + 'px';
    topObstacle.style.left = obstacleLeft + 'px';
    obstacle.style.bottom = obstacleBottom + 'px';
    const sign = Math.random() > 0.6 ? 1 : -1;
    gap += sign * Math.random() * 50;
    if (420 > gap || 600 < gap) gap = 450;
    topObstacle.style.bottom = obstacleBottom + gap + 'px';

    function moveObstacle() {
      obstacleLeft -= 2;
      obstacle.style.left = obstacleLeft + 'px';
      topObstacle.style.left = obstacleLeft + 'px';

      if (obstacleLeft === -60) {
        clearInterval(timerId);
        gameDisplay.removeChild(obstacle);
        gameDisplay.removeChild(topObstacle);
      }
      if ((200 < obstacleLeft && obstacleLeft < 280 && birdLeft === 220 && (obstacleBottom + gap - 190 < birdBottom || birdBottom < obstacleBottom + 150)) || birdBottom < 0) {
        gameOver();
        clearInterval(timerId);
      }
    }
    let timerId = setInterval(moveObstacle, 20);
    if (!isGameOver) setTimeout(generateObstacle, 3000);
  }
  generateObstacle();

  function gameOver() {
    clearInterval(gameTimerId);
    console.log('Game Over');
    isGameOver = true;
    document.removeEventListener('keyup', control);
    ground.classList.add('ground');
    ground.classList.remove('ground-moving');
  }
});
