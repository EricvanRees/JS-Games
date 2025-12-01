document.addEventListener('DOMContentLoaded' , ()=> {
  // const targets the containing div
  const grid = document.querySelector('.grid');
  // Array.from turns all 200 HTML divs into an array containing 200 div elements, accessible through an index number (0 - 199)
  let squares = Array.from(document.querySelectorAll('.grid div'));
  // a JS variable to access the HTML element with ID "score" 
  const scoreDisplay = document.querySelector('#score');
  // same for HTML element with ID "start-button"
  const startBtn = document.querySelector('#start-button');
  // set the width of a single div to a constant, to be used later
  const width = 10;
  // used in display and freeze functions below:
  let nextRandom = 0;
  let timerId;

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
 //  timerId = setInterval(moveDown, 1000);

  // assign functions to keyCodes
  function control(e) {
    if(e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }

  document.addEventListener('keyup', control);

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
      // nextRandom has a default value of zero, and is set to "random":
      random = nextRandom
      // nextRandom is set to a new, random value and used when displayShape is called below to select a random shape for the mini-grid:
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      // "nextRandom" is now interchanged with "random" below:
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
    }
  }

  // move the Tetromino left by undrawing it and drawing it again, unless it is at the edge or there is a blockage 
  function moveLeft() {
    // before starting, undraw the Tetromino at its current location
    undraw();
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

  // move the tetromino right, unless it is at the edge or there is a blockage
  function moveRight() {
    // undraw the current shape
    undraw();
    // check if the shape touches the right edge
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
    // move  shape to the right if it does not touch the right edge
    if(!isAtRightEdge) currentPosition += 1
    // change position of the shape if it touches a div with a class of 'taken'
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1
    }
    // finally, draw the shape on the screen
    draw();
  }

  // rotate the Tetromino
  function rotate() {
    undraw();
    currentRotation ++;
    // if the current rotation gets to 4, make it go back to zero
    if(currentRotation === current.length) {
      currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    draw();
  }

  // show up-next Tetromino in mini-grid display

  // select all divs inside mini-grid
  const displaySquares = document.querySelectorAll('.mini-grid div');
  // tell JS the width of mini-grid
  const displayWidth = 4;
  // tell JS to talk to mini-grid only 
  let displayIndex = 0;
  

  // the Tetrominos without rotations
  const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2],
    [0, displayWidth, displayWidth+1, displayWidth*2+1],
    [1, displayWidth, displayWidth+1, displayWidth+2],
    [0, 1, displayWidth, displayWidth+1],
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]
  ];
  
  // display the shape in the mini-grid display
  function displayShape() {
    // remove any trace of a tetromino from the entire grid
     displaySquares.forEach(square => {
      square.classList.remove('tetromino'); 
    })
    upNextTetrominoes[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tetromino');
    })
  }

  // add functionality to the button
  startBtn.addEventListener('click', ()=> {
    if (timerId) {
      clearInterval(timerId)
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 1000);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape();
    }
  })
  
})

