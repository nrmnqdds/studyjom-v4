import { cn } from "@/lib/cn";
import * as React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "rounded-md border-2 border-black p-[10px] font-bold shadow-default outline-none transition-all focus:translate-x-[3px] focus:translate-y-[3px] focus:shadow-none text-black",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
