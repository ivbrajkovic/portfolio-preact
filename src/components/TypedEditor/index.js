/**
 * TypedEditor
 */

import { h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { useSpring, animated, config } from "react-spring";

import classes from "./style.css";

import Typed from "typed.js";

const typedText = [
  "I am^200 <span style='color: var(--typed-color-2);'>Ivan</span>",
  "I am^100 an^150 <span style='color: var(--typed-color-2);'>eng^50ineer</span>",
  "I am^100 a^150 <span style='color: var(--typed-color-2);'>deve^50loper</span>^1000",
];

const TypedEditor = () => {
  const rootRef = useRef();
  const typedRef = useRef();
  const typedElementRef = useRef();

  const [shift, setShift] = useState(false);

  const [props, set] = useSpring(() => ({
    config: config.gentle,
    opacity: 0,
    xy: [0, -100],
    from: { opacity: 0, xy: [0, -100] },
  }));

  useEffect(() => {
    // Typed
    const typedElement = typedElementRef.current;
    typedRef.current = new Typed(typedElement, {
      strings: typedText,
      startDelay: 1000,
      typeSpeed: 50,
      backDelay: 1000,
      backSpeed: 50,
      onComplete: (self) => setShift(true),
    });

    // Spring
    rootRef.current.toggle = (isIntersecting) =>
      set({
        opacity: isIntersecting ? 1 : 0,
        xy: isIntersecting ? [0, 0] : [0, -100],
      });

    return () => {
      const typed = typedRef.current;
      typed.destroy();
    };
  }, []);

  return (
    <animated.div
      ref={rootRef}
      class={`${classes["text-editor-wrap"]} observe rellax`}
      data-observe-callback="toggle"
      data-rellax-speed="-4"
      style={{
        opacity: props.opacity,
        transform: props.xy.interpolate(
          (x, y) => `translate3d(${x}px, ${y}px, 0)`
        ),
      }}
    >
      <div class={classes["title-bar"]}>
        <span class={classes["title"]}>~/portfolio - bash -- 80x10</span>
      </div>

      <div class={`${classes["text-body"]} ${shift ? classes.shift : ""}`}>
        $ <span ref={typedElementRef}></span>
      </div>
    </animated.div>
  );
};

export default TypedEditor;
