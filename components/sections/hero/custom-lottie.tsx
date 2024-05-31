"use client";

import { cn } from "@/lib/cn";
import { DotLottiePlayer } from "@dotlottie/react-player";
import "@dotlottie/react-player/dist/index.css";
import { motion } from "framer-motion";

const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    scale: 0,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.3,
      duration: 0.3,
      ease: [0, 0.71, 0.2, 1.01],
      scale: {
        type: "spring",
        damping: 7,
        stiffness: 100,
        restDelta: 0.001,
      },
    },
  },
};

export default function CustomLottiePlayer({
  animationData,
  className,
  ...props
}: { animationData: any; className?: string }) {
  return (
    <motion.div
      variants={fadeInAnimationVariants}
      initial="initial"
      animate="animate"
      className={cn("mt-0", className)}
      {...props}
    >
      <DotLottiePlayer src={animationData} autoplay loop />
    </motion.div>
  );
}
