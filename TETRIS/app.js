const grid = document.querySelector('.grid');
let squares = Array.from(document.querySelectorAll('.grid div'));
const scoreDisplay = document.querySelector('#score');
const startBtn = document.querySelector('#start-button');
const tryagain = document.querySelector('#again-button');
const width = 10;
let nextRandom = 0;
let timerId;
let score = 0;
const colors = ['red', 'yellow', 'orange', 'purple', 'cyan', 'black', 'green'];

// the tetris blocks
const lTetromino = [
  [0, width, width * 2, 1],
  [2, width + 2, width * 2 + 2, width * 2 + 1],
  [width, width * 2, width * 2 + 1, width * 2 + 2],
  [0, 1, 2, width + 2]
];

const rlTetromino = [
  [0, 1, 2, width],
  [width * 2, width * 2 + 1, width * 2 + 2, width + 2],
  [0, width, width * 2, width * 2 + 1],
  [1, 2, width + 2, width * 2 + 2]
];
const zTetromino = [
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1]
];

const tTetromino = [
  [1, width, width + 1, width + 2],
  [1, width + 1, width + 2, width * 2 + 1],
  [width, width + 1, width + 2, width * 2 + 1],
  [1, width, width + 1, width * 2 + 1]
];

const oTetromino = [
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1]
];

const iTetromino = [
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3]
];

const rzTetromino = [
  [1, width + 1, width, width * 2],
  [width, width + 1, width * 2 + 1, width * 2 + 2],
  [1, width + 1, width, width * 2],
  [width, width + 1, width * 2 + 1, width * 2 + 2]
];

const theTetrominoes = [
  lTetromino,
  zTetromino,
  tTetromino,
  oTetromino,
  iTetromino,
  rzTetromino,
  rlTetromino
];

let currentPosition = 4;
let currentRotation = 0;

// randomly select tetrimino
let random = Math.floor(Math.random() * theTetrominoes.length);
let current = theTetrominoes[random][currentRotation];

//draw the  tetromino
function draw() {
  current.forEach(index => {
    squares[currentPosition + index].classList.add('tetromino');
    squares[currentPosition + index].style.backgroundColor = colors[random];
  });
}

//undraw tetromino
function undraw() {
  current.forEach(index => {
    squares[currentPosition + index].classList.remove('tetromino');
    squares[currentPosition + index].style.backgroundColor = '';
  });
}

//make tetromino move down every second
timerId = setInterval(movedown, 200000);

//assign functions to keycodes
function control(e) {
  if (e.keyCode === 37) {
    moveleft();
  } else if (e.keyCode === 38) {
    rotate();
  } else if (e.keyCode === 39) {
    moveRight();
  } else if (e.keyCode === 40) {
    movedown();
  }
}
document.addEventListener('keyup', control);

//set move down function
function movedown() {
  undraw();
  currentPosition += width;
  draw();
  freeze();
}

//freeze function
function freeze() {
  if (
    current.some(index =>
      squares[currentPosition + index + width].classList.contains('used')
    )
  ) {
    current.forEach(index =>
      squares[currentPosition + index].classList.add('used')
    );
    //start a new tetromino falling
    random = nextRandom;
    nextRandom = Math.floor(Math.random() * theTetrominoes.length);
    current = theTetrominoes[random][currentRotation];
    currentPosition = 2;
    draw();
    displayShape();
    addScore();
    gameOver();
  }
}

//move the tetromino left unless, blocked if at the edge
function moveleft() {
  undraw();
  const isAtLeftEdge = current.some(
    index => (currentPosition + index) % width === 0
  );

  if (!isAtLeftEdge) currentPosition -= 1;

  if (
    current.some(index =>
      squares[currentPosition + index].classList.contains('used')
    )
  ) {
    currentPosition += 1;
  }

  draw();
}

//move the tetromino right, unless is at the edge
function moveRight() {
  undraw();
  const isAtRightEdge = current.some(
    index => (currentPosition + index) % width === width - 1
  );

  if (!isAtRightEdge) currentPosition += 1;

  if (
    current.some(index =>
      squares[currentPosition + index].classList.contains('used')
    )
  ) {
    currentPosition -= 1;
  }

  draw();
}

//rotate the tetromino
function rotate() {
  undraw();
  currentRotation++;
  if (currentRotation === current.length) {
    //if the current rotation gets to 4, make it go back to 0
    currentRotation = 0;
  }
  current = theTetrominoes[random][currentRotation];
  draw();
}

//mini-grid show next tetromino
const displaySquares = document.querySelectorAll('.mini-grid div');
const displayWidth = 4;
const displayIndex = 0;

//the tetrominos without rotations
const upNextTetrominoes = [
  [1, displayWidth + 1, displayWidth * 2 + 1, 2], //l
  [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //z
  [1, displayWidth, displayWidth + 1, displayWidth + 2], //t
  [0, 1, displayWidth, displayWidth + 1], //o
  [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //i
  [1, displayWidth + 1, displayWidth, displayWidth * 2], //rz
  [
    displayWidth * 2,
    displayWidth * 2 + 1,
    displayWidth * 2 + 2,
    displayWidth + 2
  ] //rl
];

//display shape in mini grid
function displayShape() {
  //remove tetromino from entire grid
  displaySquares.forEach(square => {
    square.classList.remove('tetromino');
    square.style.backgroundColor = '';
  });
  upNextTetrominoes[nextRandom].forEach(index => {
    displaySquares[displayIndex + index].classList.add('tetromino');
    displaySquares[displayIndex + index].style.backgroundColor =
      colors[nextRandom];
  });
}

// add functionality to start and pause
startBtn.addEventListener('click', () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  } else {
    draw();
    timerId = setInterval(movedown, 1000);
    nextRandom = Math.floor(Math.random() * theTetrominoes.length);
    displayShape();
  }
});

//add functionality to try again
tryagain.addEventListener('gameOver', () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  } else {
    draw();
    timerId = setInterval(movedown, 1000);
    nextRandom = Math.floor(Math.random() * theTetrominoes.length);
    displayShape();
  }
});
//add score
function addScore() {
  for (let i = 0; i < 199; i += width) {
    const row = [
      i,
      i + 1,
      i + 2,
      i + 3,
      i + 4,
      i + 5,
      i + 6,
      i + 7,
      i + 8,
      i + 9
    ];

    if (row.every(index => squares[index].classList.contains('used'))) {
      score += 10;
      scoreDisplay.innerHTML = score;
      row.forEach(index => {
        squares[index].classList.remove('used');
        squares[index].classList.remove('tetromino');
        squares[index].style.backgroundColor = '';
      });
      const squaresRemoved = squares.splice(i, width);
      squares = squaresRemoved.concat(squares);
      squares.forEach(cell => grid.appendChild(cell));
    }
  }
}

//game over
function gameOver() {
  if (
    current.some(index =>
      squares[currentPosition + index].classList.contains('used')
    )
  ) {
    scoreDisplay.innerHTML = 'GAME OVER :(';
    clearInterval(timerId);
  }
}
