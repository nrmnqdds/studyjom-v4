"use client";

import { cn } from "@/lib/cn";
import { DotLottiePlayer } from "@dotlottie/react-player";
import "@dotlottie/react-player/dist/index.css";

const LottiePlayer = ({
  animationData,
  size,
  className,
  ...props
}: {
  animationData: string | Record<string, unknown>;
  size?: number;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "w-full h-full flex items-center justify-center",
        className
      )}
      style={{
        width: size ? size * 10 : "100%",
      }}
    >
      <DotLottiePlayer src={animationData} {...props} autoplay loop />
    </div>
  );
};

export default LottiePlayer;
