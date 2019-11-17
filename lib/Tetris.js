const { map, add, matrix, resize, zeros, subset, index, row, sum } = require('mathjs');
const Tetromino = require('./Tetromino'); // Default PieceClass Implementation
const canShift = require('./canShift');
const canRotate = require('./canRotate');
const rotate = require('./rotate');
const shift = require('./shift');
const getPieceMatrix = require('./getPieceMatrix');
const hasOverlaps = require('./hasOverlaps');

class Tetris {
  constructor(boardSize, startPosition=[0, 3], PieceClass=Tetromino,) {
    if (typeof PieceClass.random !== 'function') {
      throw new Error('`PieceClass.random()` is not a function. Please provide a valid PieceClass implementation.');
    }

    this.gameOver = false;
    this.activeInputs = { rotation: null, move: [0, 0], drop: false };
    this.PieceClass = PieceClass;
    this.boardSize = boardSize;
    this.occupiedMatrix = zeros(boardSize);
    this.startPosition = startPosition;
    this.piece = PieceClass.random();
    this.piecePosition = startPosition;
    this.completedLines = 0;
    this.events = new Map([['clear', []], ['gameover', []]]);
  }

  getRandomPiece() {
    return this.PieceClass.random();
  }

  // Returns a Matrix which is the result of adding the current active piece to
  // the current Occupied Matrix
  getBoardState() {
    return add(this.occupiedMatrix, getPieceMatrix(this.piece, this.piecePosition, this.boardSize));
  }

  // Returns - boolean value indicating if shift was successful
  shift([mShift, nShift]) {
    const [mPos, nPos] = this.piecePosition;

    if (canShift(this.piece, this.piecePosition, [mShift, nShift], this.occupiedMatrix, this.boardSize)) {
      this.piecePosition = [mPos + mShift, nPos + nShift];
      process.env.DEBUG && console.log('Set piecePosition', this.piecePosition);
      return true;
    }
    else {
      if (mShift > 0) {
        this.lockActivePiece();
        this.clearCompletedLines();
        this.spawnNewActivePiece();
      }
      return false;
    }
  }

  rotate(rotations) {
    const { validRotation, kick } = canRotate(
        this.piece,
        this.piecePosition,
        rotations,
        this.occupiedMatrix,
        this.boardSize
    );
    if (validRotation) {
      for (let i = 0; i < rotations; i += 1) {
        this.piece = map(this.piece, rotate());
      }
      const [mKick, nKick] = kick;

      // Wall Kicks
      if (mKick !== 0 || nKick !== 0) {
        const [mPos, nPos] = this.piecePosition;
        this.piecePosition = [mPos + mKick, nPos + nKick];
      }
    }
  }

  lockActivePiece() {
    this.occupiedMatrix = this.getBoardState();
  }

  clearCompletedLines() {
    let completedLines = 0;
    const [mSize, nSize] = this.boardSize;
    for (let i = 0; i < mSize; i += 1) {
      if (sum(row(this.occupiedMatrix, i)) === nSize) {
        completedLines += 1;
        this.occupiedMatrixCopy = this.occupiedMatrix.map(v => v);
        this.occupiedMatrix = this.occupiedMatrixCopy.map((v, [m, n]) => {
          if (m === 0) {
            return 0;
          }
          else if (m <= i) {
            return this.occupiedMatrixCopy.get([m - 1, n]);
          }
          else {
            return v;
          }
        });

        process.env.DEBUG && console.log('Completed Row #', i);
      }
    }

    this.completedLines += completedLines;
    this.events.get('clear').forEach(handler => handler(completedLines));
  }

  spawnNewActivePiece() {
    this.piece = this.getRandomPiece();
    this.piecePosition = this.startPosition;

    if (hasOverlaps(this.getBoardState())) {
      this.gameOver = true;
      this.events.get('gameover').forEach(handler => handler());
    }
  }

  applyInputs() {
    const { rotation, move: [mShift, nShift], drop } = this.activeInputs;
    if (rotation) {
      this.rotate(rotation);
    }

    if (mShift !== 0) {
      this.shift([mShift, 0]);
    }

    if (nShift !== 0) {
      this.shift([0, nShift]);
    }

    if (drop) {
      // shift down until locked
      while (this.shift([1, 0])) {
      }
    }

    this.activeInputs = { rotation: null, move: [0, 0], drop: false };
  }

  on(eventName, handler) {
    this.events.get(eventName).push(handler);
  }
}

module.exports = Tetris;
