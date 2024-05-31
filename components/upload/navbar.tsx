"use client";

import Typewriter from "typewriter-effect";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-indigo-400 h-1/5 w-full top-0 py-5 flex flex-col items-center justify-between">
      <Link href="/">
        <h1 className="text-yellow-500 font-bold text-3xl [text-shadow:-1px_-1px_0_#09090b,1px_-1px_0_#09090b,_-1px_1px_0_#09090b,1px_1px_0_#09090b] drop-shadow-[2px_2px_0_#000] ">
          StudyJom!
        </h1>
      </Link>

      <div className="flex gap-1 text-xl drop-shadow-sm">
        <h1>Contribute to the community! Share your</h1>
        <span className="text-pink-300 underline">
          <Typewriter
            options={{
              strings: [
                "Notes",
                "Cheatsheet",
                "Flashcards",
                "Past Year Papers",
              ],
              autoStart: true,
              loop: true,
              deleteSpeed: 50,
              delay: 50,
            }}
          />
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
