const { matrix } = require('mathjs');

const PieceType = {
  I: 0,
  J: 1,
  L: 2,
  O: 3,
  S: 4,
  T: 5,
  Z: 6,
};

const pieces = () => [...Object.values(PieceType), ...Object.values(PieceType)].sort(() => Math.random() - 0.5);
const bag = [];

class Tetromino {
  static random() {
    if (bag.length === 0) {
      bag.push(...pieces());
    }
    return Tetromino.matrix(bag.pop());
  }

  static matrix(type) {
    switch (type) {
      case PieceType.I:
        return matrix([[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]]);
      case PieceType.J:
        return matrix([[1,0,0], [1,1,1], [0,0,0]]);
      case PieceType.L:
        return matrix([[0,0,1], [1,1,1], [0,0,0]]);
      case PieceType.O:
        return matrix([[0,0,0,0], [0,1,1,0], [0,1,1,0], [0,0,0,0]]);
      case PieceType.S:
        return matrix([[0,1,1], [1,1,0], [0,0,0]]);
      case PieceType.Z:
        return matrix([[1,1,0], [0,1,1], [0,0,0]]);
      case PieceType.T:
        return matrix([[0,1,0], [1,1,1], [0,0,0]]);
      default:
        throw 'oopsie';
    }
  }
}

module.exports = Tetromino;
module.exports.PieceType = PieceType;
