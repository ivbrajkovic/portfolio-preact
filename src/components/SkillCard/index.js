/**
 * SkillCard
 */

import { h } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { useSpring, animated } from "react-spring";
import { fixToOne } from "@lib/utility";

import classes from "./style.css";

// const calc = (x, y) => [
//   0,
//   -(y - window.innerHeight / 2) / 20,
//   (x - window.innerWidth / 2) / 20,
//   1.1,
// ];

// const fixToOne = (num) => (num = Math.round(num * 10) / 10);

const trans = (u, x, y, s) =>
  `translateY(${u}%) perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;
// `translateY(${u}%) perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

const SkillCard = ({ text, percent, color, delay }) => {
  const rootRef = useRef();
  const progressRef = useRef();

  const [props, set] = useSpring(() => ({
    opacity: 0,
    uxys: [30, 0, 0, 1],
    config: { mass: 5, tension: 350, friction: 10 },
  }));

  useEffect(() => {
    const root = rootRef.current;
    const progress = progressRef.current;
    progress.style.stroke = color;

    root.toggle = (isIntersecting) => {
      // isIntersecting = true;

      setTimeout(() => {
        set({
          opacity: isIntersecting ? 1 : 0,
          uxys: isIntersecting ? [0, 0, 0, 1] : [30, 0, 0, 1],
        });
        if (isIntersecting)
          progress.style["stroke-dashoffset"] = 440 - (440 * percent) / 100;
        else progress.style["stroke-dashoffset"] = 440;
      }, delay);
    };
  }, [rootRef.current]);

  const mouseMoveHandler = ({ offsetX: x, offsetY: y, currentTarget }) => {
    const depth = 10; // 20
    const rect = currentTarget.getBoundingClientRect();

    set({
      uxys: [
        0,
        -(y - rect.height / 2) / depth,
        (x - rect.width / 2) / depth,
        1.1,
      ],
    });
  };

  return (
    <animated.div
      ref={rootRef}
      class={`${classes.root} observe`}
      data-observe-callback="toggle"
      // onMouseMove={({ clientX: x, clientY: y }) => set({ uxys: calc(x, y) })}
      onMouseMove={mouseMoveHandler}
      onMouseLeave={() => set({ uxys: [0, 0, 0, 1] })}
      style={{
        // opacity: props.opacity.interpolate((o) => fixToOne(o)),
        // opacity: props.opacity.interpolate((o) => o),
        transform: props.uxys.interpolate(trans),
      }}
    >
      <div class={classes.card}>
        <div class={classes.box}>
          <div class={classes.percent}>
            <svg class={classes.svg}>
              <circle cx="70" cy="70" r="70"></circle>
              <circle ref={progressRef} cx="70" cy="70" r="70"></circle>
            </svg>
            <div class={classes.number}>
              {percent}
              <span>%</span>
            </div>
          </div>
          <div class={classes.text}>{text}</div>
        </div>
      </div>
    </animated.div>
    // </div>
  );
};

export default SkillCard;
