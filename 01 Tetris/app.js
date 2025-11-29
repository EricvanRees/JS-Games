document.addEventListener('DOMContentLoaded' , ()=> {
  // const targets the containing div
  const grid = document.querySelector('.grid');
  // Array.from turns all 200 HTML divs into an array containing 200 div elements, accessible through an index number (0 - 199)
  let squares = Array.from(document.querySelectorAll('.grid div'));
  // a JS variable to access the HTML element with ID "score"
  const ScoreDisplay = document.querySelector('#score');
  // same for HTML element with ID "start-button"
  const StartBtn = document.querySelector('#start-button');
  // set the width of a single div to a constant, to be used later
  const width = 10;

  // The Tetrominoes
  const lTetromino = [
    [1, width+1, width*2+1, 2], // 01 11 21 02
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width+2],
    [width, width*2, width*2+1, width*2+2]
  ]

  const zTetromino = [
    [0, width, width+1, width*2+1],
    [width+1, width+1, width*2, width*2+1],
    [0, width, width+1, width*2+1],
    [width+1, width+1, width*2, width*2+1]
  ]

  const tTetromino = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1]
  ]

  const oTetromino = [
   [0, 1, width, width+1],
   [0, 1, width, width+1],
   [0, 1, width, width+1],
   [0, 1, width, width+1]
  ]

  const iTetromino = [
   [1, width+1, width*2+1, width*3+1],
   [width, width+1, width+2, width+3],
   [1, width+1, width*2+1, width*3+1],
   [width, width+1, width+2, width+3]
  ]

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

  let currentPosition = 4;
  let currentRotation = 0;

  // randomly select a Tetromino and its first rotation
  let random = Math.floor(Math.random() * theTetrominoes.length); 
  let current = theTetrominoes[random][currentRotation];

  // draw first rotation in the first tetromino
  function draw() {
     current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino'); 
    })
  }

  // undraw the Tetromino
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino');
    })
  } 

  // make the tetromino move down every second
  timerId = setInterval(moveDown, 1000);

  // assign functions to keyCodes
  function control(e) {
    if(e.keyCode === 37) {
      moveLeft()
    } else if (e.keyCode === 38) {
      // rotate()
    } else if (e.keyCode === 39) {
      moveRight()
    } else if (e.keyCode === 40) {
      moveDown()
    }
  }
  document.addEventListener('keyup', control)

  // move down function
  function moveDown() {
    undraw();
    currentPosition+=width
    draw();
    freeze();
  }

  // freeze function
  function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'));
      // start a new tetromonio falling
      random = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
    }
  }

  // move the Tetromino left by undrawing it and drawing it again, unless it is at the edge or there is a blockage 
  function moveLeft() {
    // before starting, undraw the Tetromino at its current location
    undraw()
    // define the left edge and if the shape is in it using modulus
    // .some checks if one of the shapes in the "current" array touches the left edge:
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
    // only allow a shape to move left if its position does not touch the left edge:
    if(!isAtLeftEdge) currentPosition -=1;
    // stop the Tetromino if there's already one at its position and push it back one space to the right
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1;
    }
    // after pushing it back one space, draw the shape:
    draw();
  }



})

