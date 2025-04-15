import React from "react";

const FlashCardItem = ({ name, avatar, number, author }) => {
  return (
    <div className="scrollable-item flex-shrink-0 overflow-hidden snap-start basis-1/2 px-2">
      <div className="relative p-6 space-y-10 bg-white border-2 cursor-pointer border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 
        transition-all duration-300 hover:shadow-[inset_0px_-4px_0px_0px_rgb(252,165,165)]">
        <span className="mb-4 w-full text-xl font-bold text-gray-900 dark:text-white block overflow-hidden text-ellipsis whitespace-nowrap">
          {name}
        </span>
        <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-red-100 rounded-full">
          {number} thuật ngữ
        </span>
        <div className="flex items-center">
          <img className="size-8 rounded-full" src={avatar} alt="" />
          <span className="ml-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
            {author}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FlashCardItem;
