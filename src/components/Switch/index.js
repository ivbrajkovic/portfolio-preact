/**
 * Switch
 */

import { h } from "preact";

import classes from "./style.css";

const Switch = ({ text, id, onChange, checked }) => {
  return (
    <div class={classes.root}>
      {text && <div>{text}</div>}
      <input
        checked={checked}
        id={id}
        type="checkbox"
        onChange={onChange}
        class={classes.input}
      />
      <label for={id} class={classes.label} />
    </div>
  );
};

export default Switch;
