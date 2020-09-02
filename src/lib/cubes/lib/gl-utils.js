/**
 * Resize a canvas to match the size its displayed.
 * @param {HTMLCanvasElement} canvas The canvas to resize.
 * @param {number} [multiplier] amount to multiply by.
 *    Pass in window.devicePixelRatio for native pixels.
 * @return {boolean} true if the canvas was resized.
 * @memberOf module:glUtils
 */
export function resizeCanvasToDisplaySize(canvas, multiplier) {
  multiplier = multiplier || 1;
  const width = (canvas.clientWidth * multiplier) | 0;
  const height = (canvas.clientHeight * multiplier) | 0;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    return true;
  }
  return false;
}

/**
 * Get WebGL context from canvas object
 */
export function getWebGLContext(canvas) {
  let webGLContext;

  /* Context name can vary depending on the browser used */
  /* Store the context name in an array and check its validity */
  let names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
  for (let i = 0; i < names.length; ++i) {
    try {
      webGLContext = canvas.getContext(names[i]);
    } catch {}
    if (webGLContext) break;
  }

  if (!webGLContext) {
    alert("*** Unable to initialize WebGL ***");
    throw new Error("*** Unable to initialize WebGL ***");
  }

  return webGLContext;
}

/**
 * Initialize shaders and compile program
 * @param {object} state Application state
 */
export function initShaders(gl, vs, fs) {
  const vshader = gl.createShader(gl.VERTEX_SHADER);
  const fshader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(vshader, vs);
  gl.shaderSource(fshader, fs);
  gl.compileShader(vshader);
  gl.compileShader(fshader);

  const program = gl.createProgram();
  gl.attachShader(program, vshader);
  gl.attachShader(program, fshader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Link failed: " + gl.getProgramInfoLog(program));
    console.error("vs info-log: " + gl.getShaderInfoLog(vshader));
    console.error("fs info-log: " + gl.getShaderInfoLog(fshader));
  }

  gl.useProgram(program);

  // Delete shader objectafter attach
  gl.deleteShader(vshader);
  gl.deleteShader(fshader);

  return program;
}

/**
 * Setup GEL for drawing
 * @param {object} state Application state
 */
export function setupWebGL(gl) {
  gl.clearColor(0.0, 0.0, 0.0, 0.0); // Clear to black, fully opaque
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}

/**
 * Get uniform location from program
 * @param {object} state Application state
 * @param {string} uniforms Uniform name
 */
export function getUniformLocations(state, uniforms) {
  uniforms.forEach((uniform) => {
    const location = state.gl.getUniformLocation(state.program, uniform);
    state.uniforms[uniform] = location;
  });
}

/**
 * Setup indices data to applicatio state
 * @param {object} state Application state
 */
export function setIndices(state) {
  const { gl, objects } = state;

  for (const [_, { common }] of Object.entries(objects)) {
    const { index, indexSelected } = common;

    index.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index.buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, index.data, gl.STATIC_DRAW);

    indexSelected.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexSelected.buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexSelected.data, gl.STATIC_DRAW);
  }
}

/**
 * Setup vertex data into application state
 * @param {object} state Application state
 */
export function setAttributes(state) {
  const { gl, program, objects } = state;

  // Iterate each object in state
  Object.values(objects).forEach((object) => {
    const attributes = object.common.attributes;

    // Iterate each attribute in object atributes
    attributes.forEach((attribute) => {
      // Create buffer in GPU
      if (attribute.data) {
        attribute.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, attribute.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, attribute.data, gl.STATIC_DRAW);
      }

      // Get attribute location
      attribute.location = gl.getAttribLocation(program, attribute.name);
      gl.vertexAttribPointer(
        attribute.location,
        attribute.size,
        gl.FLOAT,
        attribute.normalize,
        attribute.stride,
        attribute.offset
      );

      // Enable attribute array
      gl.enableVertexAttribArray(attribute.location);
    });
  });
}
