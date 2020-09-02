/**
 * Hero
 */

import { h } from "preact";
import { useEffect, useState, useRef } from "preact/hooks";

import classes from "./style.css";

import Canvas from "@components/Canvas";
import TypedEditor from "@components/TypedEditor";

const Hero = () => {
  const heroRef = useRef();
  const [pause, setPause] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;

    hero.toggle = (isIntersecting) => {
      if (isIntersecting) setPause(false);
      else setPause(true);
    };
  }, [heroRef.current]);

  return (
    <div
      ref={heroRef}
      data-observe-class="show"
      data-observe-callback="toggle"
      class={`${classes.root} observe fadeIn`}
    >
      <Canvas pause={pause} />
      <div className={classes["typed-container"]}>
        <TypedEditor />
      </div>
    </div>
  );
};

export default Hero;
