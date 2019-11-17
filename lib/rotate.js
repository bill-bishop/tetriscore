const rotate = () => (v, [m, n], mat) => {
  const [mSize, nSize] = mat.size();
  return mat.get([nSize - 1 - n, m])
}

module.exports = rotate;
