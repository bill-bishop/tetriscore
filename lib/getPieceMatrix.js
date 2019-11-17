const { map, resize } = require('mathjs');
const shift = require('./shift');

// `piece` - a small (piece-sized) matrix
//
// `position` - 2-element Array containing the X1 & X2 values of the Piece's
// position
//
// `boardSize` - 2-element Array containing the size of the Matrix
//
// Returns - a `boardSize` size Matrix with `piece` rendered at `position`
const getPieceMatrix = (piece, position, boardSize) => map(resize(piece, boardSize), shift(position));

module.exports = getPieceMatrix;
