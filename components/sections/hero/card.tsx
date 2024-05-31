import { cn } from "@/lib/cn";
import * as React from "react";
import { FaRegWindowMinimize } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";

const Card = ({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "bg-white w-[600px] h-[500px] border-2 border-solid border-black rounded-3xl overflow-hidden flex flex-col justify-between",
        className
      )}
    >
      <header className="bg-green-300 h-10 flex flex-row gap-2 items-center p-2 border-b-2 border-solid border-black">
        <IoIosClose className="text-2xl text-black" />
        <div className="bg-white border-2 border-solid border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] h-3 w-3" />
        <FaRegWindowMinimize className="ml-2 text-xl text-black" />
      </header>
      <div className="w-full flex flex-col gap-10 items-center justify-center p-10">
        <h1 className="text-black font-bold text-5xl text-center">{title}</h1>
        <p className="text-black text-center text-sm">{description}</p>
      </div>
      <div className="p-2 border-t-2 border-solid border-black">
        <button
          type="button"
          className="text-black h-12 float-right border-black border-2 p-2.5 bg-[#A6FAFF] hover:bg-[#79F7FF] transition-all hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-[#00E1EF] rounded-md"
        >
          Browse Now!
        </button>
      </div>
    </div>
  );
};

export default Card;
