const { add, map } = require('mathjs');
const rotate = require('./rotate');
const hasOverlaps = require('./hasOverlaps');
const getPieceMatrix = require('./getPieceMatrix');

// `occupiedMatrix`
//    - should have `1` values indicating the occupied places on the board, and
//      `0` values elsewhere.
//
// Returns - { validRotation: boolean, kick: [mShift, nShift] }
//    where `kick` is the wall-kick which should be performed
const canRotate = (piece, startPosition, rotations=1, occupiedMatrix, boardSize, wallKickAttempts=[
    [1,0], [-1, 0], [0, 1], [0, -1],
    [1,0], [-2, 0], [0, 2], [0, -2],
]) => {
  const [mPieceSize, nPieceSize] = piece.size();
  const [mSize, nSize] = boardSize;
  const [mPos, nPos] = startPosition;
  let validRotation = true;
  let positionFound = false;
  let rotatedPiece = map(piece, rotate());
  let kick = [0, 0];

  for (let i = 1; i < rotations; i += 1) {
    rotatedPiece = map(rotatedPiece, rotate());
  }

  const shiftAttempts = [[0,0], ...wallKickAttempts];

  shiftAttempts.forEach(([mShift, nShift]) => {
    if (positionFound) {
      return;
    }

    validRotation = true;

    const [mShifted, nShifted] = [mPos + mShift, nPos + nShift];
    const shiftedPieceMatrix = getPieceMatrix(rotatedPiece, [mShifted, nShifted], boardSize);

    process.env.DEBUG === 'all' && console.log('kick', [mShift, nShift]);
    process.env.DEBUG === 'all' && console.log(shiftedPieceMatrix);

    if (hasOverlaps(add(shiftedPieceMatrix, occupiedMatrix))) {
      validRotation = false;
    }
    else {
      rotatedPiece.forEach((v, [m, n]) => {
        if (v > 0) {
          if (m + mShifted > mSize - 1) {
            validRotation = false;
          }
          if (n + nShifted > nSize - 1) {
            validRotation = false;
          }

          if (mShifted < 0) {
            validRotation = false;
          }
          if (nShifted < 0) {
            validRotation = false;
          }
          process.env.DEBUG && console.log([m, n], [mShifted, nShifted], [mSize, nSize], 'validRotation', validRotation);
        }
      });
    }

    if (validRotation) {
      positionFound = true;
      kick = [mShift, nShift];
      process.env.DEBUG && console.log('kick required for rotation:', kick);
    }

  });

  return { validRotation, kick };
}

module.exports = canRotate;

