/**
 * CanvasControls
 */

import { h, fragment } from "preact";
import { useEffect, useState } from "preact/hooks";

import classes from "./style.css";

const SCROLL_TEXT = ["scroll", "zoom"];
const FPS_TEXT = ["show FPS", "hide FPS"];
const MODEL_TEXT = ["3D cubes", "2D particles"];

const CanvasControls = () => {
  const controls = [
    <Switch id="model" text={MODEL_TEXT[object]} onChange={modelChange} />,
    <Switch id="ftp" text={FPS_TEXT[fps]} onChange={ftpChange} />,
    <>
      {object === 0 && (
        <Switch
          id="scroll"
          text={SCROLL_TEXT[scroll]}
          onChange={scrollChange}
          checked={scrollChecked}
        />
      )}
    </>,
  ];

  return <div></div>;
};

export default CanvasControls;
