const shift = ([mShift=0, nShift=0]) => (v, [m, n], mat) => {
  const [mSize, nSize] = mat.size();
  return mat.get([(m + mSize - mShift) % mSize, (n + nSize - nShift) % nSize])
}

module.exports = shift;
