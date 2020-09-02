//
// Entry point
//

import createState from "./state";
import { degToRad, debounce } from "../utility";
import {
  getWebGLContext,
  initShaders,
  setupWebGL,
  resizeCanvasToDisplaySize,
  setAttributes,
  setIndices,
  getUniformLocations,
} from "./lib/gl-utils";

import { mat4 } from "gl-matrix";

export class Cubes {
  constructor(canvas, opt) {
    this.state = createState();
    this.state.gl = getWebGLContext(canvas);
    this.state.canvas = this.state.gl.canvas;
    this.state.fps = {
      show: false,
      element: null,
      ...opt?.fps,
    };
    this.state.color = {
      ...this.state.color,
      ...opt?.color,
    };
  }

  //
  // Initial setup
  //
  init = (vs, fs) => {
    // Create canvas element and get WebGL context from it.
    // Compile program from shader sources
    this.state.program = initShaders(this.state.gl, vs, fs);

    // Setup GL for drawing scene.
    // Set clear color, enable DEPTH_TEST, and set viewport.
    setupWebGL(this.state.gl);

    setPerspective(this.state);

    // Setup position vertex data and save buffer reference
    setAttributes(this.state);

    // Setup indices buffer and save buffer reference
    setIndices(this.state);

    // Find uniform loaction in program
    getUniformLocations(this.state, ["u_Matrix", "u_Opacity"]);

    // initEvents(this.state);
    // resizeCanvasToDisplaySize(this.state.canvas, window.devicePixelRatio);
    // this.state.gl.viewport(
    //   0,
    //   0,
    //   this.state.canvas.width,
    //   this.state.canvas.height,
    // );
    this.state.gl.viewport(
      0,
      0,
      this.state.gl.drawingBufferWidth,
      this.state.gl.drawingBufferHeight
    );
  };

  //
  // Animation with RAF
  //
  then = 0;
  last = 0;
  tick = (now) => {
    // console.log("Cubes -> tick -> now", now);

    // Stop animation if fade out and opacity is zero
    if (!this.state.raf) return;
    if (!this.state.fadeIn && this.state.color.opacity === 0.0) {
      this.state.raf = null;
      return;
    }

    // console.log('Cubes -> tick -> now', now);
    now *= 0.001; // convert to seconds

    let deltaTime = now - this.then;
    this.then = now;

    // Smooth fade on restart animation
    if (deltaTime > 0.2) deltaTime = 0.016;

    drawScene(this.state, deltaTime);

    if (this.state.fps.show && Date.now() - this.last > 1000) {
      this.state.fps.element.innerText = `FPS: ${(1 / deltaTime).toFixed(1)}`;
      this.last = Date.now();
    }

    // console.log("Cubes -> tick -> fps", (1 / deltaTime).toFixed(1));

    // requestAnimationFrame(animate.bind(null, Date.now(), state));
    this.state.raf = requestAnimationFrame(this.tick);
  };

  start = () => {
    // if (!this.state.raf) {
    this.state.raf = requestAnimationFrame(this.tick);
    this.state.fadeIn = true;
    // }
  };

  stop = () => (this.state.fadeIn = false);

  pause = (paused) => {
    if (paused && this.state.fadeIn) {
      cancelAnimationFrame(this.state.raf);
      this.state.raf = null;
    } else if (!paused && this.state.fadeIn)
      this.state.raf = requestAnimationFrame(this.tick);
  };

  //
  // Mouse events
  //
  onMouseDown = (e) => {
    this.state.ui.mouse.dragging = true;
    this.state.ui.mouse.lastX = e.clientX;
    this.state.ui.mouse.lastY = e.clientY;
  };

  onMouseUp = (e) => {
    this.state.ui.mouse.dragging = false;
  };

  onMouseMove = (e) => {
    // The rotation speed factor
    // dx and dy here are how for in the x or y direction the mouse moved
    if (this.state.ui.mouse.dragging) {
      let factor = 100 / this.state.gl.canvas.height; // adjust for speed
      let dx = factor * (e.clientX - this.state.ui.mouse.lastX);
      let dy = factor * (e.clientY - this.state.ui.mouse.lastY);

      // update the latest angle
      this.state.camera.angle.x = this.state.camera.angle.x + dy;
      this.state.camera.angle.y = this.state.camera.angle.y + dx;

      // updateCameraAngle();
    }
    // update the last mouse position
    this.state.ui.mouse.lastX = e.clientX;
    this.state.ui.mouse.lastY = e.clientY;
  };

  onWheel = (e) => {
    e.preventDefault();
    if (!e.deltaMode) this.state.camera.radius += e.deltaY * 0.006;
    else if (e.deltaMode === 1) this.state.camera.radius += e.deltaY * 0.15;
  };
  // { passive: true }

