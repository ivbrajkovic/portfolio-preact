/**
 * Mouse class - handle mouse
 */

class Mouse {
  constructor(
    x = null,
    y = null,
    radius = 120,
    minRadius = 0,
    maxRadius = 180
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.minRadius = minRadius;
    this.maxRadius = maxRadius;
  }

  // change radius
  increseRadius(value) {
    if (this.radius < this.maxRadius) this.radius += value;
  }

  decreseRadius(value) {
    if (this.radius > this.minRadius) this.radius -= value;
  }
}

export default Mouse;
