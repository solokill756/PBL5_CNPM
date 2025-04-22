import React from "react";
import { Link } from "react-router-dom";

const FlashCardItem = ({ title, avatar, number, author }) => {
  return (
    <div className="scrollable-item flex-shrink-0 overflow-hidden snap-start basis-1/2 px-2">
      <div className="active:border-solid active:border-2 active:border-red-300 relative p-6 space-y-10 bg-white border-2 cursor-pointer border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 
        transition-all duration-300 hover:shadow-[inset_0px_-4px_0px_0px_rgb(252,165,165)]">
        <Link>
          <span className="mb-4 w-full text-lg font-bold text-gray-900 dark:text-white block overflow-hidden text-ellipsis whitespace-nowrap hover:text-red-400">
            {title}
          </span>
        </Link>
        <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-red-100 rounded-full">
          {number} thuật ngữ
        </span>
        <Link className="flex items-center w-fit">
          <img className="size-8 rounded-full" src={avatar} alt="" />
          <span className="ml-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
            {author}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default FlashCardItem;
