"use client";

import Avatar from "react-avatar";
import Image from "next/image";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useBoardStore } from "@/store/BoardStore";

const Header = () => {
  const [searchString, setSearchString] = useBoardStore((state) => [
    state.searchString,
    state.setSearchString,
  ]);

  return (
    <header>
      <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl mb-10">
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
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400 ml-1" />
            <input
              type="text"
              placeholder="Search"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
              className="flex-1 outline-none p-2"
            />
            <button type="submit" hidden>
              Search
            </button>
          </form>
          <Avatar name="Asura" size="50" round />
        </div>
      </div>
    </header>
  );
};

export default Header;
