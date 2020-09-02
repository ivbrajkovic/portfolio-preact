//
// Application state
//

import { mat4 } from "gl-matrix";
import { random } from "../utility";

const rotationSpeed = [0.8, 1.5, 1];

const createState = () => {
  return {
    gl: null,
    raf: null,
    program: null,
    fadeIn: true,
    color: {
      opacity: 0.0,
      maxOpacity: 1.0,
    },
    ui: {
      mouse: {
        dragging: false,
        lastX: -1,
        lastY: -1,
      },
    },
    uniforms: {},
    camera: {
      angle: {
        x: 0,
        y: 0,
      },
      radius: 5,
    },
    matrix: {
      // view: null,
      camera: null,
      perspective: null,
    },
    objects: {
      cubes: {
        common: {
          attributes: [
            {
              name: "a_Position",
              location: null,
              size: 3,
              normalize: false,
              stride: 0,
              offset: 0,
              // prettier-ignore
              data: new Float32Array([
              -1, -1, -1,
               1, -1, -1,
               1,  1, -1,
              -1,  1, -1,
              -1, -1,  1,
               1, -1,  1,
               1,  1,  1,
              -1,  1,  1,
            ]),
              buffer: null,
            },
          ],
          index: {
            buffer: null,
            // prettier-ignore
            data: new Uint16Array([
            0, 1, 1, 2, 2, 3, 3, 0,
            4, 5, 5, 6, 6, 7, 7, 4,
            0, 4, 1, 5,
            2, 6, 3, 7,
          ]),
          },
          indexSelected: {
            buffer: null,
            // prettier-ignore
            data: new Uint16Array([
          0, 1, 1, 2, 2, 3, 3, 0,
          4, 5, 5, 6, 6, 7, 7, 4,
          0, 4, 1, 5,
          2, 6, 3, 7,
        ]),
          },
        },
        array: [
          {
            selected: false,
            speed: random(...rotationSpeed),
            matrix: {
              model: mat4.fromTranslation(mat4.create(), [0, 0, 4]),
            },
          },
          {
            selected: false,
            speed: random(...rotationSpeed),
            matrix: {
              model: mat4.fromTranslation(mat4.create(), [-4, 0, 0]),
            },
          },
          {
            selected: false,
            speed: random(...rotationSpeed),
            matrix: {
              model: mat4.fromTranslation(mat4.create(), [4, 0, 0]),
            },
          },
          {
            selected: false,
            speed: random(...rotationSpeed),
            matrix: {
              model: mat4.fromTranslation(mat4.create(), [0, 0, -4]),
            },
          },
        ],
      },
    },
  };
};

export default createState;