  showFPS = () => (this.state.fps.show = true);

  hideFPS = () => (this.state.fps.show = false);
}

//
// Setup perspective matrix
//
function setPerspective(state) {
  const perspective = mat4.create();
  // const field = (75 * Math.PI) / 180;
  const field = degToRad(75);
  const aspect = state.gl.canvas.clientWidth / state.gl.canvas.clientHeight;
  // mat4.perspective(pm, field, aspect, 1e-4, 1e4);
  mat4.perspective(perspective, field, aspect, 0.1, 100);
  state.matrix.perspective = perspective;
}

//
// Animation fade in/out
//
function fadeIn(opacity, delta) {
  if (opacity < 1) opacity += delta;
  if (opacity > 1) opacity = 1;
  return opacity;
}
function fadeOut(opacity, delta) {
  if (opacity > 0) opacity -= delta;
  if (opacity < 0) opacity = 0;
  return opacity;
}

//
// Draw objects on scene
//
function drawScene(state, deltaTime) {
  // Resize canvas if window is resized mantaining aspect ratio
  if (resizeCanvasToDisplaySize(state.gl.canvas, window.devicePixelRatio)) {
    state.gl.viewport(0, 0, state.gl.canvas.width, state.gl.canvas.height);
    setPerspective(state);
  }

  // Clear the canvas AND the depth buffer
  state.gl.clear(state.gl.COLOR_BUFFER_BIT | state.gl.DEPTH_BUFFER_BIT);

  if (state.fadeIn && state.color.opacity < state.color.maxOpacity)
    state.color.opacity = fadeIn(state.color.opacity, deltaTime);
  if (!state.fadeIn && state.color.opacity > 0)
    state.color.opacity = fadeOut(state.color.opacity, deltaTime);

  // Set the uniforms that are the same for all objects.
  state.gl.uniform1f(state.uniforms.u_Opacity, state.color.opacity);

  // render all object from state
  for (const [key, value] of Object.entries(state.objects)) {
    state.objects[key].array.forEach((obj) => {
      const indexBuffer = obj.selected
        ? state.objects[key].common.indexSelected.buffer
        : state.objects[key].common.index.buffer;

      const indexBufferLenght = obj.selected
        ? state.objects[key].common.indexSelected.data.length
        : state.objects[key].common.index.data.length;

      state.gl.bindBuffer(state.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

      updateCube(obj.matrix.model, obj.speed, deltaTime);
      updateCamera(state, deltaTime);

      // ----------------------------------------------------
      // mvp matrix
      const mvp = mat4.create();

      // V * M
      mat4.multiply(mvp, state.matrix.camera, obj.matrix.model);

      // P * MV => (M * V * P)
      // mat4.multiply(mvp, perspectiveMatrix, mv);
      mat4.multiply(mvp, state.matrix.perspective, mvp);

      // ----------------------------------------------------
      // // P * M
      // mat4.multiply(mvp, matrix.perspective, mm);

      // Set the uniforms that are the same for all objects.
      state.gl.uniformMatrix4fv(state.uniforms.u_Matrix, false, mvp);

      // Draw the geometry.
      state.gl.drawElements(
        state.gl.LINES,
        indexBufferLenght,
        state.gl.UNSIGNED_SHORT,
        0
      );
    });
  }
}

//
// Camera animation
//
function updateCamera(state, deltaTime) {
  const camera = mat4.create();

  !state.ui.mouse.dragging && (state.camera.angle.y += deltaTime * 10);

  mat4.rotateX(camera, camera, degToRad(state.camera.angle.x));
  mat4.rotateY(camera, camera, degToRad(state.camera.angle.y));
  mat4.translate(camera, camera, [0, 0, state.camera.radius * 1.5]);
  mat4.invert(camera, camera);

  state.matrix.camera = camera;
}

//
// Cube animation
//
function updateCube(modelMatrix, cubeRotation, deltaTime) {
  mat4.rotate(
    modelMatrix, // destination matrix
    modelMatrix, // matrix to rotate
    deltaTime * cubeRotation, // amount to rotate in radians
    // degToRad(cubeRotation), // amount to rotate in radians
    [0, 0, 1]
  ); // axis to rotate around (Z)
  mat4.rotate(
    modelMatrix, // destination matrix
    modelMatrix, // matrix to rotate
    deltaTime * cubeRotation * 0.7, // amount to rotate in radians
    // degToRad(cubeRotation) * 0.7, // amount to rotate in radians
    [0, 1, 0]
  ); // axis to rotate around (X)
}
