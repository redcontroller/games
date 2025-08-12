document.addEventListener('DOMContentLoaded', () => {
  const gridEl = document.querySelector('.grid');
  const scoreDisplay = document.querySelector('span');
  const startBtn = document.querySelector('.start');
  const stopBtn = document.querySelector('.stop');
  const gameOverOverlay = document.querySelector('#game-over');

  const width = Number(gridEl.dataset.size) || 10;

  // 동적 그리드 생성 (오버레이 앞에 삽입)
  {
    const total = width * width;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < total; i++)
      frag.appendChild(document.createElement('div'));
    gridEl.insertBefore(frag, gameOverOverlay);
  }

  const squares = gridEl.querySelectorAll('div:not(.overlay)');

  // let currentIndex = 0;
  let appleIndex = 0;
  let currentSnake = [2, 1, 0]; // The div in our grid being 2 (or the HEAD), and 0 being the end (TAIL, with all 1's being the body fro new on)
  let direction = 1;
  let score = 0;
  let speed = 0.9;
  let intervalTime = 0;
  let interval = 0;
  let isPaused = false;
  let isGameOver = false;

  // to start, and restart the game
  function startGame() {
    isPaused = false;
    isGameOver = false;
    stopBtn.textContent = 'Stop';
    gameOverOverlay.classList.remove('show');

    currentSnake.forEach((index) => squares[index].classList.remove('snake'));
    squares[appleIndex].textContent = '';
    squares[appleIndex].classList.remove('apple');
    clearInterval(interval);
    score = 0;
    randomApple();
    direction = 1;
    scoreDisplay.innerText = score;
    intervalTime = 600; // 1000;
    currentSnake = [2, 1, 0];
    currentIndex = 0;
    currentSnake.forEach((index) => squares[index].classList.add('snake'));
    interval = setInterval(moveOutcomes, intervalTime);
  }

  function stopGame() {
    if (isGameOver) return;

    if (!isPaused) {
      clearInterval(interval);
      interval = 0;
      isPaused = true;
      stopBtn.textContent = 'Resume';
    } else {
      interval = setInterval(moveOutcomes, intervalTime);
      isPaused = false;
      stopBtn.textContent = 'Stop';
    }
  }

  // function that deals width ALL the ove outcomes of the Snake
  function moveOutcomes() {
    // deals with snake hitting border and snake hitting self
    if (
      (currentSnake[0] + width >= width * width && direction === width) || // if snake hits bottom
      (currentSnake[0] % width === width - 1 && direction === 1) || // if snake hits right wall
      (currentSnake[0] % width === 0 && direction === -1) || // if snake hits left wall
      (currentSnake[0] - width < 0 && direction === -width) || // if snake hits the top
      squares[currentSnake[0] + direction].classList.contains('snake') // if snake go into itself
    ) {
      clearInterval(interval); // this will clear the interval if any of the above happen
      interval = 0;
      isGameOver = true;
      stopBtn.textContent = 'Stop';
      gameOverOverlay.classList.add('show');
      return;
    }

    const tail = currentSnake.pop(); // removes last item of the array and shows it
    squares[tail].classList.remove('snake'); // removes class of snake from the TAIL
    currentSnake.unshift(currentSnake[0] + direction); // gives direction to the head of the array

    // deals with snake getting apple
    if (squares[currentSnake[0]].classList.contains('apple')) {
      squares[currentSnake[0]].textContent = '';
      squares[currentSnake[0]].classList.remove('apple');
      squares[tail].classList.add('snake');
      currentSnake.push(tail);
      randomApple();
      score++;
      scoreDisplay.textContent = score;
      clearInterval(interval);
      intervalTime = intervalTime * speed;
      interval = setInterval(moveOutcomes, intervalTime);
    }
    squares[currentSnake[0]].classList.add('snake');
  }

  // generate new apple once apple is eaten
  function randomApple() {
    do {
      appleIndex = Math.floor(Math.random() * squares.length);
      appleEl = squares[appleIndex];
    } while (squares[appleIndex].classList.contains('snake')); // making sure apple
    squares[appleIndex].classList.add('apple');
    squares[appleIndex].textContent = '🍎';
  }

  // assign functions to keycodes
  function control(e) {
    if (e.keyCode === 39) {
      direction = 1; // if we press the right arrow on our keyboard, the snake will go right one
    } else if (e.keyCode === 38) {
      direction = -width; // if we press the up arrow, the snake will go back ten divs, appearing to go up
    } else if (e.keyCode === 37) {
      direction = -1; // if we press left, the snake will go left on div
    } else if (e.keyCode === 40) {
      direction = +width; // if we press down, the snake head will instantly appearing in the div ten divs from where you are now
    }
  }

  document.addEventListener('keyup', control);
  startBtn.addEventListener('click', startGame);
  stopBtn.addEventListener('click', stopGame);
});
