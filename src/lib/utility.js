/**
 * Debounce function
 * @param {object} func function to call
 * @param {number} delay delay timeout
 */
export function debounce(func, delay) {
  let inDebounce;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
}

/**
 * Generate random number betweean min and max
 * @param {number} min min
 * @param {number} max max
 */
export function random2(min, max, fixed = 0, floor = false) {
  let n;
  if (floor) n = Math.floor(Math.random() * (max - min)) + min;
  n = Math.random() * (max - min) + min;

  if (fixed) return n.toFixed(fixed);
  else return n;
}
export function random(min, max) {
  let num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

export function radToDeg(r) {
  return (r * 180) / Math.PI;
}

export function degToRad(d) {
  return (d * Math.PI) / 180;
}

export function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

// export function (num) { num = Math.round(num * 10) / 10} ;

// const fixToOne = (num) => (num = Math.round(num * 10) / 10);

export function fixToOne(num) {
  return Math.round(num * 10) / 10;
}
