import React from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const FlashCardItem = ({                            
  id,
  title,
  avatar,
  number,
  author,
  onClick,
  loading = false,
}) => {
  return (
    <Link
      to={id ? `/flashcard/${id}` : "#"}
      onClick={onClick}
      className="scrollable-item flex-shrink-0 overflow-hidden snap-start basis-1/2 px-2"
    >
      <div
        className="active:border-solid active:border-2 active:border-red-300 relative p-6 space-y-10 bg-white border-2 cursor-pointer border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 
        transition-all duration-300 hover:shadow-[inset_0px_-4px_0px_0px_rgb(252,165,165)]"
      >
        <span className="mb-4 w-full text-lg font-bold text-gray-900 dark:text-white block overflow-hidden text-ellipsis whitespace-nowrap hover:text-red-400">
          {loading ? <Skeleton width={180} /> : title}
        </span>

        <span
          className={`px-2 py-1 text-xs font-semibold text-gray-800 ${
            loading ? "bg-inherit" : "bg-red-100"
          } rounded-full`}
        >
          {loading ? (
            <Skeleton width={100} height={20} />
          ) : (
            `${number} thuật ngữ`
          )}
        </span>

        <Link to={""} className="flex items-center w-fit">
          {loading ? (
            <>
              <Skeleton circle height={32} width={32} />
              <span className="ml-2">
                <Skeleton width={80} />
              </span>
            </>
          ) : (
            <>
              <img className="size-8 rounded-full" src={avatar} alt="" />
              <span className="ml-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                {author}
              </span>
            </>
          )}
        </Link>
      </div>
    </Link>
  );
};

export default FlashCardItem;
