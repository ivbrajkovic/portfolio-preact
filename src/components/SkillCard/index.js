/**
 * SkillCard
 */

import { h } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { useSpring, animated } from "react-spring";

import classes from "./style.css";

const trans = (x, y, s) =>
  `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

const SkillCard = ({ text, percent, color, delay }) => {
  const rootRef = useRef();
  const progressRef = useRef();

  const [props, set] = useSpring(() => ({
    opacity: 0,
    xys: [0, 0, 1],
    config: { mass: 5, tension: 350, friction: 10 },
  }));

  useEffect(() => {
    const root = rootRef.current;
    const progress = progressRef.current;
    progress.style.stroke = color;

    root.toggle = (isIntersecting) => {
      setTimeout(() => {
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
      xys: [-(y - rect.height / 2) / depth, (x - rect.width / 2) / depth, 1.1],
    });
  };

  return (
    <div
      style={{ transitionDelay: delay + "ms" }}
      class="observe fadeUp"
      data-observe-class="show"
    >
      <animated.div
        ref={rootRef}
        class={`${classes.root} observe`}
        data-observe-callback="toggle"
        onMouseMove={mouseMoveHandler}
        onMouseLeave={() => set({ xys: [0, 0, 1] })}
        style={{
          transform: props.xys.interpolate(trans),
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
    </div>
  );
};

export default SkillCard;
