"use client";

import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef } from "react";

const InfiniteText = ({ input }: { input: string }) => {
  const firstText = useRef(null);
  const secondText = useRef(null);
  const slider = useRef(null);
  let xPercent = 0;
  let direction = -1;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(slider.current, {
      scrollTrigger: {
        trigger: document.documentElement,
        scrub: 0.25,
        start: 0,
        end: window.innerHeight,
        onUpdate: (e) => {
          direction = e.direction * -1;
        },
      },
      x: "-500px",
    });
    requestAnimationFrame(animate);
  }, [direction]);

  const animate = () => {
    if (xPercent < -100) {
      xPercent = 0;
    } else if (xPercent > 0) {
      xPercent = -100;
    }
    gsap.set(firstText.current, { xPercent: xPercent });
    gsap.set(secondText.current, { xPercent: xPercent });
    requestAnimationFrame(animate);
    xPercent += 0.1 * direction;
  };
  return (
    <motion.div className="absolute top-10">
      <div ref={slider} className="relative flex whitespace-nowrap">
        <p
          ref={firstText}
          className="text-white/50 font-[500] text-5xl md:text-[230px]"
        >
          {input}
        </p>

        <p
          ref={secondText}
          className="absolute left-[100%] text-white/50 font-[500] text-5xl md:text-[230px]"
        >
          {input}
        </p>
      </div>
    </motion.div>
  );
};

export default InfiniteText;
