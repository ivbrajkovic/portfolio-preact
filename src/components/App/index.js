/**
 * App
 */

import { h } from "preact";
import { useEffect, useState, useRef } from "preact/hooks";

import "./index.css";

import Hero from "@components/Hero";
import Skills from "@components/Skills";
import SocialLinks from "@components/SocialLinks";

// Handle intersection
const handleIntersect = (entries, observer) => {
  entries.forEach((entry) => {
    const callback = entry.target.dataset.observeCallback;
    callback && entry.target[callback](entry.isIntersecting);

    const className = entry.target.dataset.observeClass;
    if (!className) return;

    if (entry.target.dataset.observeTrigger === "enter")
      entry.target.classList.add(className);
    else if (entry.isIntersecting) entry.target.classList.add(className);
    else entry.target.classList.remove(className);
  });
};

// Create intersection observer
const createObserver = (elements) => {
  // const thresholds = [0.2, 0.4, 0.6, 0.8];
  const thresholds = [0];
  const options = {
    root: null,
    rootMargin: "-150px 0px -150px 0px",
    threshold: thresholds,
  };

  const observer = new IntersectionObserver(handleIntersect, options);
  elements.forEach((el) => observer.observe(el));

  return observer;
};

function App() {
  const observerRef = useRef();

  useEffect(() => {
    // const elements = document.querySelectorAll("[data-fnc]");
    const elements = document.querySelectorAll(".observe");
    const observer = createObserver(elements);
    observerRef.current = observer;

    // let rellax = new Rellax(".rellax");
    // return () => rellax.destroy();
  }, []);

  return (
    <>
      <SocialLinks />
      <header>
        <Hero />
      </header>

      <main>
        <Skills />

        <section class="container" style={{ height: "100vh" }}>
          Resume
        </section>
        <section class="container" style={{ height: "100vh" }}>
          Projects
        </section>
      </main>
    </>
  );
}

export default App;
