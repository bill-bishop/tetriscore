const { add, map } = require('mathjs');
const shift = require('./shift');
const hasOverlaps = require('./hasOverlaps');
const getPieceMatrix = require('./getPieceMatrix');

// `pieceMatrix`, `shiftedPieceMatrix`, and `boardMatrix` should be 2D arrays of
// equal size.
//
// `pieceMatrix`
//    - should have `1` values indicating the piece's position on the board, and
//      `0` values elsewhere.
//
// `move`
//    - 2-element array: [mShift, nShift]
//
// `boardMatrix`
//    - should have `1` values indicating the occupied places on the board, and
//      `0` values elsewhere.
const canShift = (piece, position, move, boardMatrix, boardSize) => {
  const pieceMatrix = getPieceMatrix(piece, position, boardSize);
  const shiftedPieceMatrix = map(pieceMatrix, shift(move));
  const [mShift, nShift] = move;
  const [mSize, nSize] = pieceMatrix.size();
  let validShift = true;

  process.env.DEBUG && console.log('Piece Matrix size', mSize, nSize);

  pieceMatrix.forEach((value, [m, n]) => {
    if (value > 0) {
      // for positive mShift, piece matrix should have no 1's in the bottom row
      if (mShift > 0) {
        if (m + 1 === mSize) {
          validShift = false;
        }
      }
      // for negative mShift, piece matrix should have no 1's in the top row
      else if (mShift < 0) {
        if (m === 0) {
          validShift = false;
        }
      }
      // for positive nShift, piece matrix should have no 1's in the right-most row
      if (nShift > 0) {
        if (n + 1 === nSize) {
          validShift = false;
        }
      }
      // for negative nShift, piece matrix should have no 1's in the left-most row
      else if (nShift < 0) {
        if (n === 0) {
          validShift = false;
        }
      }
    }
  });

  // for any resulting shift, adding shiftedPieceMatrix + boardMatrix should have no 2's
  if (hasOverlaps(add(shiftedPieceMatrix, boardMatrix))) {
    validShift = false;
  }

  process.env.DEBUG && console.log('canShift()', validShift);

  return validShift;
}

module.exports = canShift;

