import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

const FlashcardElement = ({ text, onClick, star, shuffle }) => {
 

  // useEffect(() => {
  //   if (shuffle) {
  //     setShowShuffleStatus(true);
  //     const timeout = setTimeout(() => {
  //       setShowShuffleStatus(false);
  //     }, 3000);

  //     return () => clearTimeout(timeout);
  //   }
  // }, [shuffle]);

  return (
    <div className="relative h-full w-full flex flex-col justify-center">
      <div className="flex-1 flex items-center justify-center">
        <span className="text-2xl font-medium text-center break-words max-w-full">
          {text}
        </span>
      </div>

      <div className="absolute z-10 top-7 right-7">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="flex items-center p-2 rounded-full hover:bg-zinc-100 text-white"
        >
          <FaStar
            className={`size-3.5 ${star ? "text-yellow-400" : "text-gray-400"}`}
          />
        </button>
      </div>   
    </div>
  );
};

export default FlashcardElement;
