"use client";

import Avatar from "react-avatar";
import Image from "next/image";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";

const Header = () => {
  return (
    <header>
      <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-pink-500 to-[#0055D1] rounded-md filter blur-3xl opacity-50 -z-50" />
        <Image
          src="/trello-logo.png"
          alt="Trello Logo"
          width={300}
          height={100}
          className="w-44 md:w-56 pb-10 md:pb-0 object-contain"
        />

        <div className="flex items-center space-x-2 flex-1 justify-end w-full">
          <form className="flex items-center space-x-5 bg-white rounded-md shadow-md flex-1 md:flex-initial">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            {/* flex-1: take full width */}
            <input
              type="text"
              placeholder="Search"
              className="flex-1 outline-none p-2"
            />
            <button type="submit" hidden>
              Search
            </button>
          </form>
          <Avatar name="Asura" size="50" round />
        </div>
      </div>
      <div className="flex items-center justify-center px-5 md:py-5">
        <p className="flex items-center text-sm font-light py-2 pr-5 shadow-xl rounded-xl w-fit italic max-w-3xl text-[#0055D1]">
          <UserCircleIcon className="inside-block h-10 w-10 text-[#0055D1] mr-1 " />
          GPT is summarizing your task for today...
        </p>
      </div>
    </header>
  );
};

export default Header;
