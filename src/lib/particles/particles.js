/**
  Particles animation on canvas
 */

import Mouse from "./mouse";
import Point from "./particle";
import { debounce } from "../../lib/utility";
import { resizeCanvasToDisplaySize } from "../cubes/lib/gl-utils";

const LINE_WIDTH = 2;
const AMOUNT_DELTA = 12;
const CONNECT_DISTANCE = 120;

const defaults = {
  fps: {
    show: false,
    element: null,
  },
  color: {
    opacity: 0,
    maxOpacity: 1,
    particle: { r: 255, g: 255, b: 255 },
    connection: { r: 255, g: 255, b: 255 },
  },
};

//
// Particle animation class
//
export class Particles {
  constructor(canvas, { fps, color, distanceThreshold, lineWidth }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.raf = null;
    this.fadeIn = false;
    this.then = 0;
    this.last = 0;
    this.points = [];
    this.mouse = new Mouse();
    this.lineWidth = lineWidth || LINE_WIDTH;
    this.fps = { ...defaults.fps, ...fps };
    this.color = { ...defaults.color, ...color };
    this.distanceThreshold = distanceThreshold || CONNECT_DISTANCE;
  }

  //
  // Initialization
  //
  init() {
    resizeCanvasToDisplaySize(this.canvas, window.devicePixelRatio);
    this.populate();
  }

  populate() {
    this.points = [];

    const amount = Math.ceil(
      ((this.canvas.width + this.canvas.height) / 100) * AMOUNT_DELTA
    );

    for (let i = 0; i < amount; i++)
      this.points.push(new Point(this.canvas.width, this.canvas.height));

    return amount;
  }

  //
  // Event handlers
  //
  onMouseMove = (e) => {
    this.mouse.x = e.offsetX;
    this.mouse.y = e.offsetY;
    this.mouse.increseRadius(10);
  };

  onResize = debounce(() => {
    if (resizeCanvasToDisplaySize(this.canvas, window.devicePixelRatio)) {
      this.populate();
    }
  }, 250);

  //
  // RAF animation
  //
  tick = (now) => {
    // console.log("Particles -> tick -> now", now);

    // Stop animation if fade out and opacity is zero
    if (!this.raf) return;
    if (!this.fadeIn && this.color.opacity === 0.0) {
      this.raf = null;
      return;
    }

    now *= 0.001; // convert to seconds

    let deltaTime = now - this.then;
    this.then = now;

    // Smooth fade on restart animation
    if (deltaTime > 0.2) deltaTime = 0.016;

    if (this.fadeIn && this.color.opacity !== this.color.maxOpacity)
      this.color.opacity = fadeInOpacity(this.color.opacity, deltaTime);
    if (!this.fadeIn && this.color.opacity > 0.0)
      this.color.opacity = fadeOutOpacity(this.color.opacity, deltaTime);

    this.animate();

    if (this.fps.show && Date.now() - this.last > 1000) {
      this.fps.element.innerText = `FPS: ${(1 / deltaTime).toFixed(1)}`;
      this.last = Date.now();
    }

    this.raf = requestAnimationFrame(this.tick);
  };

  animate = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawScene();
    this.mouse.decreseRadius(2);
  };

  start = () => {
    this.fadeIn = true;
    this.raf = requestAnimationFrame(this.tick);
  };
  stop = () => (this.fadeIn = false);

  pause = (paused) => {
    if (paused && this.fadeIn) {
      cancelAnimationFrame(this.raf);
      this.raf = null;
    } else if (!paused && this.fadeIn)
      this.raf = requestAnimationFrame(this.tick);
  };

  showFPS = () => (this.fps.show = true);
  hideFPS = () => (this.fps.show = false);

  //
  // Draw scene on canvas
  //
  drawScene() {
    let dx, dy, distance, opacityValue;

    for (let i = 0; i < this.points.length; i++) {
      // Connect points
      for (let j = i; j < this.points.length; j++) {
        dx = this.points[i].x - this.points[j].x;
        dy = this.points[i].y - this.points[j].y;
        // distance = Math.hypot(dx, dy);
        distance = Math.sqrt(dx * dx + dy * dy); // 2 time faster

        // In treshold distance
        if (distance < this.distanceThreshold) {
          opacityValue =
            (1 - distance / this.distanceThreshold) * this.color.opacity || 0;
          this.ctx.strokeStyle = `rgba(${this.color.connection.r},${this.color.connection.g},${this.color.connection.b},${opacityValue})`;
          this.ctx.lineWidth = 2;
          this.ctx.beginPath();
          this.ctx.moveTo(this.points[i].x, this.points[i].y);
          this.ctx.lineTo(this.points[j].x, this.points[j].y);
          this.ctx.stroke();
        }
      }

      // Draw points
      this.points[i].draw(
        this.ctx,
        `rgba(${this.color.particle.r},${this.color.particle.g},${this.color.particle.b},${this.color.opacity})`
      );
      this.points[i].update(this.mouse);
      this.points[i].move(this.canvas);
    }
  }
}

//
// Animate start / stop
//
function fadeInOpacity(opacity, delta) {
  if (opacity < 1) opacity += delta;
  if (opacity > 1) opacity = 1;
  return opacity;
}
function fadeOutOpacity(opacity, delta) {
  if (opacity > 0) opacity -= delta;
  if (opacity < 0) opacity = 0;
  return opacity;
}
