/**
 * Skills
 */

import { h } from "preact";

import classes from "./style.css";

import SkillCard from "@components/SkillCard";

const Skills = () => {
  return (
    <section class="container">
      <header
        id="skills"
        class={`${classes.title} observe fadeUp`}
        data-observe-class="show"
      >
        <h2>
          <span>01</span> Professional
        </h2>
        <h4>level in web programming</h4>
      </header>

      <div class={classes.wrapper}>
        <SkillCard
          percent={90}
          text="html"
          color="rgba(0,255,67,0.87)"
          delay={100}
        />
        <SkillCard
          percent={85}
          text="css"
          color="rgb(0,161,255,0.87)"
          delay={200}
        />
        <SkillCard
          percent={75}
          text="js"
          color="rgb(255,4,247,.87)"
          delay={300}
        />
      </div>
    </section>
  );
};

export default Skills;
