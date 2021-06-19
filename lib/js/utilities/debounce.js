module.exports = function debounce(func, wait = 100) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      // eslint-disable-next-line
      func.apply(this, args);
    }, wait);
  };
}
