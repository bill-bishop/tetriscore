const hasOverlaps = matrix => {
  let result = false;

  matrix.forEach(value => {
    if (value > 1) {
      result = true;
    }
  });

  return result;
};

module.exports = hasOverlaps;
