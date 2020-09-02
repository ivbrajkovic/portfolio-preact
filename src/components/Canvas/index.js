/**
 * Canvas
 */

import { h, Fragment } from "preact";
import { useEffect, useState, useRef, useCallback } from "preact/hooks";
import { useTrail, animated, config } from "react-spring";

import classes from "./style.css";

import { Cubes } from "@lib/cubes/cubes";
import { Particles } from "@lib/particles/particles";

import Switch from "@components/Switch";

const vs = `
  attribute vec4 a_Position;
  uniform mat4 u_Matrix;

  void main(void) {
    gl_Position = u_Matrix * a_Position;
  }
`;

const fs = `
  precision mediump float;
  uniform float u_Opacity;

  void main(void) {
    gl_FragColor = vec4(23, 184, 144, u_Opacity);
  }
`;

const SCROLL_TEXT = ["scroll", "zoom"];
const FPS_TEXT = ["show FPS", "hide FPS"];
const MODEL_TEXT = ["3D cubes", "2D particles"];

const Canvas = ({ pause }) => {
  const fpsRef = useRef();
  const cubesRef = useRef();
  const particlesRef = useRef();
  const canvasCubesRef = useRef();
  const canvasParticlesRef = useRef();

  const [fps, setFps] = useState(0);
  const [model, setModel] = useState(0);
  const [scroll, setScroll] = useState(0);

  const cubesOnWheel = useCallback((e) => cubesRef.current.onWheel(e), []);

  const modelChange = (e) => {
    if (!e.target.checked) {
      particlesRef.current.stop();
      cubesRef.current.start();
      canvasCubesRef.current.style.zIndex = "1";
      canvasParticlesRef.current.style.zIndex = "-1";
      setModel(0);
    } else {
      cubesRef.current.stop();
      particlesRef.current.start();
      canvasCubesRef.current.style.zIndex = "-1";
      canvasParticlesRef.current.style.zIndex = "1";
      setModel(1);
    }
  };

  const fpsChange = (e) => {
    if (e.target.checked) {
      cubesRef.current.showFPS();
      particlesRef.current.showFPS();
      fpsRef.current.style.display = "block";
      setFps(1);
    } else {
      cubesRef.current.hideFPS();
      particlesRef.current.hideFPS();
      fpsRef.current.style.display = "none";
      setFps(0);
    }
  };

  const scroolChange = (e) => {
    if (e.target.checked) {
      canvasCubesRef.current.addEventListener("wheel", cubesOnWheel);
      setScroll(1);
    } else {
      canvasCubesRef.current.removeEventListener("wheel", cubesOnWheel);
      setScroll(0);
    }
  };

  const controls = [
    <Switch id="model" text={MODEL_TEXT[model]} onChange={modelChange} />,
    <Switch id="ftp" text={FPS_TEXT[fps]} onChange={fpsChange} />,
    <>
      {!model && (
        <Switch
          id="scrollSwitch"
          text={SCROLL_TEXT[scroll]}
          onChange={scroolChange}
          checked={scroll}
        />
      )}
    </>,
  ];

  const [trail, set] = useTrail(controls.length, () => ({
    config: config.gentle,
    to: { opacity: !pause ? 1 : 0, x: !pause ? 0 : 100 },
    from: { opacity: 0, x: 100 },
  }));

  useEffect(() => {
    const fps = fpsRef.current;

    //
    // Init cubes
    //
    const canvasCubes = canvasCubesRef.current;
    const cubes = new Cubes(canvasCubes, {
      fps: {
        show: false,
        element: fps,
      },
      color: {
        maxOpacity: 0.87,
      },
    });
    canvasCubes.addEventListener("mousedown", (e) => cubes.onMouseDown(e));
    canvasCubes.addEventListener("mouseup", (e) => cubes.onMouseUp(e));
    canvasCubes.addEventListener("mousemove", (e) => cubes.onMouseMove(e));
    // canvasCubes.addEventListener('wheel', cubesOnWheel);

    cubes.init(vs, fs);
    cubes.start();

    cubesRef.current = cubes;

    //
    // Init particles
    //
    const canvasParticles = canvasParticlesRef.current;
    const particles = new Particles(canvasParticles, {
      fps: {
        show: false,
        element: fps,
      },
      color: {
        // maxOpacity: 0.87,
        connection: { r: 23, g: 184, b: 144 }, // "rgb(23,184,144)", //
      },
    });

    canvasParticles.addEventListener("mousemove", (e) =>
      particles.onMouseMove(e)
    );
    window.addEventListener("resize", (e) => particles.onResize(e));

    particles.init();
    // particles.start();

    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    // Pause drawing on canvas
    cubesRef.current.pause(pause);
    particlesRef.current.pause(pause);

    // Show controls animation
    set({
      opacity: !pause ? 1 : 0,
      x: !pause ? 0 : 100,
    });
  }, [pause]);

  return (
    <div class={classes.root}>
      <div ref={fpsRef} class={classes.fps} />

      <div class={classes["controls-conatiner"]}>
        {trail.map(({ x, ...rest }, i) => {
          return (
            <animated.div
              key={i}
              style={{
                ...rest,
                transform: x.interpolate((x) => `translate3d(${x}px, 0, 0)`),
              }}
            >
              {controls[i]}
            </animated.div>
          );
        })}
      </div>

      <canvas
        // style={{ display: "none" }}
        ref={canvasCubesRef}
        class={classes.canvasCubes}
      ></canvas>
      <canvas
        ref={canvasParticlesRef}
        style={{ zIndex: -1 }}
        class={classes.canvasParticles}
      ></canvas>
    </div>
  );
};

export default Canvas;
