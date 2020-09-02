/**
 * SocialLinks
 */

import { h } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { useTrail, animated, config } from "react-spring";

import classes from "./style.css";

const links = [
  <a
    href="https://github.com/ivbrajkovic?tab=repositories"
    target="_blank"
    rel="noopener noreferrer"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  </a>,
  <a
    href="https://www.linkedin.com/in/ivan-brajkovi%C4%87-5b9883143/"
    target="_blank"
    rel="noopener noreferrer"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
      <g>
        <g transform="matrix(1 0 0 -1 0 1536)">
          <path d="M161.2,705.5h147.4v442.8H161.2V705.5z M318.2,1284.8c-0.4,22.1-8.1,40.4-23,54.9c-14.9,14.5-34.7,21.7-59.3,21.7c-24.7,0-44.8-7.2-60.3-21.7c-15.5-14.5-23.3-32.8-23.3-54.9c0-21.7,7.5-39.9,22.6-54.6c15.1-14.7,34.8-22,59-22h0.6c25.1,0,45.3,7.3,60.6,22C310.5,1245,318.2,1263.1,318.2,1284.8z M691.4,705.5h147.4v253.9c0,65.5-15.5,115.1-46.6,148.7c-31,33.6-72.1,50.4-123.1,50.4c-57.8,0-102.3-24.9-133.3-74.6h1.3v64.4H389.6c1.3-28.1,1.3-175.7,0-442.8H537v247.6c0,16.2,1.5,28.1,4.5,35.7c6.4,14.9,16,27.5,28.7,38c12.8,10.4,28.5,15.6,47.2,15.6c49.3,0,74-33.4,74-100.2V705.5z M990,1342.3V729.8c0-50.6-18-93.9-53.9-129.8C900.1,564,856.9,546,806.3,546H193.8c-50.6,0-93.9,18-129.8,53.9C28,635.9,10,679.1,10,729.8v612.5c0,50.6,18,93.9,53.9,129.8s79.2,53.9,129.8,53.9h612.5c50.6,0,93.9-18,129.8-53.9C972,1436.1,990,1392.9,990,1342.3z" />
        </g>
      </g>
    </svg>
  </a>,

  <a href="mailto:ivan.brajkovic@icloud.com">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
      <g>
        <g>
          <path d="M41.3,243.3c26.6,14.3,394.6,212,408.3,219.4c13.7,7.4,31.5,10.8,49.3,10.8c17.9,0,35.6-3.5,49.3-10.8C562,455.4,930,257.6,956.6,243.3c26.6-14.3,51.8-70,2.9-70H38.4C-10.5,173.3,14.7,229,41.3,243.3z M968.9,363.3C938.7,379,566.7,572.8,548.2,582.5c-18.5,9.7-31.5,10.8-49.3,10.8c-17.9,0-30.8-1.1-49.3-10.8C431.1,572.8,61.2,379,31,363.2c-21.2-11.1-21,1.9-21,11.9c0,10,0,397.1,0,397.1c0,22.9,30.8,54.4,54.4,54.4h871.1c23.6,0,54.4-31.6,54.4-54.4c0,0,0-387,0-397C990,365.2,990.2,352.2,968.9,363.3L968.9,363.3z" />
        </g>
      </g>
    </svg>
  </a>,
];

const SocialLinks = () => {
  const [trail, set] = useTrail(links.length, () => ({
    config: config.gentle,
    opacity: 0,
    x: -100,
    from: { opacity: 0, x: -100 },
  }));

  useEffect(() => {
    set({ opacity: 1, x: 0 });
  }, []);

  return (
    <div class={classes.root}>
      {trail.map(({ x, ...rest }, i) => {
        return (
          <animated.div
            key={i}
            style={{
              ...rest,
              transform: x.interpolate((x) => `translate3d(${x}px, 0, 0)`),
            }}
          >
            {links[i]}
          </animated.div>
        );
      })}
    </div>
  );
};

export default SocialLinks;

// {/* github */}
// <div
//   class="animate"
//   data-animate="onload"
//   style={{ transitionDelay: "100ms" }}
// ></div>

// {/* linkedin */}
// <div
//   class="animate fadeLeft100"
//   data-animate="onload"
//   style={{ transitionDelay: "200ms" }}
// ></div>

// {/* mail */}
// <div
//   class="animate fadeLeft100"
//   data-animate="onload"
//   style={{ transitionDelay: "300ms" }}
// ></div>