const Tetris = require('../lib/Tetris');
const Rotation = require('../lib/Rotation');
const Tetromino = require('../lib/Tetromino');

let score = 0;
const tetris = new Tetris([20, 10]);

tetris.on('clear', (linesCleared) => {
  score += linesCleared * linesCleared * 1000;
});

tetris.on('gameover', () => {
  console.log('GAME OVER');
  process.exit();
});

const printBoard = () => {
  let board = '\n_ _ _ _ _ _ _ _ _ _ ';
  tetris.getBoardState().forEach((v, [m, n]) => {
    if (n === 0) {
      board += '\n|';
    }
    board += v ? '# ' : ' .';
    if (n + 1 === tetris.boardSize[1]) {
      board += '|';
    }
  });
  console.log(`\n\tScore:\t${score}` + board + '\n_ _ _ _ _ _ _ _ _ _ ')
};

let loop;
const tick = (speed=1500, speedUp=29555) => {
  loop && clearInterval(loop);
  loop = setInterval(() => {
    tetris.shift([1, 0]);
    printBoard();
  }, speed);

  setTimeout(() => {
    tick(speed * 0.75);
  }, speedUp);
}

tick();


const { stdin } = process;

stdin.setRawMode( true );
stdin.resume();
stdin.setEncoding( 'utf8' );
stdin.on( 'data', function( key ){
  // ctrl-c
  if ( key === '\u0003' ) {
    process.exit();
  }

  // up arrow
  if (key == '\u001B\u005B\u0041') {
    tetris.activeInputs.rotation = Rotation.Clockwise;
    process.env.DEBUG && console.log('up');
  }

  // right
  if (key == '\u001B\u005B\u0043') {
    tetris.activeInputs.move = [0, 1];
    process.env.DEBUG && console.log('right');
  }

  // down arrow
  if (key == '\u001B\u005B\u0042') {
    tetris.activeInputs.move = [1, 0];
    process.env.DEBUG && console.log('down');
  }

  // left
  if (key == '\u001B\u005B\u0044') {
    tetris.activeInputs.move = [0, -1];
    process.env.DEBUG && console.log('left');
  }

  if (key === ' ') {
    tetris.activeInputs.rotation = Rotation.CounterClockwise;
    process.env.DEBUG && console.log('space');
  }

  if (key === 'd' || key === 'D') {
    tetris.activeInputs.drop = true;
    process.env.DEBUG && console.log('space');
  }

  tetris.applyInputs();
  printBoard();
});
